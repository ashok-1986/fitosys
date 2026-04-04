import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";
import { cancelRazorpaySubscription } from "@/lib/razorpay/subscriptions";

export async function POST(request: NextRequest) {
    try {
        const { coachId, supabase, error } = await getAuthenticatedCoach();
        if (error) return NextResponse.json({ error }, { status: 401 });

        const { data: sub } = await supabase!
            .from("subscriptions")
            .select("*")
            .eq("coach_id", coachId!)
            .eq("status", "active")
            .limit(1)
            .maybeSingle();

        if (!sub) {
            return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
        }

        await cancelRazorpaySubscription({ subscriptionId: sub.gateway_payment_id });

        await supabase!
            .from("subscriptions")
            .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
            .eq("id", sub.id);

        return NextResponse.json({ success: true, access_until: sub.current_period_end });
    } catch (err: any) {
        console.error("Subscription cancel error:", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
