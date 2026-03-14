import { NextResponse } from "next/server";
import { logError, logRequest } from "@/lib/loggerHelpers";
import { verifyRazorpaySignature } from "@/lib/webhook/verifyRazorpay";

// POST /api/webhooks/razorpay-subscription — Razorpay subscription webhook handler
// Handles: subscription.created, subscription.charged, subscription.updated, subscription.cancelled
export async function POST(req: Request) {
    try {
        logRequest(req as any, "POST /api/webhooks/razorpay-subscription");
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature") ?? "";
        const isValid = verifyRazorpaySignature(body, signature);
        
        if (!isValid) {
            logError("Invalid signature", "razorpay-subscription-webhook");
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

        const event = JSON.parse(body);
        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabase = await createServiceClient();

        switch (event.event) {
            case "subscription.created": {
                const subscription = event.payload.subscription.entity;
                const coachId = subscription.notes?.coach_id;
                const targetPlan = subscription.notes?.target_plan;
                const billingCycle = subscription.notes?.billing_cycle;

                if (!coachId || !targetPlan || !billingCycle) {
                    console.error("[Subscription Webhook] Missing notes in subscription");
                    break;
                }

                // Calculate period dates
                const now = new Date();
                const periodEnd = new Date(now);
                if (billingCycle === "annual") {
                    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
                } else {
                    periodEnd.setMonth(periodEnd.getMonth() + 1);
                }

                // Create subscription record
                await supabase.from("subscriptions").insert({
                    coach_id: coachId,
                    plan: targetPlan,
                    billing_cycle: billingCycle,
                    amount_inr: subscription.amount / 100, // Convert from paise
                    gateway_payment_id: subscription.id,
                    gateway_order_id: subscription.order_id,
                    status: "active",
                    current_period_start: now.toISOString().split("T")[0],
                    current_period_end: periodEnd.toISOString().split("T")[0],
                    started_at: new Date().toISOString(),
                });

                // Update coach plan
                const planLimit = getPlanLimit(targetPlan);
                await supabase
                    .from("coaches")
                    .update({
                        plan: targetPlan,
                        plan_client_limit: planLimit,
                        plan_started_at: new Date().toISOString(),
                        plan_billing_cycle: billingCycle,
                        next_billing_date: periodEnd.toISOString().split("T")[0],
                    })
                    .eq("id", coachId);

                console.log(
                    `[Subscription Webhook] Subscription created for coach: ${coachId}, plan: ${targetPlan}`
                );
                break;
            }

            case "subscription.charged": {
                const subscription = event.payload.subscription.entity;
                const coachId = subscription.notes?.coach_id;

                if (coachId) {
                    // Update subscription period
                    const periodEnd = new Date();
                    const { data: sub } = await supabase
                        .from("subscriptions")
                        .select("billing_cycle")
                        .eq("gateway_payment_id", subscription.id)
                        .single();

                    if (sub?.billing_cycle === "annual") {
                        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
                    } else {
                        periodEnd.setMonth(periodEnd.getMonth() + 1);
                    }

                    await supabase
                        .from("subscriptions")
                        .update({
                            status: "active",
                            current_period_end: periodEnd.toISOString().split("T")[0],
                        })
                        .eq("coach_id", coachId);

                    // Update coach next billing date
                    await supabase
                        .from("coaches")
                        .update({
                            next_billing_date: periodEnd.toISOString().split("T")[0],
                        })
                        .eq("id", coachId);

                    console.log(
                        `[Subscription Webhook] Subscription charged for coach: ${coachId}`
                    );
                }
                break;
            }

            case "subscription.updated": {
                const subscription = event.payload.subscription.entity;
                const coachId = subscription.notes?.coach_id;

                if (coachId) {
                    await supabase
                        .from("subscriptions")
                        .update({
                            status: "active",
                            updated_at: new Date().toISOString(),
                        })
                        .eq("gateway_payment_id", subscription.id);

                    console.log(
                        `[Subscription Webhook] Subscription updated for coach: ${coachId}`
                    );
                }
                break;
            }

            case "subscription.cancelled": {
                const subscription = event.payload.subscription.entity;
                const coachId = subscription.notes?.coach_id;

                if (coachId) {
                    // Update subscription status
                    await supabase
                        .from("subscriptions")
                        .update({
                            status: "cancelled",
                            cancelled_at: new Date().toISOString(),
                            cancel_reason: subscription.notes?.cancel_reason || "User cancelled",
                        })
                        .eq("coach_id", coachId);

                    // Update coach plan to trial/basic (downgrade at period end)
                    await supabase
                        .from("coaches")
                        .update({
                            plan: "trial",
                            plan_client_limit: 5,
                        })
                        .eq("id", coachId);

                    console.log(
                        `[Subscription Webhook] Subscription cancelled for coach: ${coachId}`
                    );
                }
                break;
            }

            case "subscription.halted": {
                // Payment failed for subscription
                const subscription = event.payload.subscription.entity;
                const coachId = subscription.notes?.coach_id;

                if (coachId) {
                    await supabase
                        .from("subscriptions")
                        .update({
                            status: "past_due",
                        })
                        .eq("coach_id", coachId);

                    console.error(
                        `[Subscription Webhook] Subscription halted for coach: ${coachId}`
                    );
                }
                break;
            }

            default:
                console.log(
                    `[Subscription Webhook] Unhandled event: ${event.event}`
                );
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[Subscription Webhook] Processing error:", error);
        return NextResponse.json(
            { error: "Webhook failed" },
            { status: 500 }
        );
    }
}

function getPlanLimit(plan: string): number | null {
    const limits: Record<string, number | null> = {
        trial: 5,
        starter: 10,
        basic: 25,
        pro: 50,
        studio: null,
    };
    return limits[plan] ?? 5;
}
