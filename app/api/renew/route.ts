import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order");
    const enrollmentId = searchParams.get("enrollment");

    if (!orderId || !enrollmentId) {
        return NextResponse.json(
            { error: "Missing order or enrollment parameter" },
            { status: 400 }
        );
    }

    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();

    // Fetch enrollment with related data
    const { data, error } = await supabase
        .from("enrollments")
        .select(
            "id, end_date, amount_paid, currency, status, " +
            "clients(full_name, whatsapp_number), " +
            "programs(name, duration_weeks, price, currency), " +
            "coaches(full_name, whatsapp_number)"
        )
        .eq("id", enrollmentId)
        .eq("status", "active")
        .single();

    const enrollment: any = data;

    if (error || !enrollment) {
        return NextResponse.json(
            { error: "Enrollment not found or already renewed" },
            { status: 404 }
        );
    }

    // Fetch check-in progress stats
    const { data: checkins } = await supabase
        .from("checkins")
        .select("sessions_completed, energy_score, responded_at")
        .eq("enrollment_id", enrollmentId)
        .not("responded_at", "is", null);

    const totalSessions = (checkins || []).reduce(
        (sum, c) => sum + (c.sessions_completed || 0), 0
    );
    const energyScores = (checkins || [])
        .filter(c => c.energy_score !== null)
        .map(c => c.energy_score as number);
    const avgEnergy = energyScores.length > 0
        ? Math.round(
            (energyScores.reduce((a, b) => a + b, 0) / energyScores.length) * 10
        ) / 10
        : null;
    const totalCheckins = (checkins || []).length;

    const client = enrollment.clients as unknown as {
        full_name: string;
        whatsapp_number: string;
    };
    const program = enrollment.programs as unknown as {
        name: string;
        duration_weeks: number;
        price: number;
        currency: string;
    };
    const coach = enrollment.coaches as unknown as {
        full_name: string;
        whatsapp_number: string;
    };

    return NextResponse.json({
        order_id: orderId,
        enrollment_id: enrollmentId,
        client_name: client?.full_name || "Client",
        coach_name: coach?.full_name || "Coach",
        coach_whatsapp: coach?.whatsapp_number || null,
        program_name: program?.name || "Program",
        program_duration_weeks: program?.duration_weeks || 0,
        end_date: enrollment.end_date,
        amount: program?.price || enrollment.amount_paid,
        currency: program?.currency || enrollment.currency || "INR",
        stats: {
            total_sessions: totalSessions,
            avg_energy: avgEnergy,
            total_checkins: totalCheckins,
        },
    });
}
