import { NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/coaches/dashboard — Aggregated dashboard summary data
export async function GET() {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const weekFromNow = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString().split("T")[0];
    const today = now.toISOString().split("T")[0];

    // Parallel queries for dashboard data
    const [
        clientsResult,
        revenueResult,
        renewalsResult,
        checkinsResult,
        summaryResult,
    ] = await Promise.all([
        // Active client count
        supabase!
            .from("clients")
            .select("id", { count: "exact", head: true })
            .eq("coach_id", coachId!)
            .eq("status", "active"),

        // Revenue this month
        supabase!
            .from("payments")
            .select("amount, currency")
            .eq("coach_id", coachId!)
            .gte("paid_at", monthStart)
            .eq("gateway_payment_status", "captured"),

        // Enrollments expiring within 7 days
        supabase!
            .from("enrollments")
            .select("id, client_id, program_id, end_date, clients(full_name), programs(name)")
            .eq("coach_id", coachId!)
            .eq("status", "active")
            .gte("end_date", today)
            .lte("end_date", weekFromNow),

        // Last week's check-in data for response rate
        supabase!
            .from("checkins")
            .select("id, client_id, responded_at, energy_score, clients(full_name)")
            .eq("coach_id", coachId!)
            .gte("check_date", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
            .lte("check_date", today),

        // Latest AI summary
        supabase!
            .from("ai_summaries")
            .select("summary_text")
            .eq("coach_id", coachId!)
            .order("week_end_date", { ascending: false })
            .limit(1)
            .maybeSingle(),
    ]);

    // Calculate revenue
    const revenue = (revenueResult.data || []).reduce(
        (sum, p) => sum + Number(p.amount),
        0
    );
    const currency =
        (revenueResult.data || [])[0]?.currency || "INR";

    // Calculate response rate
    const totalCheckins = (checkinsResult.data || []).length;
    const responded = (checkinsResult.data || []).filter(
        (c) => c.responded_at
    ).length;
    const responseRate = totalCheckins > 0 ? responded / totalCheckins : 0;

    // Clients needing attention (low energy or no response)
    const clientsNeeding = (checkinsResult.data || [])
        .filter(
            (c) =>
                !c.responded_at ||
                (c.energy_score !== null && c.energy_score <= 4)
        )
        .map((c) => ({
            id: c.client_id,
            name: (c.clients as unknown as { full_name: string })?.full_name || "Unknown",
            reason: !c.responded_at
                ? "No check-in response this week"
                : `Low energy score: ${c.energy_score}/10`,
            last_energy_score: c.energy_score,
        }))
        .slice(0, 5);

    // Format renewals
    const renewals = (renewalsResult.data || []).map((e) => ({
        client_name: (e.clients as unknown as { full_name: string })?.full_name || "Unknown",
        client_id: e.client_id,
        program: (e.programs as unknown as { name: string })?.name || "Unknown",
        end_date: e.end_date,
        days_remaining: Math.ceil(
            (new Date(e.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ),
    }));

    return NextResponse.json({
        active_clients: clientsResult.count || 0,
        revenue_this_month: revenue,
        currency,
        renewals_due_this_week: renewals.length,
        checkin_response_rate_last_week: Math.round(responseRate * 100) / 100,
        clients_needing_attention: clientsNeeding,
        last_summary_preview: summaryResult.data?.summary_text?.slice(0, 200) || null,
        renewals,
    });
}
