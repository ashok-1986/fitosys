import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — AiSensy webhook verification
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response("Webhook verified", { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// POST — Incoming client replies
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // AiSensy message structure
    const message = body?.message;
    const from = body?.sender?.phone;    // client phone number
    const text = body?.message?.text;    // client reply text
    const timestamp = body?.timestamp;

    if (!from || !text) {
      return NextResponse.json({ status: "ignored" });
    }

    // Look up client in Supabase by phone number
    const { data: client } = await supabase
      .from("clients")
      .select("id, coach_id, name")
      .eq("phone", from)
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
      processed: false,      // Gemini AI processes this in Monday cron
    });

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("[WhatsApp] Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
