/**
 * Fitosys - Meta WhatsApp Cloud API Service
 */

const META_API_URL = "https://graph.facebook.com/v18.0";
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.META_WHATSAPP_TOKEN;

interface MetaSendMessageResponse {
  messaging_product: string;
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
}

/**
 * Helper to ensure the phone number is correctly formatted for Meta (E.164 without the +)
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  return phone.replace(/\D/g, "");
}

/**
 * Sends a pre-approved Meta Template message.
 * Required for initiating conversations outside the 24-hour customer service window.
 */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string = "en",
  components: any[] = [] // Optional dynamic variables for the template
): Promise<MetaSendMessageResponse | null> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.error("Missing Meta WhatsApp API credentials in environment.");
    return null;
  }

  try {
    const formattedPhone = formatPhoneNumber(to);
    
    const response = await fetch(`${META_API_URL}/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
          components: components,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Meta API Template Error:", JSON.stringify(data, null, 2));
      throw new Error(`Failed to send template message: ${data.error?.message || "Unknown error"}`);
    }

    return data;
  } catch (error) {
    console.error("sendTemplateMessage Error:", error);
    return null;
  }
}

/**
 * Sends a standard text message.
 * ONLY works if the user has messaged the business within the last 24 hours.
 */
export async function sendTextMessage(to: string, text: string): Promise<MetaSendMessageResponse | null> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.error("Missing Meta WhatsApp API credentials in environment.");
    return null;
  }

  try {
    const formattedPhone = formatPhoneNumber(to);
    
    const response = await fetch(`${META_API_URL}/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "text",
        text: {
          preview_url: false,
          body: text,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Meta API Text Error:", JSON.stringify(data, null, 2));
      throw new Error(`Failed to send text message: ${data.error?.message || "Unknown error"}`);
    }

    return data;
  } catch (error) {
    console.error("sendTextMessage Error:", error);
    return null;
  }
}

/**
 * Sends an interactive message (like a list or buttons).
 * ONLY works if the user has messaged the business within the last 24 hours.
 */
export async function sendInteractiveMessage(to: string, interactiveObject: any): Promise<MetaSendMessageResponse | null> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.error("Missing Meta WhatsApp API credentials in environment.");
    return null;
  }

  try {
    const formattedPhone = formatPhoneNumber(to);
    
    const response = await fetch(`${META_API_URL}/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "interactive",
        interactive: interactiveObject,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Meta API Interactive Error:", JSON.stringify(data, null, 2));
      throw new Error(`Failed to send interactive message: ${data.error?.message || "Unknown error"}`);
    }

    return data;
  } catch (error) {
    console.error("sendInteractiveMessage Error:", error);
    return null;
  }
}
