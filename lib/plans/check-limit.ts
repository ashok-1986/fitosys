import { createServiceClient } from '@/lib/supabase/server';

export const PLAN_LIMITS = {
    trial: 5,
    starter: 10,
    basic: 25,
    pro: 50,
    studio: null, // null = unlimited
} as const;

export async function checkClientLimit(coachId: string): Promise<{
    allowed: boolean;
    currentCount: number;
    limit: number | null;
    plan: string;
    daysInGracePeriod: number | null;
}> {
    const supabase = await createServiceClient();

    // 1. Get coach plan
    const { data: coach, error: coachError } = await supabase
        .from('coaches')
        .select('plan, plan_client_limit')
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
    // TODO: Implement actual grace period tracking using subscriptions table if needed
    // For now, simple return blocked if over limit
    const daysInGracePeriod = overLimit ? 0 : null;

    return {
        allowed: !overLimit, // blocked immediately for MVP until grace logic fleshed out
        currentCount,
        limit,
        plan: coach.plan,
        daysInGracePeriod,
    };
}
