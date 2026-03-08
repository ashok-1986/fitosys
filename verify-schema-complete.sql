-- Fitosys Complete Schema Verification
-- Run this in Supabase Dashboard SQL Editor
-- This will give you a complete report of what's synced and what's missing

-- ============================================================================
-- SETUP: Create temporary results table
-- ============================================================================

DROP TABLE IF EXISTS _verification_results;
CREATE TEMP TABLE _verification_results (
    category TEXT,
    item_name TEXT,
    status TEXT,
    details TEXT
);

-- ============================================================================
-- 1. VERIFY TABLES
-- ============================================================================

INSERT INTO _verification_results
SELECT 
    'TABLES' as category,
    table_name as item_name,
    '✅ EXISTS' as status,
    'Expected table' as details
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN (
      'coaches', 'programs', 'clients', 'enrollments', 
      'checkins', 'ai_summaries', 'payments', 'whatsapp_log'
  );

-- Check for missing tables
INSERT INTO _verification_results
SELECT 
    'TABLES' as category,
    expected_table as item_name,
    '❌ MISSING' as status,
    'Required table not found' as details
FROM (VALUES 
    ('coaches'), ('programs'), ('clients'), ('enrollments'),
    ('checkins'), ('ai_summaries'), ('payments'), ('whatsapp_log')
) AS t(expected_table)
WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name = expected_table
);

-- ============================================================================
-- 2. VERIFY RLS POLICIES
-- ============================================================================

INSERT INTO _verification_results
SELECT 
    'RLS_POLICIES' as category,
    tablename || '.' || policyname as item_name,
    '✅ EXISTS' as status,
    cmd as details
FROM pg_policies
WHERE schemaname = 'public';

-- Count RLS policies per table
INSERT INTO _verification_results
SELECT 
    'RLS_SUMMARY' as category,
    tablename as item_name,
    CASE WHEN COUNT(*) >= 4 THEN '✅ COMPLETE' ELSE '⚠️ INCOMPLETE' END as status,
    COUNT(*) || ' policies' as details
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename;

-- ============================================================================
-- 3. VERIFY FUNCTIONS
-- ============================================================================

INSERT INTO _verification_results
SELECT 
    'FUNCTIONS' as category,
    routine_name as item_name,
    '✅ EXISTS' as status,
    'Database function' as details
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
  AND routine_name IN (
      'update_updated_at_column',
      'generate_unique_slug',
      'calculate_enrollment_week',
      'get_program_active_enrollments'
  );

-- Check for missing functions
INSERT INTO _verification_results
SELECT 
    'FUNCTIONS' as category,
    expected_func as item_name,
    '❌ MISSING' as status,
    'Required function not found' as details
FROM (VALUES 
    ('update_updated_at_column'),
    ('generate_unique_slug'),
    ('calculate_enrollment_week'),
    ('get_program_active_enrollments')
) AS t(expected_func)
WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_schema = 'public' 
      AND routine_type = 'FUNCTION'
      AND routine_name = expected_func
);

-- ============================================================================
-- 4. VERIFY VIEWS
-- ============================================================================

INSERT INTO _verification_results
SELECT 
    'VIEWS' as category,
    table_name as item_name,
    '✅ EXISTS' as status,
    'Database view' as details
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN (
      'active_clients_view',
      'upcoming_renewals_view',
      'weekly_response_rates_view'
  );

-- Check for missing views
INSERT INTO _verification_results
SELECT 
    'VIEWS' as category,
    expected_view as item_name,
    '❌ MISSING' as status,
    'Required view not found' as details
FROM (VALUES 
    ('active_clients_view'),
    ('upcoming_renewals_view'),
    ('weekly_response_rates_view')
) AS t(expected_view)
WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.views
    WHERE table_schema = 'public' 
      AND table_name = expected_view
);

-- ============================================================================
-- 5. VERIFY INDEXES
-- ============================================================================

INSERT INTO _verification_results
SELECT 
    'INDEXES' as category,
    indexname as item_name,
    '✅ EXISTS' as status,
    'on ' || tablename as details
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
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
  );

-- Check for missing indexes
INSERT INTO _verification_results
SELECT 
    'INDEXES' as category,
    expected_idx as item_name,
    '⚠️ MISSING' as status,
    'Performance index not found' as details
FROM (VALUES 
    ('idx_clients_coach'), ('idx_clients_status'),
    ('idx_enrollments_coach'), ('idx_enrollments_end_date'),
    ('idx_checkins_coach_date'),
    ('idx_payments_coach'), ('idx_payments_paid_at'),
    ('idx_programs_coach_active'), ('idx_enrollments_client_status'),
    ('idx_enrollments_dates'), ('idx_checkins_client_date'),
    ('idx_checkins_enrollment'), ('idx_ai_summaries_coach_generated'),
    ('idx_payments_enrollment'), ('idx_whatsapp_log_client'),
    ('idx_whatsapp_log_sent_at'), ('idx_clients_full_name_trgm'),
    ('idx_programs_name_trgm')
) AS t(expected_idx)
WHERE NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' 
      AND indexname = expected_idx
);

