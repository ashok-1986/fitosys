import { getRazorpay } from "./client";

export const PLAN_IDS: Record<string, string> = {
    starter: "plan_SYJ35cOkNKaqa2",
    basic: "plan_SYJ4CsnkhF783k",
    pro: "plan_SYJ4ja7gzGDgbB",
    studio: "plan_SYJ5D3O0WbR5qD",
};

export const PLAN_AMOUNTS: Record<string, number> = {
    starter: 999,
    basic: 1499,
    pro: 2999,
    studio: 5999,
};

export async function createRazorpaySubscription({ planName, coachId, coachEmail, coachName, coachWhatsApp }: { planName: string, coachId: string, coachEmail: string, coachName: string, coachWhatsApp: string }) {
    const planId = PLAN_IDS[planName];
    if (!planId) throw new Error(`Plan ID not found for ${planName}`);

    const subscription = await getRazorpay().subscriptions.create({
        plan_id: planId,
        total_count: 120,
        customer_notify: 1,
        quantity: 1,
        notes: { coach_id: coachId, plan: planName, target_plan: planName, billing_cycle: "monthly" }
    });

    return subscription;
}

export async function cancelRazorpaySubscription({ subscriptionId }: { subscriptionId: string }) {
    const result = await getRazorpay().subscriptions.cancel(subscriptionId, false);
    return result;
}
