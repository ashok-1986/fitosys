import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// GET — Meta webhook verification
export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// POST — Incoming client replies from Meta Cloud API
export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const body = await req.json();

    // Meta Webhook structure: entry[0].changes[0].value.messages[0]
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== "text") {
      return NextResponse.json({ status: "ignored" });
    }

    const from = message.from;              // client phone number (WA ID)
    const text = message.text?.body;        // client reply text

    if (!from || !text) {
      return NextResponse.json({ status: "invalid_data" });
    }

    // P0 FIX: Handle STOP keywords for opt-out compliance
    const stopKeywords = ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT", "OPTOUT"];
    const normalizedText = text.trim().toUpperCase();
    
    if (stopKeywords.some(keyword => normalizedText.includes(keyword))) {
      // Look up client and mark as opted-out
      const { data: client } = await supabase
        .from("clients")
        .select("id, coach_id, full_name, whatsapp_number")
        .eq("whatsapp_number", from)
        .single();

      if (client) {
        // Update client status to inactive
        await supabase
          .from("clients")
          .update({ 
            status: "inactive",
            health_notes: `Opted out via WhatsApp on ${new Date().toISOString()}. Keyword: ${text}`
          })
          .eq("id", client.id);

        // Log the opt-out event
        await supabase.from("whatsapp_log").insert({
          client_id: client.id,
          coach_id: client.coach_id,
          direction: "inbound",
          message_type: "opt_out",
          content: text,
          status: "processed",
          sent_at: new Date().toISOString(),
        });

        console.log(`[WhatsApp] Opt-out received from ${client.full_name} (${from})`);
      }

      return NextResponse.json({ status: "opt_out_processed" });
    }

    // Look up client in Supabase by phone number
    const { data: client } = await supabase
      .from("clients")
      .select("id, coach_id, full_name")
      .eq("whatsapp_number", from)
      .single();

    if (!client) {
      console.warn(`[WhatsApp] Unknown sender: ${from}`);
      return NextResponse.json({ status: "unknown_sender" });
    }

    // Store the check-in reply
    await supabase.from("checkins").insert({
      client_id: client.id,
      coach_id: client.coach_id,
      raw_reply: text,
      received_at: new Date().toISOString(),
      source: "whatsapp",
      processed: false,      // AI processes this in Monday cron
    });

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("[WhatsApp] Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
