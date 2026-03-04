import { NextRequest, NextResponse } from "next/server";
import {
    sendRenewalReminder,
    sendSecondRenewalReminder,
} from "@/lib/whatsapp";
import { createRazorpayOrder } from "@/lib/razorpay/create-order";

// POST /api/cron/renewals — Daily renewal check + reminders
// Sends first reminder at 7 days before expiry, second at 3 days
export async function POST(request: NextRequest) {
    // Verify CRON secret
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
    let expired = 0;
    let errors = 0;

    // ──── 1. First Renewal Reminders (7 days before expiry) ────
    const { data: firstRemiderEnrollments } = await supabase
        .from("enrollments")
        .select(
            "id, coach_id, client_id, program_id, end_date, clients(full_name, whatsapp_number), programs(name, duration_weeks, price, currency), coaches(full_name)"
        )
        .eq("status", "active")
        .eq("renewal_reminder_1_sent", false)
        .lte("end_date", in7Days)
        .gte("end_date", today);

    for (const enrollment of firstRemiderEnrollments || []) {
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

            // Build a payment link URL (coach's public page with payment context)
            const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/renew?order=${order.id}&enrollment=${enrollment.id}`;

            // Get client's progress stats
            const { count: sessionsCount } = await supabase
                .from("checkins")
                .select("id", { count: "exact", head: true })
                .eq("client_id", enrollment.client_id)
                .eq("coach_id", enrollment.coach_id)
                .not("sessions_completed", "is", null);

            // Get weight progress
            const { data: weightData } = await supabase
                .from("checkins")
                .select("weight_kg")
                .eq("client_id", enrollment.client_id)
                .eq("coach_id", enrollment.coach_id)
                .not("weight_kg", "is", null)
                .order("check_date", { ascending: true })
                .limit(2);

            let weightProgress: string | null = null;
            if (weightData && weightData.length >= 2) {
                const first = Number(weightData[0].weight_kg);
                const last = Number(weightData[weightData.length - 1].weight_kg);
                const diff = (last - first).toFixed(1);
                weightProgress = `${diff > "0" ? "+" : ""}${diff} kg`;
            }

            const daysUntilEnd = Math.ceil(
                (new Date(enrollment.end_date).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            await sendRenewalReminder({
                clientName: client.full_name.split(" ")[0],
                coachName: coach.full_name,
                programName: program.name,
                endDate: new Date(enrollment.end_date).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "long", year: "numeric" }
                ),
                sessionsCompleted: sessionsCount || 0,
                weeksCompleted: program.duration_weeks - Math.ceil(daysUntilEnd / 7),
                weightProgress,
                paymentLink,
                clientPhone: client.whatsapp_number,
            });

            // Mark first reminder as sent
            await supabase
                .from("enrollments")
                .update({ renewal_reminder_1_sent: true })
                .eq("id", enrollment.id);

            firstReminders++;
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

            // Generate new Razorpay order for second reminder
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

            await sendSecondRenewalReminder({
                clientName: client.full_name.split(" ")[0],
                coachName: coach.full_name,
                daysRemaining,
                paymentLink,
                clientPhone: client.whatsapp_number,
            });

            await supabase
                .from("enrollments")
                .update({ renewal_reminder_2_sent: true })
                .eq("id", enrollment.id);

            secondReminders++;
        } catch (err) {
            console.error("[Cron/Renewals] Second reminder error:", err);
            errors++;
        }
    }

    // ──── 3. Expire past-due enrollments ────
    const { data: expiredEnrollments } = await supabase
        .from("enrollments")
        .select("id")
        .eq("status", "active")
        .lt("end_date", today);

    if (expiredEnrollments && expiredEnrollments.length > 0) {
        const ids = expiredEnrollments.map((e) => e.id);
        await supabase
            .from("enrollments")
            .update({ status: "expired" })
            .in("id", ids);

        expired = ids.length;
    }

    console.log(
        `[Cron/Renewals] Complete: ${firstReminders} first, ${secondReminders} second, ${expired} expired, ${errors} errors`
    );

    return NextResponse.json({
        first_reminders: firstReminders,
        second_reminders: secondReminders,
        expired,
        errors,
    });
}
