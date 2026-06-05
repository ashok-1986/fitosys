const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;

interface WhatsAppMessagePayload {
    phone: string;
    message: string;
}

import { decryptPhone } from "../crypto";

export async function sendWhatsAppMessage(payload: WhatsAppMessagePayload): Promise<void> {
    const rawPhone = decryptPhone(payload.phone);
    const normalizedPhone = rawPhone
        .replace(/\s+/g, "")
        .replace(/^\+/, "");

    const body = {
        messaging_product: "whatsapp",
        to: normalizedPhone,
        type: "text",
        text: {
            body: payload.message,
        },
    };

    try {
        const response = await fetch(
            `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(
                `[WhatsApp] Failed to send freeform message to ${payload.phone}:`,
                JSON.stringify(data)
            );
            return;
        }

        console.log(
            `[WhatsApp] Freeform message sent to ${payload.phone}:`,
            data?.messages?.[0]?.id
        );
    } catch (err) {
        console.error(
            `[WhatsApp] Exception sending freeform message to ${payload.phone}:`,
            err
        );
    }
}
