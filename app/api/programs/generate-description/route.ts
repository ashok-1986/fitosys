import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

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
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Write a 1-2 sentence description for a coaching program called "${name}" focused on ${checkin_type}. 
Write from the coach's perspective. Be specific, motivating, and results-focused. 
Do not use generic phrases like "transform your life". 
Keep it under 30 words. No quotation marks in your response.`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 100,
                    }
                }),
            }
        );

        const data = await response.json();
        const description = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!description) {
            return NextResponse.json(
                { error: "Failed to generate description" },
                { status: 500 }
            );
        }

        return NextResponse.json({ description });
    } catch (err) {
        console.error("[Generate Description] Error:", err);
        return NextResponse.json(
            { error: "AI generation failed" },
            { status: 500 }
        );
    }
}
