// lib/gemini/coach-insight.ts
import { geminiPro } from "./client";

export async function generateCoachInsight(data: {
  coachName: string;
  totalActiveClients: number;
  renewalRateByProgram: { program: string; rate: number }[];
  avgCheckinResponseRate: number;
  revenueThisMonth: number;
  revenuePrevMonth: number;
  topChurnReasons: string[];
}): Promise<string> {
  const prompt = `
You are a business analyst for fitness coaching businesses.

Coach: ${data.coachName}
Active clients: ${data.totalActiveClients}
Check-in response rate: ${data.avgCheckinResponseRate}%
Revenue this month: ₹${data.revenueThisMonth}
Revenue last month: ₹${data.revenuePrevMonth}
Renewal rates by program: ${JSON.stringify(data.renewalRateByProgram)}
Top churn reasons: ${data.topChurnReasons.join(", ")}

Give ONE specific, actionable business insight this coach should act on this month.
Not generic advice. Based on their actual numbers.
Under 40 words. Direct. No fluff.
`;

  const result = await geminiPro.generateContent(prompt);
  return result.response.text();
}