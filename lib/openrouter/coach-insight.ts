// lib/openrouter/coach-insight.ts
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Fitosys",
    },
});

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

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: process.env.OPENROUTER_MODEL || "qwen/qwen-2.5-72b-instruct",
    temperature: 0.4,
    max_tokens: 128,
    top_p: 0.95,
  });

  return completion.choices[0].message.content || "";
}
