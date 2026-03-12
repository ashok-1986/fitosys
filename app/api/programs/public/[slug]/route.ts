import { NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/programs/public/:slug — Public: get coach's active programs (no auth)
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    // Use the regular client — RLS won't apply for public data
    // We use service client for public routes since there's no auth
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();

    // Get coach by slug
    const { data: coach, error: coachError } = await supabase
        .from("coaches")
        .select("id, full_name, coaching_type, slug")
        .eq("slug", slug)
        .eq("status", "active")
        .single();

    if (coachError || !coach) {
        return NextResponse.json(
            { error: "Coach not found" },
            { status: 404 }
        );
    }

    // Get active programs
    const { data: programs, error: progError } = await supabase
        .from("programs")
        .select("id, name, description, duration_weeks, price, currency, is_active")
        .eq("coach_id", coach.id)
        .eq("is_active", true)
        .order("price", { ascending: true });

    if (progError) {
        return NextResponse.json(
            { error: progError.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ coach, programs });
}