-- ============================================================================
-- 6. VERIFY CHECK CONSTRAINTS
-- ============================================================================

INSERT INTO _verification_results
SELECT 
    'CONSTRAINTS' as category,
    conname as item_name,
    '✅ EXISTS' as status,
    pg_get_constraintdef(oid) as details
FROM pg_constraint
WHERE contype = 'c'
  AND connamespace = 'public'::regnamespace
  AND conname IN (
      'coaches_checkin_day_valid',
      'coaches_checkin_time_format',
      'checkins_energy_score_range',
      'enrollments_date_range_valid',
      'programs_price_positive'
  );

-- Check for missing constraints
INSERT INTO _verification_results
SELECT 
    'CONSTRAINTS' as category,
    expected_const as item_name,
    '⚠️ MISSING' as status,
    'Validation constraint not found' as details
FROM (VALUES 
    ('coaches_checkin_day_valid'),
    ('coaches_checkin_time_format'),
    ('checkins_energy_score_range'),
    ('enrollments_date_range_valid'),
    ('programs_price_positive')
) AS t(expected_const)
WHERE NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE contype = 'c'
      AND connamespace = 'public'::regnamespace
      AND conname LIKE '%' || expected_const || '%'
);

-- ============================================================================
-- 7. VERIFY RLS ENABLED ON ALL TABLES
-- ============================================================================

INSERT INTO _verification_results
SELECT 
    'RLS_ENABLED' as category,
    tablename as item_name,
    CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ NOT ENABLED' END as status,
    'Row Level Security' as details
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
      'coaches', 'programs', 'clients', 'enrollments', 
      'checkins', 'ai_summaries', 'payments', 'whatsapp_log'
  );

-- ============================================================================
-- FINAL REPORT
-- ============================================================================

SELECT '
╔══════════════════════════════════════════════════════════════╗
║          FITOSYS SCHEMA VERIFICATION REPORT                  ║
╚══════════════════════════════════════════════════════════════╝
' as report;

-- Category summaries
SELECT 
    '=== SUMMARY BY CATEGORY ===' as section,
    category,
    COUNT(*) as total_items,
    COUNT(*) FILTER (WHERE status LIKE '✅%') as passed,
    COUNT(*) FILTER (WHERE status LIKE '❌%' OR status LIKE '⚠️%') as issues,
    CASE 
        WHEN COUNT(*) FILTER (WHERE status LIKE '❌%' OR status LIKE '⚠️%') = 0 
        THEN '✅ COMPLETE'
        ELSE '⚠️ NEEDS ATTENTION'
    END as overall_status
FROM _verification_results
WHERE category NOT LIKE '%SUMMARY%'
GROUP BY category
ORDER BY category;

-- Overall statistics
SELECT '
=== OVERALL STATUS ===
' as section;

WITH stats AS (
    SELECT 
        COUNT(*) as total_checks,
        COUNT(*) FILTER (WHERE status LIKE '✅%') as passed,
        COUNT(*) FILTER (WHERE status LIKE '❌%' OR status LIKE '⚠️%') as issues
    FROM _verification_results
)
SELECT 
    total_checks,
    passed,
    issues,
    ROUND(passed::numeric / NULLIF(total_checks, 0) * 100, 1) as pass_rate_percent,
    CASE 
        WHEN issues = 0 THEN '✅ DATABASE FULLY SYNCED'
        WHEN issues < 5 THEN '⚠️ MINOR ISSUES - Review needed'
        ELSE '❌ MAJOR SYNC REQUIRED - Run migrations'
    END as final_status
FROM stats;

-- Show all issues
SELECT '
=== ISSUES FOUND (if any) ===
' as section;

SELECT category, item_name, status, details
FROM _verification_results
WHERE status LIKE '❌%' OR status LIKE '⚠️%'
ORDER BY category, item_name;

-- Detailed results (optional - comment out if too verbose)
SELECT '
=== DETAILED RESULTS ===
' as section;

SELECT 
    category,
    item_name,
    status,
    details
FROM _verification_results
ORDER BY category, 
    CASE 
        WHEN status LIKE '✅%' THEN 1
        WHEN status LIKE '⚠️%' THEN 2
        ELSE 3
    END,
    item_name;

-- Cleanup
DROP TABLE IF EXISTS _verification_results;

-- ============================================================================
-- RECOMMENDATIONS
-- ============================================================================

SELECT '
=== NEXT STEPS ===

If you see any ❌ or ⚠️ issues above:

1. For missing TABLES:
   - Run: supabase/migrations/20260307000001_initial_schema.sql

2. For missing RLS POLICIES:
   - Run: supabase/migrations/20260307000003_phase1_completion.sql

3. For missing FUNCTIONS or VIEWS:
   - Run: supabase/migrations/20260307000003_phase1_completion.sql

4. For missing INDEXES:
   - Run: supabase/migrations/20260307000003_phase1_completion.sql

5. For missing CONSTRAINTS:
   - Run: supabase/migrations/20260307000003_phase1_completion.sql

If everything shows ✅:
- Your database is fully synced! 
- You can proceed with Phase 2 development.
' as recommendations;
