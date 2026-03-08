/**
 * Direct Schema Verification via Supabase Client
 * Runs verification queries using the Supabase JS client
 */

const { createClient } = require('@supabase/supabase-js');
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

async function verifySchema() {
  log(colors.cyan, '\n╔══════════════════════════════════════════════════════════════╗');
  log(colors.cyan, '║           FITOSYS SCHEMA VERIFICATION REPORT                 ║');
  log(colors.cyan, '╚══════════════════════════════════════════════════════════════╝\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log(colors.red, '❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  log(colors.blue, `Connecting to: ${supabaseUrl}\n`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  const results = {
    tables: { expected: 8, found: 0, items: [], missing: [] },
    rlsEnabled: { expected: 8, found: 0 },
    rls: { expected: 24, found: 0 },
    functions: { expected: 4, found: 0, missing: [] },
    views: { expected: 3, found: 0, missing: [] },
    indexes: { expected: 18, found: 0, missing: [] },
    constraints: { expected: 5, found: 0, missing: [] },
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

  for (const table of expectedTables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (!error) {
        log(colors.green, `   ✅ ${table}`);
        results.tables.found++;
        results.tables.items.push(table);
      } else if (error.code === '42P01') {
        log(colors.red, `   ❌ MISSING: ${table}`);
        results.tables.missing.push(table);
      } else {
        log(colors.yellow, `   ⚠️  ${table} (${error.code})`);
      }
    } catch (err) {
      log(colors.red, `   ❌ ${table} - ${err.message}`);
    }
  }

  // 2. Verify RLS Enabled (check pg_tables via RPC)
  log(colors.bold, '\n2. VERIFYING RLS ENABLED');
  
  try {
    // Try to query pg_tables through a custom RPC or direct query
    const { data: rlsData, error: rlsError } = await supabase
      .from('pg_tables')
      .select('tablename, rowsecurity')
      .eq('schemaname', 'public')
      .in('tablename', expectedTables);

    if (rlsError) {
      log(colors.yellow, `   ⚠️  Cannot verify RLS: ${rlsError.message}`);
    } else if (rlsData) {
      rlsData.forEach(t => {
        if (t.rowsecurity) {
          log(colors.green, `   ✅ ${t.tablename} - RLS enabled`);
          results.rlsEnabled.found++;
        } else {
          log(colors.red, `   ❌ ${t.tablename} - RLS NOT enabled`);
        }
      });
    }
  } catch (err) {
    log(colors.yellow, `   ⚠️  Cannot verify RLS status via API`);
  }

  // 3. Verify RLS Policies
  log(colors.bold, '\n3. VERIFYING RLS POLICIES');
  log(colors.cyan, '   Expected: 24+ policies\n');

  try {
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, cmd')
      .eq('schemaname', 'public');

    if (policiesError) {
      log(colors.yellow, `   ⚠️  Cannot query policies: ${policiesError.message}`);
    } else if (policies) {
      results.rls.found = policies.length;
      log(colors.green, `   ✅ Found ${policies.length} RLS policies`);

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
  } catch (err) {
    log(colors.yellow, `   ⚠️  Cannot verify RLS policies via API`);
  }

  // 4. Verify Functions
  log(colors.bold, '\n4. VERIFYING FUNCTIONS');
  log(colors.cyan, '   Expected: 4 functions\n');

  try {
    const { data: functions, error: functionsError } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_schema', 'public')
      .eq('routine_type', 'FUNCTION');

    if (functionsError) {
      log(colors.yellow, `   ⚠️  Cannot query functions: ${functionsError.message}`);
    } else if (functions) {
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
  } catch (err) {
    log(colors.yellow, `   ⚠️  Cannot verify functions via API`);
  }

  // 5. Verify Views
  log(colors.bold, '\n5. VERIFYING VIEWS');
  log(colors.cyan, '   Expected: 3 views\n');

  try {
    const { data: views, error: viewsError } = await supabase
      .from('information_schema.views')
      .select('table_name')
      .eq('table_schema', 'public');

    if (viewsError) {
      log(colors.yellow, `   ⚠️  Cannot query views: ${viewsError.message}`);
    } else if (views) {
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
  } catch (err) {
    log(colors.yellow, `   ⚠️  Cannot verify views via API`);
  }

  // 6. Verify Indexes
  log(colors.bold, '\n6. VERIFYING INDEXES');
  log(colors.cyan, '   Expected: 18+ indexes\n');

  try {
    const { data: indexes, error: indexesError } = await supabase
      .from('pg_indexes')
      .select('indexname, tablename')
      .eq('schemaname', 'public');

    if (indexesError) {
      log(colors.yellow, `   ⚠️  Cannot query indexes: ${indexesError.message}`);
    } else if (indexes) {
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
  } catch (err) {
    log(colors.yellow, `   ⚠️  Cannot verify indexes via API`);
  }

  // 7. Verify Constraints
  log(colors.bold, '\n7. VERIFYING CHECK CONSTRAINTS');
  log(colors.cyan, '   Expected: 5 constraints\n');

  try {
    const { data: constraints, error: constraintsError } = await supabase
      .from('pg_constraint')
      .select('conname, conrelid')
      .eq('contype', 'c')
      .eq('connamespace', 'public::regnamespace');

    if (constraintsError) {
      log(colors.yellow, `   ⚠️  Cannot query constraints: ${constraintsError.message}`);
    } else if (constraints) {
      const foundConstraints = constraints
        .map(c => c.conname)
        .filter(c => expectedConstraints.some(e => c && c.includes(e)));
      
      results.constraints.found = foundConstraints.length;
      
      expectedConstraints.forEach(constraint => {
        if (foundConstraints.some(c => c && c.includes(constraint))) {
          log(colors.green, `   ✅ ${constraint}`);
        } else {
          log(colors.yellow, `   ⚠️  NOT FOUND: ${constraint}`);
        }
      });
    }
  } catch (err) {
    log(colors.yellow, `   ⚠️  Cannot verify constraints via API`);
  }

  // Summary
  log(colors.bold, '\n╔══════════════════════════════════════════════════════════════╗');
  log(colors.bold, '║                    VERIFICATION SUMMARY                      ║');
  log(colors.bold, '╚══════════════════════════════════════════════════════════════╝\n');

  const summary = [
    { name: 'Tables', ...results.tables },
    { name: 'RLS Enabled', found: results.rlsEnabled.found, expected: results.rlsEnabled.expected },
    { name: 'RLS Policies', found: results.rls.found, expected: results.rls.expected },
    { name: 'Functions', ...results.functions },
    { name: 'Views', ...results.views },
    { name: 'Indexes', ...results.indexes },
    { name: 'Constraints', ...results.constraints },
  ];

  let totalChecks = 0;
  let totalPassed = 0;
  let totalIssues = 0;

  summary.forEach(item => {
    const passed = item.found >= item.expected;
    const status = passed ? '✅' : '⚠️ ';
    const issues = Math.max(0, item.expected - item.found);
    
    if (item.expected > 0) {
      totalChecks += item.expected;
      totalPassed += Math.min(item.found, item.expected);
      totalIssues += issues;
    }
    
    log(colors.cyan, `${status} ${item.name}: ${item.found}/${item.expected}`);
  });

  const passRate = totalChecks > 0 ? ((totalPassed / totalChecks) * 100).toFixed(1) : 0;

  log(colors.cyan, '\n=== FINAL STATUS ===\n');

  if (totalIssues === 0) {
    log(colors.green, '╔══════════════════════════════════════════════════════════════╗');
    log(colors.green, '║           ✅ DATABASE FULLY SYNCED!                         ║');
    log(colors.green, '╚══════════════════════════════════════════════════════════════╝');
    log(colors.blue, `\n🎉 Pass Rate: ${passRate}%`);
    log(colors.blue, '\nNext Steps:');
    log(colors.cyan, '  1. Begin Phase 2: Authentication & Onboarding');
    log(colors.cyan, '  2. Implement signup/login UI');
    log(colors.cyan, '  3. Build coach dashboard with live data');
  } else {
    log(colors.yellow, '╔══════════════════════════════════════════════════════════════╗');
    log(colors.yellow, `║        ⚠️  DATABASE NEEDS SYNC - ${totalIssues.toString().padEnd(2)} issues found          ║`);
    log(colors.yellow, '╚══════════════════════════════════════════════════════════════╝');
    log(colors.blue, `\n📊 Pass Rate: ${passRate}%`);
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
  }

  console.log('');
}

verifySchema().catch(err => {
  log(colors.red, `\n❌ Script error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
