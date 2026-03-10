/**
 * Fitosys - WhatsApp Cloud API Entry Point
 * ---------------------------------------
 * Re-exports template functions from the versioned templates file
 * to maintain backward compatibility while allowing provider swaps.
 */

export * from "./whatsapp/templates";

/**
 * Generic text message sender for non-template notifications
 * (Requires the recipient to have messaged the business in the last 24 hours)
 */
export async function sendTextMessage(to: string, text: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.error("[WhatsApp] Missing Meta API credentials for text message");
    return null;
  }

  // Normalize phone
  const normalizedPhone = to.replace(/\s+/g, "").replace(/^\+/, "");

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: normalizedPhone,
          type: "text",
          text: { body: text },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`[WhatsApp] Text message failed for ${to}:`, error);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("sendTextMessage Error:", error);
    return null;
  }
}
