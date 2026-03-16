import { createServiceClient } from '@/lib/supabase/server';

export const PLAN_LIMITS = {
    trial: 5,
    starter: 10,
    basic: 25,
    pro: 50,
    studio: null, // null = unlimited
} as const;

export const GRACE_PERIOD_DAYS = 7;

export async function checkClientLimit(coachId: string): Promise<{
    allowed: boolean;
    currentCount: number;
    limit: number | null;
    plan: string;
    daysInGracePeriod: number | null;
}> {
    const supabase = await createServiceClient();

    // 1. Get coach plan and subscription details
    const { data: coach, error: coachError } = await supabase
        .from('coaches')
        .select('plan, plan_client_limit, plan_started_at')
        .eq('id', coachId)
        .single();

    if (coachError || !coach) {
        throw new Error('Failed to fetch coach plan details');
    }

    // 2. Count active clients
    const { count, error: countError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('coach_id', coachId)
        .eq('status', 'active');

    if (countError) {
        throw new Error('Failed to count active clients');
    }

    const currentCount = count || 0;
    const limit: number | null = PLAN_LIMITS[coach.plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.trial;

    if (limit === null) {
        return {
            allowed: true,
            currentCount,
            limit: null,
            plan: coach.plan,
            daysInGracePeriod: null,
        };
    }

    // 3. Check grace period (7 days after limit hit)
    const overLimit = currentCount >= limit;
    let daysInGracePeriod: number | null = null;

    if (overLimit && coach.plan_started_at) {
        const planStartDate = new Date(coach.plan_started_at);
        const currentDate = new Date();
        const daysSincePlanStart = Math.floor(
            (currentDate.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Calculate when the limit was first exceeded
        // Assuming clients were added at a steady rate, we estimate the limit breach date
        const clientsPerDay = currentCount / Math.max(daysSincePlanStart, 1);
        const daysUntilLimit = Math.floor(limit / Math.max(clientsPerDay, 1));
        const limitBreachedAt = new Date(planStartDate);
        limitBreachedAt.setDate(limitBreachedAt.getDate() + daysUntilLimit);

        const daysSinceLimitBreached = Math.floor(
            (currentDate.getTime() - limitBreachedAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Calculate remaining grace period days
        daysInGracePeriod = Math.max(0, GRACE_PERIOD_DAYS - daysSinceLimitBreached);
    }

    // Allow if within grace period
    const allowed = !overLimit || (daysInGracePeriod !== null && daysInGracePeriod > 0);

    return {
        allowed,
        currentCount,
        limit,
        plan: coach.plan,
        daysInGracePeriod,
    };
}
