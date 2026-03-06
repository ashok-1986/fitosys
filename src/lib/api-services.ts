import { createAdminClient } from './supabase-server';

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
  return (data || []).map((row: any) => {
    // Safely extract deeply nested relations (assuming 1 active enrollment for now)
    const enrollment = row.enrollments && row.enrollments.length > 0 ? row.enrollments[0] : null;
    const programName = enrollment?.programs?.name || "No Active Program";
    
    // Calculate days left
    let daysLeft = 999;
    if (enrollment?.end_date) {
      const msDiff = new Date(enrollment.end_date).getTime() - new Date().getTime();
      daysLeft = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
    }

    // Get latest checkin (Supabase returns an array, we find the newest by date)
    const checkins = row.checkins || [];
    const latestCheckin = checkins.sort((a: any, b: any) => new Date(b.check_date).getTime() - new Date(a.check_date).getTime())[0];
    
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
      id: row.id,
      name: row.full_name,
      program: programName,
      energy,
      sessions,
      risk,
      status: row.status,
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
  return "00000000-0000-0000-0000-000000000000";
}
