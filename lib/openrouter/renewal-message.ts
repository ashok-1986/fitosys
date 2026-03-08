// lib/openrouter/renewal-message.ts
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Fitosys",
    },
});

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

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: process.env.OPENROUTER_MODEL || "qwen/qwen-2.5-72b-instruct",
    temperature: 0.5,
    max_tokens: 128,
    top_p: 0.95,
  });

  return completion.choices[0].message.content || "";
}
