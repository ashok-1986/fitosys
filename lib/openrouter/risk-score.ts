// lib/openrouter/risk-score.ts
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Fitosys",
    },
});

interface WeeklyData {
  week: number;
  energy_score: number | null;
  sessions_completed: number | null;
  responded: boolean;
}

export interface RiskResult {
  score: 1 | 2 | 3 | 4 | 5; // 5 = highest churn risk
  reason: string;
  action: string;
}

export async function getClientRiskScore(
  clientName: string,
  last4Weeks: WeeklyData[]
): Promise<RiskResult> {
  const weekSummary = last4Weeks
    .map(
      (w) =>
        `Week ${w.week}: Energy ${w.energy_score ?? "N/A"}/10, 
         Sessions ${w.sessions_completed ?? "N/A"}, 
         Responded: ${w.responded ? "Yes" : "No"}`
    )
    .join("\n");

  const prompt = `
Analyze client churn risk for a fitness coach.
Client: ${clientName}
Last 4 weeks:
${weekSummary}

Return ONLY this JSON, no other text:
{
  "score": [1-5 integer, 5 = highest churn risk],
  "reason": "[one sentence, specific data-based]",
  "action": "[one concrete action for coach this week]"
}
`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: process.env.OPENROUTER_MODEL || "qwen/qwen-2.5-72b-instruct",
    temperature: 0.3,
    max_tokens: 256,
    top_p: 0.95,
  });

  const text = (completion.choices[0].message.content || "").trim();

  // Strip markdown fences if wrapped in backticks
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as RiskResult;
}
