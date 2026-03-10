import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";
import { checkClientLimit } from "@/lib/plans/check-limit";

export async function GET(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    try {
        const limitCheck = await checkClientLimit(coachId!);

        // Try getting active subscription details
        const { data: sub } = await supabase!
            .from("subscriptions")
            .select("amount_inr, current_period_end, billing_cycle")
            .eq("coach_id", coachId!)
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        let daysRemaining = null;
        if (sub?.current_period_end) {
            const end = new Date(sub.current_period_end);
            const now = new Date();
            const diffTime = Math.abs(end.getTime() - now.getTime());
            daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        const utilisationPct = limitCheck.limit
            ? Math.round((limitCheck.currentCount / limitCheck.limit) * 100)
            : 0;

        return NextResponse.json({
            plan: limitCheck.plan,
            client_limit: limitCheck.limit,
            active_clients: limitCheck.currentCount,
            utilisation_pct: utilisationPct,
            show_upgrade_prompt: limitCheck.limit !== null && utilisationPct >= 80,
            amount_inr: sub?.amount_inr || 0,
            billing_cycle: sub?.billing_cycle || 'monthly',
            current_period_end: sub?.current_period_end || null,
            days_remaining: daysRemaining,
        });
    } catch (err) {
        console.error("[Subscriptions API] Error fetching current plan:", err);
        return NextResponse.json({ error: "Failed to fetch plan stats" }, { status: 500 });
    }
}
