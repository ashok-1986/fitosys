import { getRazorpay } from "./client";

interface CreateSubscriptionParams {
    planId: string; // Razorpay Plan ID created in dashboard
    coachId: string;
    totalCount?: number; // how many billing cycles, 0 = infinite
    customerNotify?: boolean;
}

export async function createCoachSubscription(
    params: CreateSubscriptionParams
) {
    const subscription = await getRazorpay().subscriptions.create({
        plan_id: params.planId,
        total_count: params.totalCount ?? 0,
        customer_notify: params.customerNotify ? 1 : 0,
        notes: {
            coach_id: params.coachId,
        },
    });

    return subscription;
}
