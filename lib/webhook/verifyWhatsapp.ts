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
