import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/programs — List all programs for coach
export async function GET() {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { data, error: dbError } = await supabase!
        .from("programs")
        .select("*")
        .eq("coach_id", coachId!)
        .order("created_at", { ascending: false });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// POST /api/programs — Create new program
export async function POST(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const body = await request.json();
    const { name, description, duration_weeks, price, currency, checkin_type } =
        body;

    if (!name || !duration_weeks || !price) {
        return NextResponse.json(
            { error: "Name, duration, and price are required" },
            { status: 400 }
        );
    }

    const { data, error: dbError } = await supabase!
        .from("programs")
        .insert({
            coach_id: coachId!,
            name,
            description: description || null,
            duration_weeks,
            price,
            currency: currency || "INR",
            checkin_type: checkin_type || "fitness",
            is_active: true,
        })
        .select()
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
