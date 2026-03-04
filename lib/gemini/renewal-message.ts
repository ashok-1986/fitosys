// lib/gemini/renewal-message.ts
import { geminiFlash } from "./client";

export async function generateRenewalMessage(
  coachName: string,
  clientName: string,
  programName: string,
  endDate: string,
  stats: {
    sessionsCompleted: number;
    weeksCompleted: number;
    avgEnergyScore: number;
    weightChange?: number;
  }
): Promise<string> {
  const weightLine =
    stats.weightChange
      ? `Weight change: ${stats.weightChange > 0 ? "+" : ""}${stats.weightChange} kg`
      : "";

  const prompt = `
Write a WhatsApp renewal message from Coach ${coachName} to client ${clientName}.

Program: ${programName} ending ${endDate}
Stats:
- ${stats.sessionsCompleted} sessions completed
- ${stats.weeksCompleted} weeks of check-ins
- Average energy score: ${stats.avgEnergyScore}/10
${weightLine}

Rules:
- Warm and personal, not salesy
- Reference their actual stats
- Include [PAYMENT_LINK] placeholder for the payment URL
- End with coach's name
- Under 80 words
- WhatsApp formatting ok (bold with *asterisks* if needed)
- No generic phrases like "amazing journey" or "keep it up"
`;

  const result = await geminiFlash.generateContent(prompt);
  return result.response.text();
}