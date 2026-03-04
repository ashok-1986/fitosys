import { NextRequest, NextResponse } from "next/server";
import { sendWeeklyCheckin } from "@/lib/whatsapp";

// POST /api/cron/checkins — Weekly check-in blast
// Triggered by Vercel CRON or pg_cron
// Runs once per day, but only sends to coaches whose check-in day matches today
export async function POST(request: NextRequest) {
    // Verify CRON secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();

    const now = new Date();
    const todayDayOfWeek = now.getUTCDay(); // 0=Sunday ... 6=Saturday

    // Get coaches whose check-in day matches today
    const { data: coaches, error: coachError } = await supabase
        .from("coaches")
        .select("id, full_name, checkin_day")
        .eq("status", "active")
        .eq("checkin_day", todayDayOfWeek);

    if (coachError) {
        console.error("[Cron/Checkins] Failed to query coaches:", coachError);
        return NextResponse.json({ error: coachError.message }, { status: 500 });
    }

    if (!coaches || coaches.length === 0) {
        return NextResponse.json({ message: "No coaches scheduled today", sent: 0 });
    }

    let totalSent = 0;
    let totalErrors = 0;

    for (const coach of coaches) {
        // Get active clients with active enrollments for this coach
        const { data: enrollments } = await supabase
            .from("enrollments")
            .select("id, client_id, clients(id, full_name, whatsapp_number)")
            .eq("coach_id", coach.id)
            .eq("status", "active")
            .gte("end_date", now.toISOString().split("T")[0]);

        if (!enrollments || enrollments.length === 0) continue;

        // Calculate week number from enrollment start
        for (const enrollment of enrollments) {
            const client = enrollment.clients as unknown as {
                id: string;
                full_name: string;
                whatsapp_number: string;
            };

            if (!client) continue;

            // Check if a check-in already exists for this week
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay()); // start of week (Sunday)
            const weekStartStr = weekStart.toISOString().split("T")[0];

            const { data: existing } = await supabase
                .from("checkins")
                .select("id")
                .eq("client_id", client.id)
                .eq("coach_id", coach.id)
                .gte("check_date", weekStartStr)
                .limit(1)
                .maybeSingle();

            if (existing) continue; // Already sent this week

            // Create check-in record
            const { error: insertError } = await supabase
                .from("checkins")
                .insert({
                    coach_id: coach.id,
                    client_id: client.id,
                    enrollment_id: enrollment.id,
                    week_number: Math.ceil(
                        (now.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
                    ) + 1,
                    check_date: now.toISOString().split("T")[0],
                    message_sent_at: new Date().toISOString(),
                });

            if (insertError) {
                console.error(
                    `[Cron/Checkins] Failed to create check-in for ${client.full_name}:`,
                    insertError
                );
                totalErrors++;
                continue;
            }

            // Send WhatsApp check-in message
            try {
                await sendWeeklyCheckin({
                    clientName: client.full_name.split(" ")[0],
                    coachName: coach.full_name,
                    clientPhone: client.whatsapp_number,
                });
                totalSent++;

                // Log outbound message
                await supabase.from("whatsapp_log").insert({
                    coach_id: coach.id,
                    client_id: client.id,
                    direction: "outbound",
                    message_type: "checkin",
                    message_content: "Weekly check-in sent",
                    status: "sent",
                });
            } catch (err) {
                console.error(
                    `[Cron/Checkins] Failed to send WhatsApp to ${client.full_name}:`,
                    err
                );
                totalErrors++;
            }
        }
    }

    console.log(
        `[Cron/Checkins] Complete: ${totalSent} sent, ${totalErrors} errors`
    );
    return NextResponse.json({ sent: totalSent, errors: totalErrors });
}
