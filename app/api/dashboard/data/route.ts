import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase-server";

/**
 * GET /api/dashboard/data
 * Comprehensive dashboard data endpoint for the new coach dashboard UI
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coachId = user.id;
    const adminSupabase = createAdminClient();
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Fetch all dashboard data in parallel
    const [
      coachResult,
      programsResult,
      activeClientsResult,
      renewalsResult,
      recentCheckinsResult,
      checkinsByDayResult,
      aiSummaryResult,
    ] = await Promise.all([
      adminSupabase.from("coaches").select("id, full_name, email").eq("id", coachId).single(),
      adminSupabase.from("programs").select("*").eq("coach_id", coachId).eq("status", "active").limit(5),
      adminSupabase.from("clients").select("id", { count: "exact", head: true }).eq("coach_id", coachId).eq("status", "active"),
      adminSupabase.from("enrollments").select(`id, end_date, clients (full_name), programs (name)`).eq("coach_id", coachId).eq("status", "active").gte("end_date", today).lte("end_date", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]),
      adminSupabase.from("checkins").select(`id, energy_score, sessions_completed, check_date, clients (full_name)`).eq("coach_id", coachId).order("check_date", { ascending: false }).limit(10),
      adminSupabase.from("checkins").select("check_date").eq("coach_id", coachId).gte("check_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]),
      adminSupabase.from("ai_summaries").select("*").eq("coach_id", coachId).order("week_end_date", { ascending: false }).limit(1).maybeSingle(),
    ]);

    // Process chart data
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const checkinsByDay: Record<string, number> = {};
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      last7Days.push(dateStr);
      checkinsByDay[dateStr] = 0;
    }
    (checkinsByDayResult.data || []).forEach((c: { check_date: string }) => {
      if (checkinsByDay[c.check_date] !== undefined) checkinsByDay[c.check_date]++;
    });

    const totalClients = activeClientsResult.count || 1;
    const chartData = last7Days.map((date) => ({
      label: daysOfWeek[new Date(date).getDay()],
      value: Math.round(((checkinsByDay[date] || 0) / totalClients) * 100),
    }));

    // Process renewals
    const renewals = (renewalsResult.data || []).map((e: any) => ({
      id: e.id,
      client_name: e.clients?.full_name || "Unknown",
      program: e.programs?.name || "Unknown Program",
      end_date: e.end_date,
      days_remaining: Math.ceil((new Date(e.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    }));

    // Process recent updates
    const recentUpdates = (recentCheckinsResult.data || []).slice(0, 5).map((c: any) => {
      const clientName = c.clients?.full_name || "Client";
      return {
        id: c.id,
        client_name: clientName,
        client_initials: clientName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
        program_name: "Active Program",
        message: `Energy ${c.energy_score || 0}/10, ${c.sessions_completed || 0} sessions`,
        gradient: `linear-gradient(135deg,#7f0000,#c00)`,
      };
    });

    // Process pending tasks
    const pendingTasks = [
      aiSummaryResult.data ? { id: "ai", text: `Review AI summary — ${aiSummaryResult.data.total_clients || 0} clients`, due: "today" as const, completed: false } : null,
      ...renewals.slice(0, 2).map((r: any) => ({
        id: `renewal-${r.id}`,
        text: `Confirm ${r.client_name} renewal`,
        due: r.days_remaining <= 3 ? "days" as const : "week" as const,
        daysUntil: r.days_remaining,
        completed: false,
      })),
    ].filter(Boolean);

    return NextResponse.json({
      coach: coachResult.data || null,
      stats: {
        active_clients: activeClientsResult.count || 0,
        total_programs: programsResult.data?.length || 0,
        renewals_due: renewals.length,
        response_rate: Math.round((recentCheckinsResult.data?.length || 0) / 10 * 100),
      },
      programs: programsResult.data || [],
      renewals,
      recent_updates: recentUpdates,
      chart_data: {
        week: chartData,
        average: Math.round(chartData.reduce((sum: number, d: { value: number }) => sum + d.value, 0) / chartData.length) || 0,
      },
      pending_tasks: pendingTasks.slice(0, 5),
      ai_summary: aiSummaryResult.data || null,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
