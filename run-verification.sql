-- ╔══════════════════════════════════════════════════════════════╗
-- ║          FITOSYS COMPLETE SCHEMA VERIFICATION                ║
-- ╚══════════════════════════════════════════════════════════════╝
-- 
-- INSTRUCTIONS:
-- 1. Copy this ENTIRE file
-- 2. Go to https://supabase.com/dashboard
-- 3. Select project: cwupeqgkahysocgzzjyp
-- 4. Open SQL Editor → New Query
-- 5. Paste and click "Run"
--
-- This will verify: Tables, RLS, Functions, Views, Indexes, Constraints

-- ============================================================================
-- CREATE TEMP RESULTS TABLE
-- ============================================================================

DROP TABLE IF EXISTS _verification_results;
CREATE TEMP TABLE _verification_results (
    category TEXT,
    item_name TEXT,
    status TEXT,
    details TEXT
);

-- ============================================================================
-- 1. TABLES (Expected: 8)
-- ============================================================================

INSERT INTO _verification_results
SELECT 'TABLES', table_name, '✅', 'Base table'
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
AND table_name IN ('coaches','programs','clients','enrollments','checkins','ai_summaries','payments','whatsapp_log');

INSERT INTO _verification_results
SELECT 'TABLES', t.table_name, '❌ MISSING', 'Required table'
FROM (VALUES ('coaches'),('programs'),('clients'),('enrollments'),('checkins'),('ai_summaries'),('payments'),('whatsapp_log')) AS t(table_name)
WHERE NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' AND table_name=t.table_name);

-- ============================================================================
-- 2. RLS ENABLED (Expected: 8 tables)
-- ============================================================================

INSERT INTO _verification_results
SELECT 'RLS_ENABLED', tablename, CASE WHEN rowsecurity THEN '✅' ELSE '❌' END, 'Row Level Security'
FROM pg_tables WHERE schemaname='public' AND tablename IN ('coaches','programs','clients','enrollments','checkins','ai_summaries','payments','whatsapp_log');

-- ============================================================================
-- 3. RLS POLICIES (Expected: 24+)
-- ============================================================================

INSERT INTO _verification_results
SELECT 'RLS_POLICIES', tablename || '.' || policyname, '✅', cmd
FROM pg_policies WHERE schemaname='public';

-- ============================================================================
-- 4. FUNCTIONS (Expected: 4)
-- ============================================================================

INSERT INTO _verification_results
SELECT 'FUNCTIONS', routine_name, '✅', 'Database function'
FROM information_schema.routines
WHERE routine_schema='public' AND routine_type='FUNCTION'
AND routine_name IN ('update_updated_at_column','generate_unique_slug','calculate_enrollment_week','get_program_active_enrollments');

INSERT INTO _verification_results
SELECT 'FUNCTIONS', fn, '❌ MISSING', 'Required function'
FROM (VALUES ('update_updated_at_column'),('generate_unique_slug'),('calculate_enrollment_week'),('get_program_active_enrollments')) AS t(fn)
WHERE NOT EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_schema='public' AND routine_type='FUNCTION' AND routine_name=t.fn);

-- ============================================================================
-- 5. VIEWS (Expected: 3)
-- ============================================================================

INSERT INTO _verification_results
SELECT 'VIEWS', table_name, '✅', 'Database view'
FROM information_schema.views WHERE table_schema='public'
AND table_name IN ('active_clients_view','upcoming_renewals_view','weekly_response_rates_view');

INSERT INTO _verification_results
SELECT 'VIEWS', vw, '❌ MISSING', 'Required view'
FROM (VALUES ('active_clients_view'),('upcoming_renewals_view'),('weekly_response_rates_view')) AS t(vw)
WHERE NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name=t.vw);

-- ============================================================================
-- 6. INDEXES (Expected: 18+)
-- ============================================================================

INSERT INTO _verification_results
SELECT 'INDEXES', indexname, '✅', 'on ' || tablename
FROM pg_indexes WHERE schemaname='public'
AND indexname IN (
  'idx_clients_coach','idx_clients_status','idx_enrollments_coach','idx_enrollments_end_date',
  'idx_checkins_coach_date','idx_payments_coach','idx_payments_paid_at','idx_programs_coach_active',
  'idx_enrollments_client_status','idx_enrollments_dates','idx_checkins_client_date',
  'idx_checkins_enrollment','idx_ai_summaries_coach_generated','idx_payments_enrollment',
  'idx_whatsapp_log_client','idx_whatsapp_log_sent_at','idx_clients_full_name_trgm','idx_programs_name_trgm'
);

