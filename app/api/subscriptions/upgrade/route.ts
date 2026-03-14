import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay/client";
import { logRequest, logError } from "@/lib/loggerHelpers";

// Pricing configuration
export const PLAN_PRICING = {
    starter: { monthly: 999, annual: 9990 },
    basic: { monthly: 1499, annual: 14990 },
    pro: { monthly: 2999, annual: 29990 },
    studio: { monthly: 5999, annual: 59990 },
} as const;

export const PLAN_LIMITS = {
    starter: 10,
    basic: 25,
    pro: 50,
    studio: null, // unlimited
} as const;

// POST /api/subscriptions/upgrade — Upgrade to higher plan
export async function POST(request: NextRequest) {
    logRequest(request, "POST /api/subscriptions/upgrade");

    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    try {
        const { targetPlan, billingCycle } = await request.json();

        // Validate input
        if (!targetPlan || !["starter", "basic", "pro", "studio"].includes(targetPlan)) {
            return NextResponse.json(
                { error: "Invalid plan selected" },
                { status: 400 }
            );
        }

        if (!billingCycle || !["monthly", "annual"].includes(billingCycle)) {
            return NextResponse.json(
                { error: "Invalid billing cycle" },
                { status: 400 }
            );
        }

        // Get current coach plan
        const { data: coach, error: coachError } = await supabase!
            .from("coaches")
            .select("plan, plan_billing_cycle")
            .eq("id", coachId)
            .single();

        if (coachError || !coach) {
            return NextResponse.json(
                { error: "Coach profile not found" },
                { status: 404 }
            );
        }

        // Prevent downgrade
        const planOrder = ["trial", "starter", "basic", "pro", "studio"];
        const currentIndex = planOrder.indexOf(coach.plan);
        const targetIndex = planOrder.indexOf(targetPlan);

        if (targetIndex <= currentIndex && coach.plan !== "trial") {
            return NextResponse.json(
                { error: "Cannot downgrade plan via this endpoint" },
                { status: 400 }
            );
        }

        // Calculate amount
        const pricing = PLAN_PRICING[targetPlan as keyof typeof PLAN_PRICING];
        const amount = billingCycle === "annual" ? pricing.annual : pricing.monthly;

        // Create Razorpay order
        const razorpay = getRazorpay();
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `sub_${coachId}_${Date.now()}`,
            notes: {
                coach_id: coachId,
                target_plan: targetPlan,
                billing_cycle: billingCycle,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: amount,
            currency: "INR",
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            targetPlan,
            billingCycle,
        });
    } catch (error) {
        logError(error, "POST /api/subscriptions/upgrade");
        return NextResponse.json(
            { error: "Failed to create subscription order" },
            { status: 500 }
        );
    }
}
