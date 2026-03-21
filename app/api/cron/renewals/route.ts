import { NextRequest, NextResponse } from "next/server";
import { sendRenewalReminder, sendSecondRenewalReminder } from "@/lib/whatsapp/templates";
import { createRazorpayOrder } from "@/lib/razorpay/create-order";

// POST /api/cron/renewals — Daily renewal check + reminders
// Sends first reminder at 7 days before expiry, second at 3 days
// Expiry is handled separately by /api/cron/expiry
export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    let firstReminders = 0;
    let secondReminders = 0;
    let errors = 0;

    // ──── 1. First Renewal Reminders (7 days before expiry) ────
    const { data: firstReminderEnrollments } = await supabase
        .from("enrollments")
        .select(
            "id, coach_id, client_id, program_id, end_date, clients(full_name, whatsapp_number), programs(name, duration_weeks, price, currency), coaches(full_name)"
        )
        .eq("status", "active")
        .eq("renewal_reminder_1_sent", false)
        .lte("end_date", in7Days)
        .gte("end_date", today);

    for (const enrollment of firstReminderEnrollments || []) {
        try {
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
            };

            if (!client || !program || !coach) continue;

            // Generate Razorpay payment link for renewal
            const order = await createRazorpayOrder({
                amount: program.price,
                currency: program.currency ?? "INR",
                receipt: `renewal_${enrollment.id}_${Date.now()}`,
                notes: {
                    coach_id: enrollment.coach_id,
                    client_id: enrollment.client_id,
                    program_id: enrollment.program_id,
                    enrollment_id: enrollment.id,
                    payment_type: "renewal",
                },
            });

            const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/renew?order=${order.id}&enrollment=${enrollment.id}`;

            // Get real average energy score from last 4 check-ins
            const { data: energyData } = await supabase
                .from("checkins")
                .select("energy_score")
                .eq("client_id", enrollment.client_id)
                .eq("coach_id", enrollment.coach_id)
                .not("energy_score", "is", null)
                .order("check_date", { ascending: false })
                .limit(4);

            const avgEnergy = energyData && energyData.length > 0
                ? Math.round(
                    energyData.reduce((acc, c) => acc + (c.energy_score || 0), 0) / energyData.length
                  )
                : 7;

            // Get total sessions completed
            const { count: sessionsCount } = await supabase
                .from("checkins")
                .select("id", { count: "exact", head: true })
                .eq("client_id", enrollment.client_id)
                .eq("coach_id", enrollment.coach_id)
                .not("sessions_completed", "is", null);

            const daysRemaining = Math.ceil(
                (new Date(enrollment.end_date).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            await sendRenewalReminder(
                client.whatsapp_number,
                client.full_name.split(" ")[0],
                program.name,
                coach.full_name,
                daysRemaining,
                avgEnergy,
                sessionsCount || 0,
                paymentLink
            );

            await supabase
                .from("enrollments")
                .update({ renewal_reminder_1_sent: true })
                .eq("id", enrollment.id);

            firstReminders++;

            // Batch delay — prevent Meta rate limit spike
            await new Promise(r => setTimeout(r, 100));
        } catch (err) {
            console.error("[Cron/Renewals] First reminder error:", err);
            errors++;
        }
    }

    // ──── 2. Second Renewal Reminders (3 days before expiry) ────
    const { data: secondReminderEnrollments } = await supabase
        .from("enrollments")
        .select(
            "id, coach_id, client_id, program_id, end_date, clients(full_name, whatsapp_number), programs(name, price, currency), coaches(full_name)"
        )
        .eq("status", "active")
        .eq("renewal_reminder_1_sent", true)
        .eq("renewal_reminder_2_sent", false)
        .lte("end_date", in3Days)
        .gte("end_date", today);

    for (const enrollment of secondReminderEnrollments || []) {
        try {
            const client = enrollment.clients as unknown as {
                full_name: string;
                whatsapp_number: string;
            };
            const program = enrollment.programs as unknown as {
                name: string;
                price: number;
                currency: string;
            };
            const coach = enrollment.coaches as unknown as {
                full_name: string;
            };

            if (!client || !program || !coach) continue;

            const order = await createRazorpayOrder({
                amount: program.price,
                currency: program.currency ?? "INR",
                receipt: `renewal2_${enrollment.id}_${Date.now()}`,
                notes: {
                    coach_id: enrollment.coach_id,
                    client_id: enrollment.client_id,
                    program_id: enrollment.program_id,
                    enrollment_id: enrollment.id,
                    payment_type: "renewal",
                },
            });

            const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/renew?order=${order.id}&enrollment=${enrollment.id}`;

            const daysRemaining = Math.ceil(
                (new Date(enrollment.end_date).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            await sendSecondRenewalReminder(
                client.whatsapp_number,
                client.full_name.split(" ")[0],
                program.name,
                coach.full_name,
                daysRemaining
            );

            await supabase
                .from("enrollments")
                .update({ renewal_reminder_2_sent: true })
                .eq("id", enrollment.id);

            secondReminders++;

            // Batch delay
            await new Promise(r => setTimeout(r, 100));
        } catch (err) {
            console.error("[Cron/Renewals] Second reminder error:", err);
            errors++;
        }
    }

    console.log(
        `[Cron/Renewals] Complete: ${firstReminders} first, ${secondReminders} second, ${errors} errors`
    );

    return NextResponse.json({
        first_reminders: firstReminders,
        second_reminders: secondReminders,
        errors,
    });
}