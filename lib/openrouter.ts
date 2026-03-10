import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://fitosys.alchemetryx.com",
        "X-Title": "Fitosys",
    },
});

export interface CheckInData {
    client_name: string;
    weight: string | null | undefined;
    sessions: number | null | undefined;
    energy_score: number | null | undefined;
    notes: string | null | undefined;
}

export interface SummaryInput {
    coach_name: string;
    week_ending: string;
    total_active_clients: number;
    responded_clients: CheckInData[];
    non_responder_names: string[];
}

function buildWeeklySummaryPrompt(input: SummaryInput): string {
    return `You are a coaching assistant reviewing weekly check-in data for a fitness coach.

Coach: ${input.coach_name}
Week ending: ${input.week_ending}
Total active clients: ${input.total_active_clients}
Clients who responded: ${input.responded_clients.length}
Clients who did not respond: ${input.non_responder_names.join(", ") || "None"}

CLIENT RESPONSES:
${input.responded_clients
            .map(
                (c) => `Client: ${c.client_name}
Weight update: ${c.weight || "not reported"}
Sessions completed: ${c.sessions ?? "not reported"}
Energy score: ${c.energy_score ?? "not reported"}/10
Notes: ${c.notes || "none"}
---`
            )
            .join("\n")}

Generate a structured summary with exactly these sections:

RESPONSE RATE
[X of Y clients responded — one line only]

NEEDS ATTENTION (up to 3 clients)
[List clients with specific concern and one action suggestion per client]

STRONG PROGRESS (up to 3 clients)
[List clients with specific achievement]

GROUP AVERAGE
Energy score: [average to 1 decimal]
Sessions per week: [average to 1 decimal]

THIS WEEK PRIORITY
[One specific coaching action for the coach — be direct, not vague]

NON-RESPONDERS
[List names of clients who did not respond this week]

Keep total under 150 words. Be specific. No filler phrases.`;
}

export async function generateWeeklySummary(
    input: SummaryInput
): Promise<string> {
    const prompt = buildWeeklySummaryPrompt(input);

    // Exponential backoff: 4s → 16s → 60s
    const delays = [4000, 16000, 60000];

    for (let attempt = 0; attempt <= delays.length; attempt++) {
        try {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: process.env.OPENROUTER_MODEL || "qwen/qwen3-32b",
                temperature: 0.3,
                max_tokens: 512,
                top_p: 0.95,
            });
            return completion.choices[0].message.content || "Summary unavailable.";
        } catch (error) {
            if (attempt < delays.length) {
                console.warn(
                    `AI API attempt ${attempt + 1} failed, retrying in ${delays[attempt] / 1000}s...`
                );
                await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
            } else {
                console.error("AI API failed after all retries:", error);
                return `⚠️ Summary generation delayed. We'll retry in 2 hours.\n\nIn the meantime, check your dashboard for individual client responses.\n\nResponse rate: ${input.responded_clients.length} of ${input.total_active_clients} clients responded.`;
            }
        }
    }

    return "Summary unavailable.";
}

export async function generateWeeklySummaryStream(
    input: SummaryInput
) {
    const prompt = buildWeeklySummaryPrompt(input);

    return await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: process.env.OPENROUTER_MODEL || "qwen/qwen3-32b",
        temperature: 0.3,
        max_tokens: 512,
        top_p: 0.95,
        stream: true,
    });
}
