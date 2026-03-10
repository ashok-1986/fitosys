import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/clients/:id/payments — Get client's payment history
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { id } = await params;

    const { data, error: dbError } = await supabase!
        .from("payments")
        .select("*, enrollments(programs(name))")
        .eq("client_id", id)
        .eq("coach_id", coachId!)
        .order("paid_at", { ascending: false });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
