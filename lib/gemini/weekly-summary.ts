// lib/gemini/weekly-summary.ts
import { geminiFlash } from "./client";

interface CheckIn {
  client_name: string;
  weight_kg: number | null;
  sessions_completed: number | null;
  energy_score: number | null;
  notes: string | null;
  responded: boolean;
}

export async function generateWeeklySummary(
  coachName: string,
  weekRange: string,
  totalClients: number,
  checkIns: CheckIn[]
): Promise<string> {
  const responded = checkIns.filter((c) => c.responded);
  const nonResponders = checkIns
    .filter((c) => !c.responded)
    .map((c) => c.client_name)
    .join(", ");

  const clientData = responded
    .map(
      (c) =>
        `Client: ${c.client_name}
         Weight: ${c.weight_kg ?? "not shared"}
         Sessions: ${c.sessions_completed ?? "not shared"}
         Energy: ${c.energy_score ?? "not shared"}/10
         Notes: ${c.notes ?? "none"}`
    )
    .join("\n---\n");

  const prompt = `
You are a coaching assistant reviewing weekly check-in data.
Coach: ${coachName}
Week: ${weekRange}
Total active clients: ${totalClients}
Clients who responded: ${responded.length}
Non-responders: ${nonResponders || "none"}

CLIENT RESPONSES:
${clientData}

Generate a structured summary with EXACTLY these sections:

RESPONSE RATE
[X of Y clients responded]

NEEDS ATTENTION (max 3)
[Client name — specific reason — one action]

STRONG PROGRESS (max 3)
[Client name — specific win]

GROUP AVERAGE
Energy: [X.X/10]
Sessions: [X.X/week]

THIS WEEK PRIORITY
[One direct action for coach]

NON-RESPONDERS
[Names or "All clients responded"]

Under 150 words total. No filler. Be specific.
`;

  const result = await geminiFlash.generateContent(prompt);
  return result.response.text();
}