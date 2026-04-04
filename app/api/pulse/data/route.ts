import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

export async function GET(_request: NextRequest) {
  const { coachId, supabase, error } = await getAuthenticatedCoach();
  if (error) return error;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const weekStart = new Date(today.setDate(diffToMonday));
  weekStart.setHours(0, 0, 0, 0);

  const [
    latestSummaryRes,
    summaryHistoryRes,
    activeClientsRes,
    thisWeekCheckinsRes,
    nonRespondersRes
  ] = await Promise.all([
    supabase!
      .from("ai_summaries")
      .select("id, summary_text, week_start_date, week_end_date, total_clients, responded_count, avg_energy_score, generated_at")
      .eq("coach_id", coachId!)
      .order("week_end_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase!
      .from("ai_summaries")
      .select("id, summary_text, week_start_date, week_end_date, total_clients, responded_count, avg_energy_score, generated_at")
      .eq("coach_id", coachId!)
      .order("week_end_date", { ascending: false })
      .limit(8),
    supabase!
      .from("clients")
      .select("*", { count: 'exact', head: true })
      .eq("coach_id", coachId!)
      .eq("status", "active"),
    supabase!
      .from("checkins")
      .select("id, client_id, responded_at, energy_score")
      .eq("coach_id", coachId!)
      .gte("check_date", weekStart.toISOString()),
    supabase!
      .from("clients")
      .select("id, full_name, whatsapp_number")
      .eq("coach_id", coachId!)
      .eq("status", "active")
  ]);

  const latestSummary = latestSummaryRes.data;
  const summaryHistory = summaryHistoryRes.data || [];
  const activeClientsCount = activeClientsRes.count || 0;
  const thisWeekCheckins = thisWeekCheckinsRes.data || [];

  const thisWeekTotal = thisWeekCheckins.length;
  const respondedCheckins = thisWeekCheckins.filter(c => c.responded_at);
  const thisWeekResponded = respondedCheckins.length;
  const thisWeekRate = thisWeekTotal > 0 ? Math.round((thisWeekResponded / thisWeekTotal) * 100) : 0;

  // Average energy, to 1 decimal
  const validEnergies = respondedCheckins.filter(c => typeof c.energy_score === 'number');
  const thisWeekAvgEnergy = validEnergies.length > 0
    ? Number((validEnergies.reduce((acc, c) => acc + (c.energy_score as number), 0) / validEnergies.length).toFixed(1))
    : 0;

  // Non-responders
  const respondedClientIds = new Set(respondedCheckins.map(c => c.client_id));
  const activeClientsList = nonRespondersRes.data || [];
  const nonRespondersList = activeClientsList
    .filter(c => !respondedClientIds.has(c.id))
    .slice(0, 10);

  // Weekly Chart
  const weeklyChart = [];
  const reversedHistory = [...summaryHistory].reverse();
  const padCount = 8 - reversedHistory.length;

  for (let i = 0; i < padCount; i++) {
    weeklyChart.push({
      week: "—",
      rate: 0,
      avg_energy: 0
    });
  }

  for (let i = 0; i < reversedHistory.length; i++) {
    const item = reversedHistory[i];
    const rate = item.total_clients > 0 ? Math.min(100, Math.round((item.responded_count / item.total_clients) * 100)) : 0;
    weeklyChart.push({
      week: `Wk ${padCount + i + 1}`,
      rate: rate,
      avg_energy: item.avg_energy_score || 0
    });
  }

  return NextResponse.json({
    latest_summary: latestSummary,
    summary_history: summaryHistory,
    this_week: {
      total_sent: thisWeekTotal,
      responded: thisWeekResponded,
      response_rate: thisWeekRate,
      avg_energy: thisWeekAvgEnergy
    },
    active_clients: activeClientsCount,
    non_responders: nonRespondersList,
    weekly_chart: weeklyChart
  });
}
