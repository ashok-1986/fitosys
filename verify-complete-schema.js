/**
 * Complete Supabase Schema Verification
 * Checks: Tables, RLS, Functions, Views, Indexes, Constraints
 * Run: node verify-complete-schema.js
 */

require('dotenv').config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function runSqlQuery(sql) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/run_sql`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ query: sql })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  const result = await response.json();
  return result;
}

async function verifySchema() {
  log(colors.cyan, '\n╔══════════════════════════════════════════════════════════════╗');
  log(colors.cyan, '║          FITOSYS SCHEMA VERIFICATION REPORT                  ║');
  log(colors.cyan, '╚══════════════════════════════════════════════════════════════╝\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  log(colors.blue, `Connecting to: ${supabaseUrl}\n`);

  const results = {
    tables: { expected: 8, found: 0, items: [], missing: [] },
    rls: { expected: 24, found: 0, items: [] },
    functions: { expected: 4, found: 0, items: [], missing: [] },
    views: { expected: 3, found: 0, items: [], missing: [] },
    indexes: { expected: 18, found: 0, items: [], missing: [] },
    constraints: { expected: 5, found: 0, items: [], missing: [] },
    rlsEnabled: { expected: 8, found: 0, items: [] },
  };

  const expectedTables = [
    'coaches', 'programs', 'clients', 'enrollments',
    'checkins', 'ai_summaries', 'payments', 'whatsapp_log'
  ];

  const expectedFunctions = [
    'update_updated_at_column',
    'generate_unique_slug',
    'calculate_enrollment_week',
    'get_program_active_enrollments'
  ];

  const expectedViews = [
    'active_clients_view',
    'upcoming_renewals_view',
    'weekly_response_rates_view'
  ];

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

  const expectedConstraints = [
    'coaches_checkin_day_valid',
    'coaches_checkin_time_format',
    'checkins_energy_score_range',
    'enrollments_date_range_valid',
    'programs_price_positive'
  ];

  // 1. Verify Tables
  log(colors.bold, '1. VERIFYING TABLES');
  log(colors.cyan, '   Expected: 8 tables\n');

  try {
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    const tablesResponse = await fetch(
      `${supabaseUrl}/rest/v1/information_schema.tables?table_schema=eq.public&table_type=eq.BASE TABLE&select=table_name`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (tablesResponse.ok) {
      const tables = await tablesResponse.json();
      const foundTables = tables.map(t => t.table_name).filter(t => expectedTables.includes(t));
      results.tables.found = foundTables.length;
      results.tables.items = foundTables;
      results.tables.missing = expectedTables.filter(t => !foundTables.includes(t));

      expectedTables.forEach(t => {
        if (foundTables.includes(t)) {
          log(colors.green, `   ✅ ${t}`);
        } else {
          log(colors.red, `   ❌ MISSING: ${t}`);
        }
      });
    } else {
      throw new Error(`HTTP ${tablesResponse.status}`);
    }
  } catch (error) {
    log(colors.red, `   ❌ Error checking tables: ${error.message}`);
    log(colors.yellow, '   Trying alternative method...');
    
    // Fallback: check each table individually
    for (const table of expectedTables) {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/${table}?limit=0`,
          {
            headers: {
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          log(colors.green, `   ✅ ${table}`);
          results.tables.found++;
          results.tables.items.push(table);
        } else if (response.status === 404) {
          log(colors.red, `   ❌ MISSING: ${table}`);
          results.tables.missing.push(table);
        } else {
          log(colors.yellow, `   ⚠️  ${table} (Error ${response.status})`);
        }
      } catch (err) {
        log(colors.red, `   ❌ ${table} - ${err.message}`);
      }
    }
  }

  // 2. Verify RLS Enabled
  log(colors.bold, '\n2. VERIFYING RLS ENABLED');

  try {
    const rlsResponse = await fetch(
      `${supabaseUrl}/rest/v1/pg_tables?schemaname=eq.public&tablename=in.${expectedTables.join(',')}&select=tablename,rowsecurity`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (rlsResponse.ok) {
      const rlsTables = await rlsResponse.json();
      rlsTables.forEach(t => {
        if (t.rowsecurity) {
          log(colors.green, `   ✅ ${t.tablename} - RLS enabled`);
          results.rlsEnabled.found++;
        } else {
          log(colors.red, `   ❌ ${t.tablename} - RLS NOT enabled`);
        }
      });
      results.rlsEnabled.items = rlsTables;
    }
  } catch (error) {
    log(colors.yellow, `   ⚠️  Could not verify RLS: ${error.message}`);
  }

  // 3. Verify RLS Policies
  log(colors.bold, '\n3. VERIFYING RLS POLICIES');
  log(colors.cyan, '   Expected: 24+ policies\n');

  try {
    const policiesResponse = await fetch(
      `${supabaseUrl}/rest/v1/pg_policies?schemaname=eq.public&select=tablename,policyname,cmd`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (policiesResponse.ok) {
      const policies = await policiesResponse.json();
      results.rls.found = policies.length;
      log(colors.green, `   ✅ Found ${policies.length} RLS policies`);

      // Group by table
      const byTable = {};
      policies.forEach(p => {
        if (!byTable[p.tablename]) byTable[p.tablename] = [];
        byTable[p.tablename].push(p.cmd);
      });

      Object.entries(byTable).forEach(([table, cmds]) => {
        const uniqueCmds = [...new Set(cmds)];
        log(colors.blue, `   ${table}: ${cmds.length} policies (${uniqueCmds.join(', ')})`);
      });

      if (policies.length < 24) {
        log(colors.yellow, `   ⚠️  Expected 24+ policies, found ${policies.length}`);
      }
    }
  } catch (error) {
    log(colors.red, `   ❌ Error: ${error.message}`);
  }

  // 4. Verify Functions
  log(colors.bold, '\n4. VERIFYING FUNCTIONS');
  log(colors.cyan, '   Expected: 4 functions\n');

  try {
    const functionsResponse = await fetch(
      `${supabaseUrl}/rest/v1/information_schema.routines?routine_schema=eq.public&routine_type=eq.FUNCTION&select=routine_name`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (functionsResponse.ok) {
      const functions = await functionsResponse.json();
      const foundFunctions = functions.map(f => f.routine_name).filter(f => expectedFunctions.includes(f));
      results.functions.found = foundFunctions.length;
      results.functions.items = foundFunctions;
      results.functions.missing = expectedFunctions.filter(f => !foundFunctions.includes(f));

      expectedFunctions.forEach(fn => {
        if (foundFunctions.includes(fn)) {
          log(colors.green, `   ✅ ${fn}`);
        } else {
          log(colors.red, `   ❌ MISSING: ${fn}`);
        }
      });
    }
  } catch (error) {
    log(colors.red, `   ❌ Error: ${error.message}`);
  }

  // 5. Verify Views
  log(colors.bold, '\n5. VERIFYING VIEWS');
  log(colors.cyan, '   Expected: 3 views\n');

  try {
    const viewsResponse = await fetch(
      `${supabaseUrl}/rest/v1/information_schema.views?table_schema=eq.public&select=table_name`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (viewsResponse.ok) {
      const views = await viewsResponse.json();
      const foundViews = views.map(v => v.table_name).filter(v => expectedViews.includes(v));
      results.views.found = foundViews.length;
      results.views.items = foundViews;
      results.views.missing = expectedViews.filter(v => !foundViews.includes(v));

      expectedViews.forEach(view => {
        if (foundViews.includes(view)) {
          log(colors.green, `   ✅ ${view}`);
        } else {
          log(colors.red, `   ❌ MISSING: ${view}`);
        }
      });
    }
  } catch (error) {
    log(colors.red, `   ❌ Error: ${error.message}`);
  }

  // 6. Verify Indexes
  log(colors.bold, '\n6. VERIFYING INDEXES');
  log(colors.cyan, '   Expected: 18+ indexes\n');

  try {
    const indexesResponse = await fetch(
      `${supabaseUrl}/rest/v1/pg_indexes?schemaname=eq.public&select=indexname,tablename`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (indexesResponse.ok) {
      const indexes = await indexesResponse.json();
      const foundIndexes = indexes.map(i => i.indexname).filter(i => expectedIndexes.includes(i));
      results.indexes.found = foundIndexes.length;
      results.indexes.items = foundIndexes;
      results.indexes.missing = expectedIndexes.filter(i => !foundIndexes.includes(i));

      log(colors.green, `   ✅ Found ${foundIndexes.length}/${expectedIndexes.length} expected indexes`);

      expectedIndexes.forEach(idx => {
        if (foundIndexes.includes(idx)) {
          log(colors.green, `   ✅ ${idx}`);
        } else {
          log(colors.yellow, `   ⚠️  MISSING: ${idx}`);
        }
      });
    }
  } catch (error) {
    log(colors.red, `   ❌ Error: ${error.message}`);
  }

  // 7. Verify Constraints
  log(colors.bold, '\n7. VERIFYING CHECK CONSTRAINTS');
  log(colors.cyan, '   Expected: 5 constraints\n');

  try {
    // Use a custom RPC or direct query
    const constraintsResponse = await fetch(
      `${supabaseUrl}/rest/v1/pg_constraint?contype=eq.c&connamespace=eq.${encodeURIComponent('public::regnamespace')}&select=conname,conrelid`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (constraintsResponse.ok) {
      const constraints = await constraintsResponse.json();
      const foundConstraints = constraints
        .map(c => c.conname)
        .filter(c => expectedConstraints.some(e => c.includes(e)));
      
      results.constraints.found = foundConstraints.length;
      
      expectedConstraints.forEach(constraint => {
        if (foundConstraints.some(c => c.includes(constraint))) {
          log(colors.green, `   ✅ ${constraint}`);
        } else {
          log(colors.yellow, `   ⚠️  NOT FOUND: ${constraint}`);
        }
      });
    } else {
      throw new Error(`HTTP ${constraintsResponse.status}`);
    }
  } catch (error) {
    log(colors.yellow, `   ⚠️  Could not verify constraints: ${error.message}`);
    log(colors.yellow, '   This is OK - constraints may exist with different names');
  }

  // Summary
  log(colors.bold, '\n╔══════════════════════════════════════════════════════════════╗');
  log(colors.bold, '║                    VERIFICATION SUMMARY                      ║');
  log(colors.bold, '╚══════════════════════════════════════════════════════════════╝\n');

  const summary = [
    { name: 'Tables', ...results.tables },
    { name: 'RLS Enabled', found: results.rlsEnabled.found, expected: results.rlsEnabled.expected },
    { name: 'RLS Policies', ...results.rls },
    { name: 'Functions', ...results.functions },
    { name: 'Views', ...results.views },
    { name: 'Indexes', ...results.indexes },
    { name: 'Constraints', ...results.constraints },
  ];

  let allPassed = true;
  let totalIssues = 0;

  summary.forEach(item => {
    const passed = item.found >= item.expected;
    const status = passed ? '✅' : '⚠️ ';
    if (!passed) {
      allPassed = false;
      totalIssues += (item.expected - item.found);
    }
    log(colors.cyan, `${status} ${item.name}: ${item.found}/${item.expected}`);
  });

  log(colors.cyan, '\n=== FINAL STATUS ===\n');

  if (allPassed) {
    log(colors.green, '╔══════════════════════════════════════════════════════════════╗');
    log(colors.green, '║           ✅ DATABASE FULLY SYNCED!                         ║');
    log(colors.green, '╚══════════════════════════════════════════════════════════════╝');
    log(colors.blue, '\n🎉 All schema components are in place!');
    log(colors.blue, '\nNext Steps:');
    log(colors.cyan, '  1. Begin Phase 2: Authentication & Onboarding');
    log(colors.cyan, '  2. Implement signup/login UI');
    log(colors.cyan, '  3. Build coach dashboard with live data');
  } else {
    log(colors.yellow, '╔══════════════════════════════════════════════════════════════╗');
    log(colors.yellow, '║        ⚠️  DATABASE NEEDS SYNC - ${totalIssues} issues found        ║');
    log(colors.yellow, '╚══════════════════════════════════════════════════════════════╝');
    log(colors.blue, '\nMissing components:');
    
    if (results.tables.missing.length > 0) {
      log(colors.red, `  Tables: ${results.tables.missing.join(', ')}`);
    }
    if (results.functions.missing.length > 0) {
      log(colors.red, `  Functions: ${results.functions.missing.join(', ')}`);
    }
    if (results.views.missing.length > 0) {
      log(colors.red, `  Views: ${results.views.missing.join(', ')}`);
    }
    if (results.indexes.missing.length > 0) {
      log(colors.yellow, `  Indexes: ${results.indexes.missing.join(', ')}`);
    }

    log(colors.blue, '\n📋 Action Required:');
    log(colors.cyan, '  1. Go to Supabase Dashboard → SQL Editor');
    log(colors.cyan, '  2. Run migration files in order:');
    log(colors.cyan, '     - 20260307000001_initial_schema.sql');
    log(colors.cyan, '     - 20260307000002_razorpay_migration.sql');
    log(colors.cyan, '     - 20260307000003_phase1_completion.sql');
    log(colors.cyan, '  3. Re-run this verification script');
  }

  console.log('');
}

verifySchema().catch(err => {
  log(colors.red, `\n❌ Script error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
