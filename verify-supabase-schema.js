/**
 * Supabase Schema Verification Script (Simple Version)
 * 
 * Uses direct REST API calls to query system tables
 * Run: node verify-supabase-schema.js
 */

require('dotenv').config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function verifySchema() {
  log(colors.cyan, '=== FITOSYS SUPABASE SCHEMA VERIFICATION ===\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log(colors.red, '❌ ERROR: Missing Supabase environment variables');
    log(colors.yellow, 'Please check your .env.local file');
    process.exit(1);
  }

  log(colors.blue, `Connecting to: ${supabaseUrl}`);

  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'params=singleobject'
  };

  const results = {
    tables: { expected: 8, found: 0, missing: [] },
    rls: { expected: 24, found: 0 },
    functions: { expected: 4, found: 0, missing: [] },
    views: { expected: 3, found: 0, missing: [] },
    indexes: { expected: 24, found: 0, missing: [] },
    constraints: { expected: 6, found: 0, missing: [] },
  };

  // 1. Verify Tables
  log(colors.cyan, '1. VERIFYING TABLES...');
  
  try {
    const tablesResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/get_schema_info`,
      { 
        method: 'POST',
        headers,
        body: JSON.stringify({ query_type: 'tables' })
      }
    );

    if (!tablesResponse.ok) {
      throw new Error(`HTTP ${tablesResponse.status}`);
    }

    const tables = await tablesResponse.json();
    const expectedTables = ['coaches', 'programs', 'clients', 'enrollments', 
                            'checkins', 'ai_summaries', 'payments', 'whatsapp_log'];
    
    results.tables.found = tables.filter(t => expectedTables.includes(t.table_name)).length;
    
    expectedTables.forEach(t => {
      if (tables.some(tbl => tbl.table_name === t)) {
        log(colors.green, `   ✅ ${t}`);
      } else {
        log(colors.red, `   ❌ MISSING: ${t}`);
        results.tables.missing.push(t);
      }
    });
  } catch (error) {
    log(colors.red, `   ❌ Error fetching tables: ${error.message}`);
    log(colors.yellow, '   Creating custom RPC function needed...');
  }

  // 2. Verify RLS Policies
  log(colors.cyan, '\n2. VERIFYING RLS POLICIES...');
  
  try {
    const policiesResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/get_schema_info`,
      { 
        method: 'POST',
        headers,
        body: JSON.stringify({ query_type: 'policies' })
      }
    );

    if (!policiesResponse.ok) {
      throw new Error(`HTTP ${policiesResponse.status}`);
    }

    const policies = await policiesResponse.json();
    results.rls.found = policies.length;
    log(colors.green, `   ✅ Found ${policies.length} RLS policies`);
  } catch (error) {
    log(colors.red, `   ❌ Error: ${error.message}`);
  }

  // 3. Verify Functions
  log(colors.cyan, '\n3. VERIFYING FUNCTIONS...');
  
  try {
    const functionsResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/get_schema_info`,
      { 
        method: 'POST',
        headers,
        body: JSON.stringify({ query_type: 'functions' })
      }
    );

    if (!functionsResponse.ok) {
      throw new Error(`HTTP ${functionsResponse.status}`);
    }

    const functions = await functionsResponse.json();
    const expectedFunctions = [
      'update_updated_at_column',
      'generate_unique_slug',
      'calculate_enrollment_week',
      'get_program_active_enrollments'
    ];
    
    results.functions.found = functions.filter(f => expectedFunctions.includes(f.routine_name)).length;
    
    expectedFunctions.forEach(fn => {
      if (functions.some(f => f.routine_name === fn)) {
        log(colors.green, `   ✅ ${fn}`);
      } else {
        log(colors.red, `   ❌ MISSING: ${fn}`);
        results.functions.missing.push(fn);
      }
    });
  } catch (error) {
    log(colors.red, `   ❌ Error: ${error.message}`);
  }

  // 4. Verify Views
  log(colors.cyan, '\n4. VERIFYING VIEWS...');
  
  try {
    const viewsResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/get_schema_info`,
      { 
        method: 'POST',
        headers,
        body: JSON.stringify({ query_type: 'views' })
      }
    );

    if (!viewsResponse.ok) {
      throw new Error(`HTTP ${viewsResponse.status}`);
    }

    const views = await viewsResponse.json();
    const expectedViews = [
      'active_clients_view',
      'upcoming_renewals_view',
      'weekly_response_rates_view'
    ];
    
    results.views.found = views.filter(v => expectedViews.includes(v.table_name)).length;
    
    expectedViews.forEach(view => {
      if (views.some(v => v.table_name === view)) {
        log(colors.green, `   ✅ ${view}`);
      } else {
        log(colors.red, `   ❌ MISSING: ${view}`);
        results.views.missing.push(view);
      }
    });
  } catch (error) {
    log(colors.red, `   ❌ Error: ${error.message}`);
  }

  // 5. Verify Indexes
  log(colors.cyan, '\n5. VERIFYING INDEXES...');
  
  try {
    const indexesResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/get_schema_info`,
      { 
        method: 'POST',
        headers,
        body: JSON.stringify({ query_type: 'indexes' })
      }
    );

    if (!indexesResponse.ok) {
      throw new Error(`HTTP ${indexesResponse.status}`);
    }

    const indexes = await indexesResponse.json();
    const expectedIndexes = [
      'idx_clients_coach', 'idx_clients_status',
      'idx_enrollments_coach', 'idx_enrollments_end_date',
      'idx_checkins_coach_date',
      'idx_payments_coach', 'idx_payments_paid_at',
      'idx_programs_coach_active', 'idx_enrollments_client_status',
      'idx_enrollments_dates', 'idx_checkins_client_date',
      'idx_checkins_enrollment', 'idx_ai_summaries_coach_generated',
      'idx_payments_enrollment', 'idx_whatsapp_log_client',
      'idx_whatsapp_log_sent_at', 'idx_clients_full_name_trgm',
      'idx_programs_name_trgm'
    ];
    
    results.indexes.found = indexes.filter(i => expectedIndexes.includes(i.indexname)).length;
    
    log(colors.green, `   ✅ Found ${results.indexes.found}/${expectedIndexes.length} expected indexes`);
    
    expectedIndexes.forEach(idx => {
      if (indexes.some(i => i.indexname === idx)) {
        log(colors.green, `   ✅ ${idx}`);
      } else {
        log(colors.yellow, `   ⚠️  MISSING: ${idx}`);
        results.indexes.missing.push(idx);
      }
    });
  } catch (error) {
    log(colors.red, `   ❌ Error: ${error.message}`);
  }

  // Summary
  log(colors.cyan, '\n=== VERIFICATION SUMMARY ===\n');
  
  const summary = [
    { name: 'Tables', ...results.tables },
    { name: 'RLS Policies', ...results.rls },
    { name: 'Functions', ...results.functions },
    { name: 'Views', ...results.views },
    { name: 'Indexes', ...results.indexes },
  ];

  let allPassed = true;

  summary.forEach(item => {
    const status = item.found >= item.expected ? '✅' : '⚠️ ';
    const passed = item.found >= item.expected;
    if (!passed) allPassed = false;
    
    log(colors.cyan, `${status} ${item.name}: ${item.found}/${item.expected}`);
    if (item.missing && item.missing.length > 0) {
      log(colors.yellow, `   Missing: ${item.missing.join(', ')}`);
    }
  });

  log(colors.cyan, '\n=== FINAL STATUS ===\n');
  
  if (allPassed) {
    log(colors.green, '✅ ALL CHECKS PASSED - Database is fully synced!');
  } else {
    log(colors.yellow, '⚠️  SOME CHECKS FAILED - Database needs syncing');
    log(colors.blue, '\n--- SYNC OPTIONS ---');
    log(colors.blue, '\nOption 1: Using Supabase CLI (Recommended)');
    log(colors.cyan, '   npx supabase db push');
    log(colors.blue, '\nOption 2: Manual SQL in Supabase Dashboard');
    log(colors.cyan, '   1. Go to https://supabase.com/dashboard');
    log(colors.cyan, '   2. Open SQL Editor');
    log(colors.cyan, '   3. Run migrations in order:');
    log(colors.cyan, '      - 001_initial_schema.sql');
    log(colors.cyan, '      - 002_razorpay_migration.sql');
    log(colors.cyan, '      - 003_phase1_completion.sql');
  }

  console.log('');
}

verifySchema().catch(err => {
  log(colors.red, `\n❌ Script error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
