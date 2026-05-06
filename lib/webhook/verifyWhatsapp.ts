import crypto from "crypto";

export function verifyWhatsappToken(
  mode: string | null,
  token: string | null,
  challenge: string | null
): { valid: boolean; challenge: string | null } {
  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return { valid: true, challenge };
  }
  return { valid: false, challenge: null };
}

export function verifyWhatsappSignature(payload: string, signatureHeader: string | null): boolean {
  if (!signatureHeader || !process.env.WHATSAPP_APP_SECRET) return false;
  
  const signatureParts = signatureHeader.split("=");
  if (signatureParts.length !== 2 || signatureParts[0] !== "sha256") return false;
  
  try {
    const expectedHash = crypto
      .createHmac("sha256", process.env.WHATSAPP_APP_SECRET)
      .update(payload)
      .digest("hex");
      
    return crypto.timingSafeEqual(Buffer.from(signatureParts[1]), Buffer.from(expectedHash));
  } catch (error) {
    console.error("[WhatsApp] Signature verification error:", error);
    return false;
  }
}
