import { generateWeeklySummaryStream, SummaryInput } from "@/lib/openrouter";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Construct standard input
        const input: SummaryInput = {
            coach_name: body.coach_name || "Coach",
            week_ending: new Date().toISOString().split("T")[0],
            total_active_clients: body.clients.length,
            responded_clients: body.clients.map((c: { name: string; energy: number; sessions: number }) => ({
                client_name: c.name,
                energy_score: c.energy,
                sessions: c.sessions,
                weight: null,
                notes: null,
            })),
            non_responder_names: [],
        };

        const stream = await generateWeeklySummaryStream(input);

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const chunkText = chunk.choices[0]?.delta?.content;
                        if (chunkText) {
                            controller.enqueue(new TextEncoder().encode(chunkText));
                        }
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.error("Demo summary generator error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