INSERT INTO _verification_results
SELECT 'INDEXES', idx, '⚠️ MISSING', 'Performance index'
FROM (VALUES 
  ('idx_clients_coach'),('idx_clients_status'),('idx_enrollments_coach'),('idx_enrollments_end_date',
  'idx_checkins_coach_date'),('idx_payments_coach'),('idx_payments_paid_at'),('idx_programs_coach_active',
  'idx_enrollments_client_status'),('idx_enrollments_dates'),('idx_checkins_client_date',
  'idx_checkins_enrollment'),('idx_ai_summaries_coach_generated'),('idx_payments_enrollment',
  'idx_whatsapp_log_client'),('idx_whatsapp_log_sent_at'),('idx_clients_full_name_trgm'),('idx_programs_name_trgm')
) AS t(idx)
WHERE NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname=t.idx);

-- ============================================================================
-- 7. CONSTRAINTS (Expected: 5+)
-- ============================================================================

INSERT INTO _verification_results
SELECT 'CONSTRAINTS', conname, '✅', pg_get_constraintdef(oid)
FROM pg_constraint WHERE contype='c' AND connamespace='public'::regnamespace
AND conname IN ('coaches_checkin_day_valid','coaches_checkin_time_format','checkins_energy_score_range','enrollments_date_range_valid','programs_price_positive');

INSERT INTO _verification_results
SELECT 'CONSTRAINTS', c, '⚠️ MISSING', 'Validation constraint'
FROM (VALUES ('coaches_checkin_day_valid'),('coaches_checkin_time_format'),('checkins_energy_score_range'),('enrollments_date_range_valid'),('programs_price_positive')) AS t(c)
WHERE NOT EXISTS (SELECT 1 FROM pg_constraint WHERE contype='c' AND connamespace='public'::regnamespace AND conname LIKE '%'||c||'%');

-- ============================================================================
-- FINAL REPORT
-- ============================================================================

SELECT '
╔══════════════════════════════════════════════════════════════╗
║           FITOSYS SCHEMA VERIFICATION REPORT                 ║
╚══════════════════════════════════════════════════════════════╝
' as report;

-- Summary by category
SELECT 
    category,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = '✅') as passed,
    COUNT(*) FILTER (WHERE status != '✅') as issues,
    CASE WHEN COUNT(*) FILTER (WHERE status != '✅') = 0 THEN '✅ PASS' ELSE '⚠️ FAIL' END as status
FROM _verification_results
WHERE category NOT LIKE '%SUMMARY%'
GROUP BY category
ORDER BY category;

-- Overall status
SELECT '
=== OVERALL STATUS ===
' as section;

WITH stats AS (
  SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = '✅') as passed,
    COUNT(*) FILTER (WHERE status != '✅') as issues
  FROM _verification_results
)
SELECT 
  total, passed, issues,
  ROUND(passed::numeric/NULLIF(total,0)*100,1) as pass_rate,
  CASE WHEN issues = 0 THEN '✅ DATABASE FULLY SYNCED' 
       WHEN issues < 10 THEN '⚠️ MINOR ISSUES' 
       ELSE '❌ MAJOR SYNC REQUIRED' END as final_status
FROM stats;

-- Show all issues
SELECT '
=== ISSUES FOUND ===
' as section;

SELECT category, item_name, status, details
FROM _verification_results
WHERE status != '✅'
ORDER BY category, item_name;

-- Cleanup
DROP TABLE IF EXISTS _verification_results;

-- ============================================================================
-- RECOMMENDATIONS
-- ============================================================================

SELECT '
=== NEXT STEPS ===

✅ If all checks passed (100% pass rate):
   Database is fully synced! Ready for Phase 2 development.

⚠️ If you see issues:
   1. Copy migration file contents
   2. Paste in SQL Editor
   3. Run in order:
      - 20260307000001_initial_schema.sql
      - 20260307000002_razorpay_migration.sql  
      - 20260307000003_phase1_completion.sql
   4. Re-run this verification
' as recommendations;
