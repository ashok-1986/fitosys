import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Fitosys",
    },
});

export async function POST(req: NextRequest) {
    const { error } = await getAuthenticatedCoach();
    if (error) return error;

    const { name, checkin_type } = await req.json();

    if (!name || !checkin_type) {
        return NextResponse.json(
            { error: "name and checkin_type are required" },
            { status: 400 }
        );
    }

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENROUTER_MODEL || "qwen/qwen-2.5-72b-instruct",
            temperature: 0.7,
            max_tokens: 100,
            top_p: 0.95,
            messages: [{
                role: "user",
                content: `Write a 1-2 sentence description for a coaching program called "${name}" focused on ${checkin_type}.
Write from the coach's perspective. Be specific, motivating, and results-focused.
Do not use generic phrases like "transform your life".
Keep it under 30 words. No quotation marks in your response. Return only the description text, nothing else.`
            }],
        });

        const description = completion.choices[0].message.content?.trim();

        if (!description) {
            return NextResponse.json(
                { error: "Failed to generate description" },
                { status: 500 }
            );
        }

        return NextResponse.json({ description });
    } catch (err) {
        console.error("[Generate Description] OpenRouter error:", err);
        return NextResponse.json(
            { error: "AI generation failed" },
            { status: 500 }
        );
    }
}
