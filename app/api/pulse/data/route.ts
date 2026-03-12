import { NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

/**
 * GET /api/pulse/data — Comprehensive Weekly Pulse data
 * Returns AI summary, response rate, chart data, and client flags
 */
export async function GET() {
  const { coachId, supabase, error } = await getAuthenticatedCoach();
  if (error) return error;

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Fetch all pulse data in parallel
  const [
    aiSummaryResult,
    checkinsResult,
    renewalsResult,
    clientsResult,
  ] = await Promise.all([
    // 1. Latest AI summary
    supabase
      .from("ai_summaries")
      .select("*")
      .eq("coach_id", coachId!)
      .order("week_end_date", { ascending: false })
      .limit(1)
      .maybeSingle(),

    // 2. Check-ins from last 8 weeks (for chart)
    supabase
      .from("checkins")
      .select("check_date, energy_score, responded_at")
      .eq("coach_id", coachId!)
      .gte("check_date", new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("check_date", { ascending: true }),

    // 3. Renewals due in next 7 days
    supabase
      .from("enrollments")
      .select("id, end_date, clients(full_name)")
      .eq("coach_id", coachId!)
      .eq("status", "active")
      .gte("end_date", today)
      .lte("end_date", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),

    // 4. All active clients with latest check-in
    supabase
      .from("clients")
      .select(`
        id,
        full_name,
        status,
        enrollments (
          id,
          status,
          end_date
        ),
        checkins (
          energy_score,
          check_date
        )
      `)
      .eq("coach_id", coachId!)
      .eq("status", "active"),
  ]);

  // Process AI summary
  const latest_summary = aiSummaryResult.data || null;

  // Process check-in data for response rate and chart
  const checkins = checkinsResult.data || [];
  
  // Calculate response rate (clients who replied / check-ins sent in last 7 days)
  const last7DaysCheckins = checkins.filter(
    (c) => new Date(c.check_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const checkinsSent = last7DaysCheckins.length;
  const checkinsReplied = last7DaysCheckins.filter((c) => c.responded_at).length;
  const response_rate = checkinsSent > 0 ? Math.round((checkinsReplied / checkinsSent) * 100) : 0;

  // Calculate average energy (last 7 days)
  const avg_energy = checkinsSent > 0
    ? Math.round((last7DaysCheckins.reduce((sum, c) => sum + (c.energy_score || 0), 0) / checkinsSent) * 10) / 10
    : 0;

  // 8-week response rate chart data
  const weeklyData: { week: string; rate: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekCheckins = checkins.filter(
      (c) => new Date(c.check_date) >= weekStart && new Date(c.check_date) < weekEnd
    );
    const weekSent = weekCheckins.length;
    const weekReplied = weekCheckins.filter((c) => c.responded_at).length;
    const weekRate = weekSent > 0 ? Math.round((weekReplied / weekSent) * 100) : 0;
    
    weeklyData.push({
      week: `W${8 - i}`,
      rate: weekRate,
    });
  }

  // Process renewals
  const renewals_due = renewalsResult.data?.length || 0;

  // Process clients for flagging
  const clients = clientsResult.data || [];
  const clients_at_risk: { id: string; name: string; reason: string }[] = [];
  const clients_strong: { id: string; name: string; reason: string }[] = [];
  const clients_watch: { id: string; name: string; reason: string }[] = [];

  clients.forEach((client) => {
    const latestCheckin = client.checkins?.[0];
    const energy = latestCheckin?.energy_score || 0;
    const enrollment = client.enrollments?.[0];
    const daysRemaining = enrollment?.end_date
      ? Math.ceil((new Date(enrollment.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    // At Risk: energy <= 4 OR renewal in <= 3 days
    if (energy <= 4 || daysRemaining <= 3) {
      clients_at_risk.push({
        id: client.id,
        name: client.full_name,
        reason: energy <= 4 ? `Low energy (${energy}/10)` : `Renewal in ${daysRemaining} days`,
      });
    }
    // Strong: energy >= 8 consistently
    else if (energy >= 8) {
      clients_strong.push({
        id: client.id,
        name: client.full_name,
        reason: `High energy (${energy}/10)`,
      });
    }
    // Watch: energy 5-7 or declining
    else if (energy >= 5 && energy <= 7) {
      clients_watch.push({
        id: client.id,
        name: client.full_name,
        reason: `Moderate energy (${energy}/10)`,
      });
    }
  });

  return NextResponse.json({
    latest_summary,
    response_rate,
    avg_energy,
    checkins_sent: checkinsSent,
    renewals_due,
    weekly_data: weeklyData,
    clients_at_risk,
    clients_strong,
    clients_watch,
  });
}
