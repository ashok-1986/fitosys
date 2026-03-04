// lib/gemini/risk-score.ts
import { geminiFlash } from "./client";

interface WeeklyData {
  week: number;
  energy_score: number | null;
  sessions_completed: number | null;
  responded: boolean;
}

interface RiskResult {
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

  const result = await geminiFlash.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown fences if Gemini wraps in backticks
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as RiskResult;
}