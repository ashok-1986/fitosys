import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/clients — List all clients with enriched enrollment + check-in data
export async function GET(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Fetch clients with active enrollment → program, and latest check-in
    let query = supabase!
        .from("clients")
        .select(
            `*,
            enrollments!client_id (
                id,
                status,
                start_date,
                end_date,
                program_id,
                programs!program_id ( name )
            ),
            checkins!client_id (
                energy_score,
                check_date,
                responded_at
            )`
        )
        .eq("coach_id", coachId!)
        .order("created_at", { ascending: false });

    if (status && status !== "all" && status !== "renewal_due") {
        query = query.eq("status", status);
    }

    if (search) {
        query = query.or(
            `full_name.ilike.%${search}%,whatsapp_number.ilike.%${search}%`
        );
    }

    const { data, error: dbError } = await query;

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Post-process: flatten enrollment/program data, pick latest check-in
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enriched = (data || []).map((client: any) => {
        // Find active enrollment (most recent)
        const activeEnrollment = (client.enrollments || [])
            .filter((e: { status: string }) => e.status === "active")
            .sort(
                (a: { start_date: string }, b: { start_date: string }) =>
                    new Date(b.start_date).getTime() -
                    new Date(a.start_date).getTime()
            )[0];

        // Get latest check-in by check_date
        const latestCheckin = (client.checkins || [])
            .filter((c: { responded_at: string | null }) => c.responded_at)
            .sort(
                (a: { check_date: string }, b: { check_date: string }) =>
                    new Date(b.check_date).getTime() -
                    new Date(a.check_date).getTime()
            )[0];

        const programName = activeEnrollment?.programs?.name || null;
        const startDate = activeEnrollment?.start_date || null;
        const endDate = activeEnrollment?.end_date || null;
        const energyScore = latestCheckin?.energy_score ?? null;
        const lastCheckinDate = latestCheckin?.check_date || null;

        // Calculate if renewal is due (within 7 days)
        const renewalDue =
            endDate &&
            activeEnrollment?.status === "active" &&
            new Date(endDate) <= sevenDaysFromNow &&
            new Date(endDate) >= today;

        // Strip raw join arrays from response
        const { enrollments, checkins, ...clientBase } = client;
        void enrollments;
        void checkins;

        return {
            ...clientBase,
            program_name: programName,
            start_date: startDate,
            end_date: endDate,
            energy_score: energyScore,
            last_checkin_date: lastCheckinDate,
            renewal_due: !!renewalDue,
        };
    });

    // Apply renewal_due filter if requested
    const result =
        status === "renewal_due"
            ? enriched.filter(
                (c: { renewal_due: boolean }) => c.renewal_due
            )
            : enriched;

    return NextResponse.json(result);
}


// POST /api/clients — Create client (internal use, typically via webhook)
export async function POST(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const body = await request.json();
    const {
        full_name,
        whatsapp_number,
        email,
        age,
        primary_goal,
        health_notes,
    } = body;

    if (!full_name || !whatsapp_number || !email) {
        return NextResponse.json(
            { error: "Name, WhatsApp number, and email are required" },
            { status: 400 }
        );
    }

    const { data, error: dbError } = await supabase!
        .from("clients")
        .insert({
            coach_id: coachId!,
            full_name,
            whatsapp_number,
            email,
            age: age || null,
            primary_goal: primary_goal || null,
            health_notes: health_notes || null,
            status: "active",
        })
        .select()
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
