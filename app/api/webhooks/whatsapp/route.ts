import { NextRequest, NextResponse } from "next/server";

// GET — Meta webhook verification
export async function GET(req: NextRequest) {
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
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  try {
    const body = await req.json();

    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message || message.type !== "text") {
      return NextResponse.json({ status: "ignored" });
    }

    const from: string = message.from;
    const text: string = message.text?.body;

    if (!from || !text) {
      return NextResponse.json({ status: "invalid_data" });
    }

    // Handle opt-out keywords — required by Meta for marketing templates
    const stopKeywords = ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT", "OPTOUT"];
    const normalizedText = text.trim().toUpperCase();

    if (stopKeywords.some(keyword => normalizedText.includes(keyword))) {
      const { data: client } = await supabase
        .from("clients")
        .select("id, coach_id, full_name")
        .eq("whatsapp_number", from)
        .single();

      if (client) {
        await supabase
          .from("clients")
          .update({
            status: "inactive",
            health_notes: `Opted out via WhatsApp on ${new Date().toISOString()}. Keyword: ${text}`,
          })
          .eq("id", client.id);

        await supabase.from("whatsapp_log").insert({
          client_id: client.id,
          coach_id: client.coach_id,
          direction: "inbound",
          message_type: "opt_out",
          message_content: text,
          status: "processed",
          sent_at: new Date().toISOString(),
        });

        console.log(`[WhatsApp] Opt-out from ${client.full_name} (${from})`);
      }

      return NextResponse.json({ status: "opt_out_processed" });
    }

    // Look up client by phone number
    const { data: client } = await supabase
      .from("clients")
      .select("id, coach_id, full_name")
      .eq("whatsapp_number", from)
      .single();

    if (!client) {
      console.warn(`[WhatsApp] Unknown sender: ${from}`);
      await supabase.from("whatsapp_log").insert({
        direction: "inbound",
        message_type: "checkin",
        message_content: text,
        status: "unknown_sender",
        sent_at: new Date().toISOString(),
      });
      return NextResponse.json({ status: "unknown_sender" });
    }

    // Find open check-in for this client this week
    const today = new Date().toISOString().split("T")[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const { data: openCheckin } = await supabase
      .from("checkins")
      .select("id, raw_reply")
      .eq("client_id", client.id)
      .eq("coach_id", client.coach_id)
      .gte("check_date", weekStartStr)
      .lte("check_date", today)
      .is("responded_at", null)
      .maybeSingle();

    if (openCheckin) {
      // Update existing check-in record with client reply
      // If client sends multiple messages, concatenate them
      await supabase
        .from("checkins")
        .update({
          raw_reply: openCheckin.raw_reply
            ? `${openCheckin.raw_reply}\n${text}`
            : text,
          responded_at: new Date().toISOString(),
          processed: false,
        })
        .eq("id", openCheckin.id);
    } else {
      // No open check-in found — log as unsolicited reply for audit trail
      await supabase.from("whatsapp_log").insert({
        coach_id: client.coach_id,
        client_id: client.id,
        direction: "inbound",
        message_type: "checkin",
        message_content: text,
        status: "received",
        sent_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("[WhatsApp] Webhook error:", error);
    // Return 200 even on error — Meta retries any non-200 response
    // which floods logs and degrades quality score
    return NextResponse.json({ status: "error_logged" });
  }
}