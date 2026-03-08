/**
 * Direct Supabase Schema Check
 * Uses the REST API to check what tables exist
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

async function checkSchema() {
  log(colors.cyan, '=== CHECKING SUPABASE SCHEMA ===\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log(colors.red, '❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  log(colors.blue, `Connecting to: ${supabaseUrl}\n`);

  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  };

  // Try to query coaches table to test connection
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/coaches?limit=1`, { headers });
    
    if (response.ok) {
      log(colors.green, '✅ Connection successful!');
      const data = await response.json();
      log(colors.blue, `   Coaches table: ${Array.isArray(data) ? 'exists' : 'error'}\n`);
    } else {
      const error = await response.text();
      log(colors.red, `❌ Connection failed: ${response.status} ${error}`);
      process.exit(1);
    }
  } catch (err) {
    log(colors.red, `❌ Error: ${err.message}`);
    process.exit(1);
  }

  // Check each expected table
  const expectedTables = [
    'coaches',
    'programs',
    'clients',
    'enrollments',
    'checkins',
    'ai_summaries',
    'payments',
    'whatsapp_log'
  ];

  log(colors.cyan, 'CHECKING TABLES:\n');
  
  let allTablesExist = true;
  
  for (const table of expectedTables) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?limit=0`, { headers });
      
      if (response.ok) {
        log(colors.green, `   ✅ ${table}`);
      } else if (response.status === 404) {
        log(colors.red, `   ❌ ${table} - NOT FOUND`);
        allTablesExist = false;
      } else {
        log(colors.yellow, `   ⚠️  ${table} - Error ${response.status}`);
        allTablesExist = false;
      }
    } catch (err) {
      log(colors.red, `   ❌ ${table} - ${err.message}`);
      allTablesExist = false;
    }
  }

  log(colors.cyan, '\n=== SUMMARY ===\n');
  
  if (allTablesExist) {
    log(colors.green, '✅ All 8 tables exist!');
    log(colors.blue, '\nNext: Run verify-schema.sql in Supabase Dashboard to check RLS, functions, views, indexes');
  } else {
    log(colors.yellow, '⚠️  Some tables are missing');
    log(colors.blue, '\nAction required:');
    log(colors.cyan, '1. Go to https://supabase.com/dashboard');
    log(colors.cyan, '2. Open your project SQL Editor');
    log(colors.cyan, '3. Run migration files in order:');
    log(colors.cyan, '   - supabase/migrations/20260307000001_initial_schema.sql');
    log(colors.cyan, '   - supabase/migrations/20260307000002_razorpay_migration.sql');
    log(colors.cyan, '   - supabase/migrations/20260307000003_phase1_completion.sql');
  }

  console.log('');
}

checkSchema().catch(err => {
  log(colors.red, `\n❌ Script error: ${err.message}`);
  process.exit(1);
});
