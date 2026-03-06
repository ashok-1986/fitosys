import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { generateWeeklySummary, SummaryInput, CheckInData } from '@/lib/gemini';

export async function GET(req: Request) {
  // 1. Verify Authentication
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  try {
    // 2. Fetch all active coaches
    const { data: coaches, error: coachErr } = await supabase
      .from('coaches')
      .select('id, full_name');
      
    if (coachErr || !coaches) throw new Error("Could not fetch coaches");

    // We calculate dates for "this past week" dynamically
    const now = new Date();
    const weekEnd = new Date(now);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    
    const results = [];

    // 3. Process each coach individually
    for (const coach of coaches) {
      // Get all active clients for this coach to calculate response rate
      const { data: activeClients } = await supabase
        .from('clients')
        .select('id, full_name')
        .eq('coach_id', coach.id)
        .eq('status', 'active');
        
      if (!activeClients || activeClients.length === 0) continue;

      // Get all checkins from the last 7 days for this coach
      const { data: checkins } = await supabase
        .from('checkins')
        .select('*, clients!inner(full_name)')
        .eq('coach_id', coach.id)
        .gte('check_date', weekStart.toISOString().split('T')[0]);

      const respondedClientsList = checkins || [];
      const respondedClientIds = new Set(respondedClientsList.map(c => c.client_id));
      
      // Identify non-responders
      const nonResponders = activeClients
        .filter(c => !respondedClientIds.has(c.id))
        .map(c => c.full_name);

      // Map Supabase checkins to the Gemini/Qwen Input Interface
      const formattedCheckins: CheckInData[] = respondedClientsList.map(c => ({
        client_name: (c.clients as any)?.full_name || "Unknown",
        weight: c.weight_kg ? `${c.weight_kg}kg` : null,
        sessions: c.sessions_completed,
        energy_score: c.energy_score,
        notes: c.notes
      }));

      // Calculate aggregate metrics
      const avgEnergy = respondedClientsList.length > 0 
        ? respondedClientsList.reduce((acc, curr) => acc + (curr.energy_score || 0), 0) / respondedClientsList.length
        : 0;

      // 4. Connect to OpenRouter AI (Qwen)
      const summaryPayload: SummaryInput = {
        coach_name: coach.full_name,
        week_ending: weekEnd.toISOString().split('T')[0],
        total_active_clients: activeClients.length,
        responded_clients: formattedCheckins,
        non_responder_names: nonResponders,
      };

      console.log(`Generating AI Summary for Coach: ${coach.full_name}`);
      const aiSummaryText = await generateWeeklySummary(summaryPayload);

      // 5. Store the generated AI summary back into Supabase
      const { error: insertErr } = await supabase
        .from('ai_summaries')
        .insert({
          coach_id: coach.id,
          week_start_date: weekStart.toISOString().split('T')[0],
          week_end_date: weekEnd.toISOString().split('T')[0],
          summary_text: aiSummaryText,
          total_clients: activeClients.length,
          responded_count: respondedClientsList.length,
          avg_energy_score: Number(avgEnergy.toFixed(1)),
        });

      if (insertErr) {
        console.error(`Failed to save AI summary for ${coach.id}:`, insertErr);
        results.push({ coach: coach.id, status: 'db_insert_error' });
      } else {
        results.push({ coach: coach.id, status: 'success' });
      }
    }

    return NextResponse.json({ success: true, processed: results });
    
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
