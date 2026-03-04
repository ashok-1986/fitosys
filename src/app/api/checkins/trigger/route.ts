import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";
import { sendWeeklyCheckin } from "@/lib/whatsapp";

// POST /api/checkins/trigger — Manual trigger for coach (admin/testing)
// Sends check-in messages to all active clients and creates check-in records
export async function POST(_request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    // Get coach info for message template
    const { data: coach } = await supabase!
        .from("coaches")
        .select("full_name, checkin_day, checkin_time")
        .eq("id", coachId!)
        .single();

    if (!coach) {
        return NextResponse.json(
            { error: "Coach not found" },
            { status: 404 }
        );
    }

    // Get all active clients with active enrollments
    const { data: clients, error: clientsError } = await supabase!
        .from("clients")
        .select("id, full_name, whatsapp_number")
        .eq("coach_id", coachId!)
        .eq("status", "active");

    if (clientsError) {
        return NextResponse.json(
            { error: clientsError.message },
            { status: 500 }
        );
    }

    if (!clients || clients.length === 0) {
        return NextResponse.json({
            message: "No active clients found",
            sent: 0,
        });
    }

    // Calculate current week number (ISO week)
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
        ((now.getTime() - startOfYear.getTime()) / 86400000 +
            startOfYear.getDay() +
            1) /
        7
    );

    const today = now.toISOString().split("T")[0];
    let sentCount = 0;

    for (const client of clients) {
        // Check if a check-in already exists for this client this week
        const { data: existing } = await supabase!
            .from("checkins")
            .select("id")
            .eq("client_id", client.id)
            .eq("coach_id", coachId!)
            .eq("week_number", weekNumber)
            .maybeSingle();

        if (existing) continue; // Already sent this week

        // Create check-in record
        const { error: insertError } = await supabase!
            .from("checkins")
            .insert({
                coach_id: coachId!,
                client_id: client.id,
                week_number: weekNumber,
                check_date: today,
                message_sent_at: new Date().toISOString(),
            });

        if (insertError) {
            console.error(
                `Failed to create check-in for ${client.full_name}:`,
                insertError
            );
            continue;
        }

        // Send WhatsApp check-in message (stubbed)
        await sendWeeklyCheckin({
            clientPhone: client.whatsapp_number,
            clientName: client.full_name,
            coachName: coach.full_name,
        });

        sentCount++;
    }

    return NextResponse.json({
        message: `Check-in messages triggered for ${sentCount} clients`,
        sent: sentCount,
        total_active: clients.length,
    });
}
