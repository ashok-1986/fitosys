interface WhatsAppMessagePayload {
    phone: string;
    message: string;
}

export async function sendWhatsAppMessage(payload: WhatsAppMessagePayload) {
    // Stub implementation
    console.log("Sending WA:", payload.phone, payload.message);
}
