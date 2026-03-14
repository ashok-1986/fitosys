import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay/client";
import { logRequest } from "@/lib/loggerHelpers";

// POST /api/subscriptions/cancel — Cancel subscription at end of billing period
export async function POST(request: NextRequest) {
    logRequest(request, "POST /api/subscriptions/cancel");

    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    try {
        const { cancelReason } = await request.json();

        // Get active subscription
        const { data: subscription, error: subError } = await supabase
            .from("subscriptions")
            .select("id, gateway_payment_id, plan, current_period_end")
            .eq("coach_id", coachId)
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (subError || !subscription) {
            return NextResponse.json(
                { error: "No active subscription found" },
                { status: 404 }
            );
        }

        // Cancel in Razorpay (if subscription ID exists)
        if (subscription.gateway_payment_id) {
            try {
                const razorpay = getRazorpay();
                await razorpay.subscriptions.cancel(subscription.gateway_payment_id);
            } catch (razorpayError) {
                console.error("[Cancel Subscription] Razorpay API error:", razorpayError);
                // Continue with local cancellation even if Razorpay fails
            }
        }

        // Update local subscription record
        await supabase
            .from("subscriptions")
            .update({
                status: "cancelled",
                cancelled_at: new Date().toISOString(),
                cancel_reason: cancelReason || "User requested cancellation",
            })
            .eq("id", subscription.id);

        // Note: Coach plan remains active until current_period_end
        // The webhook will handle the actual downgrade when period ends

        console.log(
            `[Subscriptions API] Coach ${coachId} cancelled subscription. Access until ${subscription.current_period_end}`
        );

        return NextResponse.json({
            success: true,
            message: "Subscription cancelled. Access continues until end of billing period.",
            accessUntil: subscription.current_period_end,
        });
    } catch (error) {
        console.error("[Subscriptions API] Cancel error:", error);
        return NextResponse.json(
            { error: "Failed to cancel subscription" },
            { status: 500 }
        );
    }
}
