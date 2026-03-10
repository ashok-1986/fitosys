import { createAdminClient } from './supabase-server';
import { createClient as createServerClient } from './supabase/server';
// Core matching PRD schema
export interface Client {
  id: string;
  coach_id: string;
  full_name: string;
  whatsapp_number: string;
  email: string;
  age: number | null;
  primary_goal: string | null;
  health_notes: string | null;
  status: 'active' | 'inactive' | 'trial';
  created_at: string;
}

export interface EnrichedClient {
  id: string;
  name: string;
  program: string;
  energy: number;
  sessions: number;
  risk: number; // 1-5 scale
  status: string;
  daysLeft: number;
}

export interface Checkin {
  id: string;
  coach_id: string;
  client_id: string;
  enrollment_id: string | null;
  week_number: number;
  check_date: string;
  weight_kg: number | null;
  sessions_completed: number | null;
  energy_score: number | null;
  notes: string | null;
  raw_reply: string | null;
  responded_at: string | null;
  clients?: { full_name: string, whatsapp_number: string };
}

export interface AiSummary {
  id: string;
  coach_id: string;
  week_start_date: string;
  week_end_date: string;
  summary_text: string;
  total_clients: number;
  responded_count: number;
  avg_energy_score: number;
}

/**
 * Fetches clients and automatically calculates their derived metrics (energy, daysLeft, risk)
 * by joining the enrollments and checkins tables.
 */
export async function getEnrichedClients(coachId: string): Promise<EnrichedClient[]> {
  const supabase = createAdminClient();

  // Fetch clients with their active enrollment and latest checkin
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      full_name,
      status,
      enrollments (
        end_date,
        programs (name)
      ),
      checkins (
        energy_score,
        sessions_completed,
        check_date
      )
    `)
    .eq('coach_id', coachId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching clients for coach ${coachId}:`, error);
    return [];
  }

  // Transform the raw Supabase join data into the clean EnrichedClient payload the UI expects
  return (data || []).map((row: Record<string, unknown>) => {
    const enrollments = row.enrollments as Array<{ end_date?: string; programs?: { name?: string } }> | null;
    const enrollment = enrollments && enrollments.length > 0 ? enrollments[0] : null;
    const programName = enrollment?.programs?.name || "No Active Program";

    // Calculate days left
    let daysLeft = 999;
    if (enrollment?.end_date) {
      const msDiff = new Date(enrollment.end_date).getTime() - new Date().getTime();
      daysLeft = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
    }

    // Get latest checkin (Supabase returns an array, we find the newest by date)
    const checkins = (row.checkins || []) as Array<{ check_date: string; energy_score?: number; sessions_completed?: number }>;
    const latestCheckin = checkins.sort((a, b) => new Date(b.check_date).getTime() - new Date(a.check_date).getTime())[0];

    const energy = latestCheckin?.energy_score || 0;
    const sessions = latestCheckin?.sessions_completed || 0;

    // Calculate arbitrary risk factor for the UI (1-5) based on energy
    let risk = 1;
    if (energy > 0) {
      if (energy <= 3) risk = 5;
      else if (energy <= 5) risk = 4;
      else if (energy <= 7) risk = 2;
    } else {
      risk = daysLeft < 7 ? 4 : 2; // High risk if no checkin and expiring soon
    }

    return {
      id: row.id as string,
      name: row.full_name as string,
      program: programName,
      energy,
      sessions,
      risk,
      status: typeof row.status === 'string' ? row.status : 'inactive',
      daysLeft: Math.max(0, daysLeft) // Prevent negative 
    };
  });
}

