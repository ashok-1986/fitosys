import { NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

export async function GET() {
  const { coachId, supabase, error } = await getAuthenticatedCoach();
  if (error) return error;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString().split("T")[0];
  const today = now.toISOString().split("T")[0];
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    .toISOString().split("T")[0];

  const [
    coachResult,
    activeClientsResult,
    allRevenueResult,
    monthRevenueResult,
    renewalsResult,
    checkinsResult,
    programsResult,
    summaryResult,
    recentCheckinsResult,
  ] = await Promise.all([
    supabase!.from("coaches").select("id, full_name, email").eq("id", coachId!).single(),
    supabase!.from("clients").select("id", { count: "exact", head: true }).eq("coach_id", coachId!).eq("status", "active"),
    supabase!.from("payments").select("amount").eq("coach_id", coachId!).eq("gateway_payment_status", "captured"),
    supabase!.from("payments").select("amount").eq("coach_id", coachId!).eq("gateway_payment_status", "captured").gte("paid_at", monthStart),
    supabase!.from("enrollments")
      .select("id, client_id, end_date, clients(full_name), programs(name)")
      .eq("coach_id", coachId!)
      .eq("status", "active")
      .gte("end_date", today)
      .lte("end_date", weekFromNow),
    supabase!.from("checkins")
      .select("id, client_id, responded_at, energy_score")
      .eq("coach_id", coachId!)
      .gte("check_date", weekStart)
      .lte("check_date", today),
    supabase!.from("programs")
      .select("id, name, price, duration_weeks, description, is_active")
      .eq("coach_id", coachId!)
      .eq("is_active", true),
    supabase!.from("ai_summaries")
      .select("id, summary_text, total_clients, responded_count, avg_energy_score")
      .eq("coach_id", coachId!)
      .order("week_end_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase!.from("checkins")
      .select("id, client_id, raw_reply, energy_score, responded_at, clients(full_name), enrollments(programs(name))")
      .eq("coach_id", coachId!)
      .not("responded_at", "is", null)
      .order("responded_at", { ascending: false })
      .limit(5),
  ]);

  // Stats
  const totalRevenue = (allRevenueResult.data || []).reduce((s, p) => s + Number(p.amount), 0);
  const mrr = (monthRevenueResult.data || []).reduce((s, p) => s + Number(p.amount), 0);
  const totalCheckins = (checkinsResult.data || []).length;
  const responded = (checkinsResult.data || []).filter(c => c.responded_at).length;
  const responseRate = totalCheckins > 0 ? Math.round((responded / totalCheckins) * 100) : 0;

  // Renewals
  const renewals = (renewalsResult.data || []).map(e => ({
    id: e.id,
    client_name: (e.clients as unknown as { full_name: string })?.full_name || "Unknown",
    program: (e.programs as unknown as { name: string })?.name || "Unknown",
    end_date: e.end_date,
    days_remaining: Math.ceil(
      (new Date(e.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ),
  }));

  // Pending tasks — derived from real data
  const pendingTasks = [
    ...renewals.slice(0, 3).map(r => ({
      id: `renewal-${r.id}`,
      text: `Renewal due: ${r.client_name} — ${r.program}`,
      due: r.days_remaining <= 1 ? "today" as const : "days" as const,
      daysUntil: r.days_remaining,
      completed: false,
    })),
    ...(checkinsResult.data || [])
      .filter(c => !c.responded_at)
      .slice(0, 2)
      .map(c => ({
        id: `checkin-${c.id}`,
        text: `No check-in response this week`,
        due: "today" as const,
        completed: false,
      })),
  ];

  // Recent updates from check-in replies
  const gradients = [
    "linear-gradient(135deg,#7f0000,#c00)",
    "linear-gradient(135deg,#003366,#0055a5)",
    "linear-gradient(135deg,#1a472a,#2d6a4f)",
    "linear-gradient(135deg,#4a1942,#7b2d8b)",
    "linear-gradient(135deg,#7d4e00,#b87300)",
  ];

  const recentUpdates = (recentCheckinsResult.data || []).map((c, i) => {
    const clientName = (c.clients as unknown as { full_name: string })?.full_name || "Unknown";
    const programName = (c.enrollments as unknown as { programs: { name: string } })?.programs?.name || "Program";
    const initials = clientName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    return {
      id: c.id,
      client_name: clientName,
      client_initials: initials,
      program_name: programName,
      message: c.raw_reply?.slice(0, 60) || `Energy ${c.energy_score}/10`,
      gradient: gradients[i % gradients.length],
    };
  });

  // Chart data — last 7 days check-in rate by day
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartWeek = days.map((label, i) => {
    const dayCheckins = (checkinsResult.data || []).filter(c => {
      const d = new Date(c.responded_at || "");
      return d.getDay() === i;
    });
    const total = (checkinsResult.data || []).filter(c => {
      const d = new Date(c.responded_at || now);
      return d.getDay() === i;
    }).length;
    const value = total > 0 ? Math.round((dayCheckins.filter(c => c.responded_at).length / total) * 100) : 0;
    return { label, value };
  });

  // Programs
  const programs = (programsResult.data || []).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    duration_weeks: p.duration_weeks,
    description: p.description,
    status: p.is_active ? "active" : "inactive",
    active_enrollments: 0,
  }));

  return NextResponse.json({
    coach: coachResult.data || null,
    stats: {
      active_clients: activeClientsResult.count || 0,
      total_programs: programs.length,
      total_revenue: totalRevenue,
      mrr,
      renewals_due: renewals.length,
      response_rate: responseRate,
    },
    programs,
    renewals,
    recent_updates: recentUpdates,
    chart_data: {
      week: chartWeek,
      average: responseRate,
    },
    pending_tasks: pendingTasks,
    ai_summary: summaryResult.data || null,
  });
}