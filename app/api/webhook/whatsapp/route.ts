import { NextRequest, NextResponse } from "next/server";
import { verifyWhatsappSignature } from "@/lib/webhook/verifyWhatsapp";
import crypto from "crypto";

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

async function handleInboundMessage({
  from,
  body,
  messageId,
  phoneNumberId,
  timestamp
}: {
  from: string,
  body: string,
  messageId?: string,
  phoneNumberId?: string,
  timestamp?: string
}) {
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  const normalizedFrom = from.startsWith('+') ? from : `+${from}`;

  // Handle opt-out keywords — required by Meta for marketing templates
  const stopKeywords = ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT", "OPTOUT"];
  const normalizedText = body.trim().toUpperCase();

  if (stopKeywords.some(keyword => normalizedText.includes(keyword))) {
    const { data: client } = await supabase
      .from("clients")
      .select("id, coach_id, full_name")
      .eq("whatsapp_number", normalizedFrom)
      .single();

    if (client) {
      await supabase
        .from("clients")
        .update({
          status: "inactive",
          health_notes: `Opted out via WhatsApp on ${new Date().toISOString()}. Keyword: ${body}`,
        })
        .eq("id", client.id);

      await supabase.from("whatsapp_log").insert({
        client_id: client.id,
        coach_id: client.coach_id,
        direction: "inbound",
        message_type: "opt_out",
        message_content: body,
        status: "processed",
        sent_at: new Date().toISOString(),
      });

      console.log(`[WhatsApp] Opt-out from ${client.full_name} (${from})`);
    }

    return;
  }

  // Look up client by phone number
  const { data: client } = await supabase
    .from("clients")
    .select("id, coach_id, full_name")
    .eq("whatsapp_number", normalizedFrom)
    .single();

  if (!client) {
    console.warn(`[WhatsApp] Unknown sender: ${from}`);
    await supabase.from("whatsapp_log").insert({
      direction: "inbound",
      message_type: "checkin",
      message_content: body,
      status: "unknown_sender",
      sent_at: new Date().toISOString(),
    });
    return;
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
          ? `${openCheckin.raw_reply}\n${body}`
          : body,
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
      message_content: body,
      status: "received",
      sent_at: new Date().toISOString(),
    });
  }
}

// POST — Incoming client replies from Meta Cloud API
export async function POST(request: NextRequest) {
  // Read raw body first — required for signature verification
  const rawBody = await request.text();

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  // Detect Kapso payload by presence of message.kapso field
  const isKapso = payload?.message?.kapso !== undefined;

  if (isKapso) {
    // Verify X-Webhook-Signature from Kapso
    const kapsoSecret = process.env.KAPSO_WEBHOOK_SECRET;
    const receivedSig = request.headers.get('x-webhook-signature');

    if (kapsoSecret && receivedSig) {
      const expectedSig = crypto
        .createHmac('sha256', kapsoSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSig !== receivedSig) {
        console.error('[Kapso] Signature mismatch — expected:', expectedSig, 'received:', receivedSig);
      }
    }

    // Always 200 for test payloads
    if (payload.test === true) {
      console.log('[Kapso] Test acknowledged');
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const msg = payload.message;
    if (!msg) {
      return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
    }

    if (msg?.kapso?.direction === 'inbound' && msg.type === 'text' && msg?.text?.body) {
      const rawFrom = (msg.from || '').replace(/\s/g, '');
      const from = rawFrom.startsWith('+') ? rawFrom : `+${rawFrom}`;

      console.log('[Kapso] Inbound message from:', from);
      
      try {
        await handleInboundMessage({
          from,
          body: msg.text.body,
          messageId: msg.id,
          phoneNumberId: payload.phone_number_id,
          timestamp: msg.timestamp
        });
      } catch (err) {
        console.error('[Kapso] Handler error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // --- Existing Meta direct webhook handling below — do not change ---
  try {
    const signature = request.headers.get("x-hub-signature-256");

    if (!verifyWhatsappSignature(rawBody, signature)) {
      console.error("[WhatsApp] Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const message = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message || message.type !== "text") {
      return NextResponse.json({ status: "ignored" });
    }

    const from: string = message.from;
    const text: string = message.text?.body;

    if (!from || !text) {
      return NextResponse.json({ status: "invalid_data" });
    }

    await handleInboundMessage({
      from,
      body: text,
      messageId: message.id,
      timestamp: message.timestamp
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[WhatsApp] Webhook error:", error);
    // Return 200 even on error — Meta retries any non-200 response
    // which floods logs and degrades quality score
    return NextResponse.json({ status: "error_logged" });
  }
}