export async function getRecentCheckins(coachId: string, limit = 10): Promise<Checkin[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('checkins')
    .select(`*, clients (full_name, whatsapp_number)`)
    .eq('coach_id', coachId)
    .order('check_date', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as Checkin[];
}

export async function getLatestAiSummary(coachId: string): Promise<AiSummary | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('ai_summaries')
    .select('*')
    .eq('coach_id', coachId)
    .order('week_end_date', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') return null;
  return data as AiSummary;
}

export async function getClientProfile(clientId: string) {
  const supabase = createAdminClient();

  const { data: client, error: clientErr } = await supabase
    .from('clients')
    .select(`
      *,
      enrollments (
        id, start_date, end_date,
        programs (name)
      )
    `)
    .eq('id', clientId)
    .single();

  if (clientErr || !client) return null;

  const { data: checkins } = await supabase
    .from('checkins')
    .select('*')
    .eq('client_id', clientId)
    .order('check_date', { ascending: false })
    .limit(7);

  const enrollment = client.enrollments?.[0] || null;
  let daysLeft = 999;
  if (enrollment?.end_date) {
    const diff = new Date(enrollment.end_date).getTime() - new Date().getTime();
    daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Calculate weight progress if we have more than 1 checkin
  let weightProgress = 0;
  if (checkins && checkins.length >= 2) {
    const latestWeight = checkins[0].weight_kg || 0;
    const initialWeight = checkins[checkins.length - 1].weight_kg || 0;
    if (latestWeight && initialWeight) {
      weightProgress = latestWeight - initialWeight;
    }
  }

  return {
    ...client,
    program: enrollment?.programs?.name || "No Active Program",
    daysLeft: Math.max(0, daysLeft),
    recentCheckins: checkins || [],
    weightProgress
  };
}

export async function getCurrentCoachId(): Promise<string> {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('[getCurrentCoachId] Authentication error:', error);
    throw new Error('Unauthorized: No authenticated user');
  }

  return user.id;
}

export async function getCoachProfile(coachId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('id', coachId)
    .single();

  if (error) {
    console.error(`Error fetching coach profile:`, error);
    return null;
  }

  return data;
}

/**
 * Get renewals due in the next 7 days with client and program details
 * PRD Section 8.1: renewals array
 */
export async function getRenewalsWithDetails(coachId: string): Promise<{
  client_name: string;
  program: string;
  end_date: string;
  days_remaining: number;
}[]> {
  const supabase = createAdminClient();
  const today = new Date().toISOString().split('T')[0];
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      end_date,
      clients (full_name),
      programs (name)
    `)
    .eq('coach_id', coachId)
    .eq('status', 'active')
    .gte('end_date', today)
    .lte('end_date', in7Days);

  if (error) {
    console.error('Error fetching renewals with details:', error);
    return [];
  }

  return (data || []).map((enrollment: any) => {
    const endDate = new Date(enrollment.end_date);
    const todayDate = new Date(today);
    const daysRemaining = Math.ceil((endDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      client_name: enrollment.clients?.full_name || 'Unknown',
      program: enrollment.programs?.name || 'Unknown Program',
      end_date: enrollment.end_date,
      days_remaining: daysRemaining
    };
  });
}

/**
 * Get revenue for the current month
 * PRD Section 8.1: revenue_this_month
 */
export async function getRevenueThisMonth(coachId: string): Promise<{ amount: number; currency: string }> {
  const supabase = createAdminClient();

  // Get start of current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  // Sum payments received this month
  const { data: payments, error } = await supabase
    .from('payments')
    .select('amount, currency')
    .eq('coach_id', coachId)
    .gte('paid_at', startOfMonth)
    .lte('paid_at', endOfMonth + 'T23:59:59Z');

  if (error) {
    console.error('Error fetching monthly revenue:', error);
    return { amount: 0, currency: 'INR' };
  }

  // If no payments, try getting from enrollments that started this month
  if (!payments || payments.length === 0) {
    // Fallback: sum enrollments that started this month
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('amount_paid, currency')
      .eq('coach_id', coachId)
      .eq('status', 'active')
      .gte('start_date', startOfMonth)
      .lte('start_date', endOfMonth);

    if (enrollError) {
      console.error('Error fetching enrollment revenue:', enrollError);
      return { amount: 0, currency: 'INR' };
    }

    const total = (enrollments || []).reduce((sum, e) => sum + (Number(e.amount_paid) || 0), 0);
    return { amount: total, currency: 'INR' };
  }

  const total = (payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const currency = payments[0]?.currency || 'INR';

  return { amount: total, currency };
}

export async function getRenewalsDueCount(coachId: string): Promise<number> {
  const supabase = createAdminClient();
  const today = new Date().toISOString().split('T')[0];
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { count, error } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('coach_id', coachId)
    .eq('status', 'active')
    .gte('end_date', today)
    .lte('end_date', in7Days);

  if (error) {
    console.error('Error fetching renewals count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Normalized MRR Calculation
 * Formula: SUM(amount_paid / (duration_weeks / 4.0))
 */
export async function getMRR(coachId: string): Promise<number> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      amount_paid,
      programs (
        duration_weeks
      )
    `)
    .eq('coach_id', coachId)
    .eq('status', 'active');

  if (error || !data) {
    console.error('Error fetching MRR:', error);
    return 0;
  }

  const totalMRR = (data as any[]).reduce((sum, enrollment) => {
    const amountPaid = Number(enrollment.amount_paid) || 0;
    const durationWeeks = enrollment.programs?.duration_weeks || 4;
    const durationMonths = Math.max(durationWeeks / 4.0, 1);
    
    return sum + (amountPaid / durationMonths);
  }, 0);

  return Math.round(totalMRR);
}

/**
 * Get daily check-in counts for the last 7 days for the engagement chart
 */
export async function getWeeklyEngagementStats(coachId: string): Promise<{ day: string; count: number }[]> {
  const supabase = createAdminClient();
  
  // Get last 7 days labels
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: { day: string; count: number; date: string }[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      day: days[d.getDay()],
      date: d.toISOString().split('T')[0],
      count: 0
    });
  }

  const startDate = result[0].date;
  const endDate = result[6].date;

  const { data, error } = await supabase
    .from('checkins')
    .select('check_date')
    .eq('coach_id', coachId)
    .gte('check_date', startDate)
    .lte('check_date', endDate);

  if (error) {
    console.error('Error fetching engagement stats:', error);
    return result.map(({ day, count }) => ({ day, count }));
  }

  // Aggregate counts
  (data || []).forEach((checkin: any) => {
    const item = result.find(r => r.date === checkin.check_date);
    if (item) item.count++;
  });

  return result.map(({ day, count }) => ({ day, count }));
}
/**
 * Get client count summary (Total, Active, At Risk) for the roster header
 */
export async function getCoachClientStats(coachId: string): Promise<{
  total: number;
  active: number;
  at_risk: number;
}> {
  const supabase = createAdminClient();

  // Fetch count of all clients for this coach
  const { count: total, error: totalErr } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('coach_id', coachId);

  if (totalErr) {
    console.error('Error fetching total clients:', totalErr);
    return { total: 0, active: 0, at_risk: 0 };
  }

  // Fetch active enrollments (for 'active' count)
  const { count: active, error: activeErr } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('coach_id', coachId)
    .eq('status', 'active');

  if (activeErr) console.error('Error fetching active clients:', activeErr);

  // For 'at risk' count, we look at clients with low energy scores
  // (In a more complex app, we'd join but let's do a simple count for now)
  const { count: at_risk, error: riskErr } = await supabase
    .from('checkins')
    .select('*', { count: 'exact', head: true })
    .eq('coach_id', coachId)
    .lte('energy_score', 3)
    .gte('check_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  if (riskErr) console.error('Error fetching at risk count:', riskErr);

  return {
    total: total || 0,
    active: active || 0,
    at_risk: at_risk || 0
  };
}
