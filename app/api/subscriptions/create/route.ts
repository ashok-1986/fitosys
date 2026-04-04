import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";
import { createRazorpaySubscription, PLAN_AMOUNTS } from "@/lib/razorpay/subscriptions";

export async function POST(request: NextRequest) {
    try {
        const { coachId, supabase, error } = await getAuthenticatedCoach();
        if (error) return NextResponse.json({ error }, { status: 401 });

        const body = await request.json();
        const { plan } = body;

        if (!['starter', 'basic', 'pro', 'studio'].includes(plan)) {
            return NextResponse.json({ error: "Invalid plan name" }, { status: 400 });
        }

        const { data: coach, error: coachError } = await supabase!
            .from("coaches")
            .select("full_name, email, whatsapp_number")
            .eq("id", coachId!)
            .single();

        if (coachError || !coach) {
            return NextResponse.json({ error: "Coach not found" }, { status: 404 });
        }

        const { data: activeSub } = await supabase!
            .from("subscriptions")
            .select("id")
            .eq("coach_id", coachId!)
            .eq("status", "active")
            .maybeSingle();

        if (activeSub) {
            return NextResponse.json({ error: "Active subscription already exists. Cancel current plan before switching." }, { status: 400 });
        }

        const subscription = await createRazorpaySubscription({
            planName: plan,
            coachId: coachId!,
            coachEmail: coach.email,
            coachName: coach.full_name,
            coachWhatsApp: coach.whatsapp_number
        });

        const today = new Date();
        const current_period_end = new Date(today);
        current_period_end.setDate(current_period_end.getDate() + 30);

        const { error: insertError } = await supabase!
            .from("subscriptions")
            .insert({
                coach_id: coachId!,
                plan: plan,
                billing_cycle: "monthly",
                amount_inr: PLAN_AMOUNTS[plan],
                gateway_payment_id: subscription.id,
                status: "created",
                current_period_start: today.toISOString().split("T")[0],
                current_period_end: current_period_end.toISOString().split("T")[0]
            });

        if (insertError) {
            return NextResponse.json({ error: "Failed to create subscription record" }, { status: 500 });
        }

        await supabase!
            .from("coaches")
            .update({ plan: plan, updated_at: today.toISOString() })
            .eq("id", coachId!);

        return NextResponse.json({
            subscription_id: subscription.id,
            short_url: subscription.short_url,
            plan: plan,
            amount: PLAN_AMOUNTS[plan]
        });
    } catch (err: any) {
        console.error("Subscription create error:", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
