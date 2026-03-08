// verify-supabase-schema.ts - Run with: npx tsx verify-supabase-schema.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cwupeqgkahysocgzzjyp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dXBlcWdrYWh5c29jZ3p6anlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAwNDg1NiwiZXhwIjoyMDg3NTgwODU2fQ.ISXF0J_d7n2Gbpa4Lw8sh-T0XLuncxexIP3EgNh72yE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const EXPECTED_TABLES = [
  'coaches', 'programs', 'clients', 'enrollments', 
  'checkins', 'ai_summaries', 'payments', 'whatsapp_log'
];

async function verifySchema() {
  console.log('🔍 Verifying Supabase Schema...\n');
  
  let hasErrors = false;

  // 1. Check tables exist
  console.log('📋 Checking tables...');
  for (const table of EXPECTED_TABLES) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.log(`  ❌ ${table}: ${error.message}`);
        hasErrors = true;
      } else {
        console.log(`  ✅ ${table}`);
      }
    } catch (e: any) {
      console.log(`  ❌ ${table}: ${e.message}`);
      hasErrors = true;
    }
  }

  // 2. Test join query from API
  console.log('\n📋 Testing join query...');
  const { data: testJoin, error: joinError } = await supabase
    .from('enrollments')
    .select('*, programs(name), coaches(full_name)')
    .limit(1);

  if (joinError) {
    console.log(`  ❌ Join failed: ${joinError.message}`);
    hasErrors = true;
  } else {
    console.log(`  ✅ Join works: ${JSON.stringify(testJoin)}`);
  }

  // 3. Check coach data
  console.log('\n📋 Checking coach data...');
  const { data: coaches, error: coachError } = await supabase
    .from('coaches')
    .select('id, email, full_name, slug, plan')
    .limit(3);

  if (coachError) {
    console.log(`  ❌ ${coachError.message}`);
    hasErrors = true;
  } else {
    console.log(`  ✅ Found ${coaches?.length || 0} coaches`);
    console.log(`     ${JSON.stringify(coaches, null, 2)}`);
  }

  // 4. Check programs
  console.log('\n📋 Checking programs...');
  const { data: programs, error: progError } = await supabase
    .from('programs')
    .select('id, name, price, duration_weeks')
    .limit(5);

  if (progError) {
    console.log(`  ❌ ${progError.message}`);
  } else {
    console.log(`  ✅ Found ${programs?.length || 0} programs`);
  }

  // 5. Check enrollments structure
  console.log('\n📋 Checking enrollments structure...');
  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select('id, coach_id, client_id, program_id, status, gateway_payment_id, payment_gateway')
    .limit(3);

  if (enrollError) {
    console.log(`  ❌ ${enrollError.message}`);
  } else {
    console.log(`  ✅ Found ${enrollments?.length || 0} enrollments`);
    if (enrollments && enrollments.length > 0) {
      console.log(`     Sample: ${JSON.stringify(enrollments[0])}`);
    }
  }

  // 6. Check checkins
  console.log('\n📋 Checking checkins...');
  const { data: checkins, error: checkinError } = await supabase
    .from('checkins')
    .select('id, week_number, energy_score')
    .limit(3);

  if (checkinError) {
    console.log(`  ❌ ${checkinError.message}`);
  } else {
    console.log(`  ✅ Found ${checkins?.length || 0} checkins`);
  }

  // 7. Check payments
  console.log('\n📋 Checking payments...');
  const { data: payments, error: payError } = await supabase
    .from('payments')
    .select('id, amount, payment_type, gateway_payment_id, payment_gateway')
    .limit(3);

  if (payError) {
    console.log(`  ❌ ${payError.message}`);
  } else {
    console.log(`  ✅ Found ${payments?.length || 0} payments`);
    if (payments && payments.length > 0) {
      console.log(`     Sample: ${JSON.stringify(payments[0])}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('❌ Schema verification found issues!');
    process.exit(1);
  } else {
    console.log('✅ Schema verification complete!');
  }
}

verifySchema().catch(console.error);
