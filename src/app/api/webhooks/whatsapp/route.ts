import { NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;

/**
 * Handle GET requests for Webhook Verification
 * Meta will send a GET request to this endpoint with a challenge string when
 * you configure the Webhook URL in the Meta App Dashboard.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Check if a request is for verification
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Meta Webhook Verified!");
      // Respond with the challenge token from the request
      return new NextResponse(challenge, { status: 200 });
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return new NextResponse("Invalid request", { status: 400 });
}

/**
 * Handle POST requests from Meta
 * Whenever a user sends a message to the business number, Meta hits this endpoint.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's a WhatsApp status update or message
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages) {
            // WE RECEIVED A MESSAGE
            const message = change.value.messages[0];
            const contact = change.value.contacts[0];
            
            const fromNumber = message.from; // Phone number without the +
            const messageId = message.id;
            const messageType = message.type;
            
            console.log(`Received ${messageType} from ${fromNumber}: ${messageId}`);

            // TODO: Match `fromNumber` in Supabase `clients` table
            // TODO: Extract text component and save to `checkins` table

            if (messageType === "text") {
              console.log("Message Body:", message.text.body);
            }
          }
        }
      }
      
      // WhatsApp requires a 200 OK response immediately, otherwise it will keep retrying
      return NextResponse.json({ status: "success" }, { status: 200 });
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("Meta Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
