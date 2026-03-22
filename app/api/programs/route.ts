import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

export async function GET() {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { data, error: dbError } = await supabase!
        .from("programs")
        .select("id, name, description, duration_weeks, price, currency, checkin_type, is_active, created_at")
        .eq("coach_id", coachId!)
        .order("created_at", { ascending: false });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const body = await req.json();
    const { name, duration_weeks, price, checkin_type, description } = body;

    if (!name || !duration_weeks || !price || !checkin_type) {
        return NextResponse.json(
            { error: "name, duration_weeks, price, and checkin_type are required" },
            { status: 400 }
        );
    }

    const { data, error: dbError } = await supabase!
        .from("programs")
        .insert({
            coach_id: coachId!,
            name: name.trim(),
            description: description?.trim() || null,
            duration_weeks: Number(duration_weeks),
            price: Number(price),
            currency: "INR",
            checkin_type,
            is_active: true,
        })
        .select()
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
