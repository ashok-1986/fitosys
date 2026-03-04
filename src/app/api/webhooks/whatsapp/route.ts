import { NextRequest, NextResponse } from "next/server";

// GET /api/webhooks/whatsapp — WhatsApp verification challenge
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return new NextResponse(challenge, { status: 200 });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// POST /api/webhooks/whatsapp — Incoming message from client
export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        // Use service client since this is a webhook (no user session)
        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabase = await createServiceClient();

        // Parse incoming message (Interakt/WATI format)
        // This handles the common payload shape; adjust per provider
        const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages || [];

        for (const message of messages) {
            if (message.type !== "text") continue;

            const senderPhone = message.from; // e.g. "919876543210"
            const text = message.text?.body || "";
            const messageId = message.id;

            // Log inbound message
            await supabase.from("whatsapp_log").insert({
                direction: "inbound",
                message_type: "checkin",
                message_content: text,
                whatsapp_message_id: messageId,
                status: "delivered",
            });

            // Find the client by phone number (try with and without +)
            const { data: client } = await supabase
                .from("clients")
                .select("id, coach_id, full_name")
                .or(
                    `whatsapp_number.eq.${senderPhone},whatsapp_number.eq.+${senderPhone}`
                )
                .eq("status", "active")
                .limit(1)
                .maybeSingle();

            if (!client) {
                console.warn(
                    `[WhatsApp Webhook] No active client found for phone: ${senderPhone}`
                );
                continue;
            }

            // Update the whatsapp_log with coach & client info
            await supabase
                .from("whatsapp_log")
                .update({
                    coach_id: client.coach_id,
                    client_id: client.id,
                })
                .eq("whatsapp_message_id", messageId);

            // Find the most recent pending check-in for this client
            const { data: checkin } = await supabase
                .from("checkins")
                .select("id, raw_reply")
                .eq("client_id", client.id)
                .eq("coach_id", client.coach_id)
                .is("responded_at", null)
                .order("check_date", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!checkin) {
                console.warn(
                    `[WhatsApp Webhook] No pending check-in for client ${client.full_name}`
                );
                continue;
            }

            // Parse the check-in response
            const parsed = parseCheckinResponse(text);

            // Append to raw reply (client might send multiple messages)
            const existingRaw = checkin.raw_reply || "";
            const newRaw = existingRaw
                ? `${existingRaw}\n---\n${text}`
                : text;

            // Update the check-in record
            await supabase
                .from("checkins")
                .update({
                    raw_reply: newRaw,
                    weight_kg: parsed.weight_kg,
                    sessions_completed: parsed.sessions_completed,
                    energy_score: parsed.energy_score,
                    notes: parsed.notes,
                    responded_at: new Date().toISOString(),
                })
                .eq("id", checkin.id);

            console.log(
                `[WhatsApp Webhook] Check-in updated for ${client.full_name}: weight=${parsed.weight_kg}, sessions=${parsed.sessions_completed}, energy=${parsed.energy_score}`
            );
        }
    } catch (err) {
        console.error("[WhatsApp Webhook] Processing error:", err);
        // Return 200 even on error so WhatsApp doesn't retry
    }

    return NextResponse.json({ received: true });
}

// ──── Check-in Response Parser ────
// Attempts to extract structured data from freeform WhatsApp replies

function parseCheckinResponse(text: string): {
    weight_kg: number | null;
    sessions_completed: number | null;
    energy_score: number | null;
    notes: string | null;
} {
    const lines = text
        .split(/[\n,;]+/)
        .map((l) => l.trim())
        .filter(Boolean);

    let weight_kg: number | null = null;
    let sessions_completed: number | null = null;
    let energy_score: number | null = null;
    const noteParts: string[] = [];

    for (const line of lines) {
        const lower = line.toLowerCase();

        // Weight pattern: "73.2 kg", "73.2kg", "weight: 73.2"
        const weightMatch = lower.match(
            /(?:weight[:\s]*)?(\d{2,3}(?:\.\d{1,2})?)\s*(?:kg|kgs)?/
        );
        if (weightMatch && !weight_kg) {
            const val = parseFloat(weightMatch[1]);
            if (val >= 30 && val <= 250) {
                weight_kg = val;
                continue;
            }
        }

        // Sessions pattern: "3 sessions", "sessions: 4", "3/5"
        const sessionsMatch = lower.match(
            /(?:sessions?[:\s]*)?(\d{1,2})(?:\s*(?:sessions?|\/\d))?/
        );
        if (sessionsMatch && !sessions_completed && lower.includes("session")) {
            sessions_completed = parseInt(sessionsMatch[1]);
            continue;
        }

        // Energy pattern: "energy: 7", "7/10", "energy 8"
        const energyMatch = lower.match(
            /(?:energy[:\s]*)?(\d{1,2})(?:\s*(?:\/\s*10|out\s*of\s*10))/
        );
        if (energyMatch && !energy_score) {
            const val = parseInt(energyMatch[1]);
            if (val >= 1 && val <= 10) {
                energy_score = val;
                continue;
            }
        }

        // Also try standalone single digit with energy keyword
        const energyAlt = lower.match(/energy[:\s]+(\d{1,2})/);
        if (energyAlt && !energy_score) {
            const val = parseInt(energyAlt[1]);
            if (val >= 1 && val <= 10) {
                energy_score = val;
                continue;
            }
        }

        // If line has just a number in the right range and we're missing data,
        // try to fill in order: weight, sessions, energy
        const pureNum = line.match(/^(\d{1,3}(?:\.\d{1,2})?)$/);
        if (pureNum) {
            const val = parseFloat(pureNum[1]);
            if (!weight_kg && val >= 30 && val <= 250) {
                weight_kg = val;
                continue;
            } else if (!sessions_completed && val >= 0 && val <= 20) {
                sessions_completed = Math.round(val);
                continue;
            } else if (!energy_score && val >= 1 && val <= 10) {
                energy_score = Math.round(val);
                continue;
            }
        }

        // Everything else is a note
        noteParts.push(line);
    }

    return {
        weight_kg,
        sessions_completed,
        energy_score,
        notes: noteParts.length > 0 ? noteParts.join(". ") : null,
    };
}
