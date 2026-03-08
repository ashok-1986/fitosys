-- Fitosys Schema Verification Script
-- Run this in Supabase Dashboard → SQL Editor to verify schema sync status
-- 
-- Copy entire file and paste in SQL Editor, then click "Run"

-- ============================================================================
-- FITOSYS SUPABASE SCHEMA VERIFICATION
-- ============================================================================

SELECT '=== FITOSYS SUPABASE SCHEMA VERIFICATION ===' as section;

-- ============================================================================
-- 1. VERIFY TABLES (Expected: 8)
-- ============================================================================

SELECT '1. TABLES' as verification_step;

SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('coaches', 'programs', 'clients', 'enrollments', 
                            'checkins', 'ai_summaries', 'payments', 'whatsapp_log')
        THEN '✅ EXPECTED'
        ELSE 'ℹ️ OTHER'
    END as status
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Summary
SELECT 
    COUNT(*) as total_tables,
    COUNT(*) FILTER (WHERE table_name IN (
        'coaches', 'programs', 'clients', 'enrollments', 
        'checkins', 'ai_summaries', 'payments', 'whatsapp_log'
    )) as expected_tables,
    CASE 
        WHEN COUNT(*) FILTER (WHERE table_name IN (
            'coaches', 'programs', 'clients', 'enrollments', 
            'checkins', 'ai_summaries', 'payments', 'whatsapp_log'
        )) = 8 
        THEN '✅ All tables present'
        ELSE '❌ Missing tables'
    END as status
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- ============================================================================
-- 2. VERIFY RLS POLICIES (Expected: 24+)
-- ============================================================================

SELECT '2. RLS POLICIES' as verification_step;

SELECT 
    tablename as table_name,
    policyname as policy_name,
    cmd as operation,
    qual as condition
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Summary by table
SELECT 
    tablename as table_name,
    COUNT(*) as policy_count,
    array_agg(cmd) as operations
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Total count
SELECT 
    COUNT(*) as total_policies,
    CASE 
        WHEN COUNT(*) >= 24 THEN '✅ Complete RLS coverage'
        ELSE '⚠️ Incomplete RLS coverage'
    END as status
FROM pg_policies
WHERE schemaname = 'public';

-- ============================================================================
-- 3. VERIFY FUNCTIONS (Expected: 4)
-- ============================================================================

SELECT '3. FUNCTIONS' as verification_step;

SELECT 
    routine_name as function_name,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
  AND routine_name IN (
      'update_updated_at_column',
      'generate_unique_slug',
      'calculate_enrollment_week',
      'get_program_active_enrollments'
  )
ORDER BY routine_name;

-- Check for missing functions
SELECT 
    function_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_schema = 'public' 
              AND routine_type = 'FUNCTION'
              AND routine_name = function_name
        ) THEN '✅ Exists'
        ELSE '❌ MISSING'
    END as status
FROM (VALUES 
    ('update_updated_at_column'),
    ('generate_unique_slug'),
    ('calculate_enrollment_week'),
    ('get_program_active_enrollments')
) AS expected_functions(function_name);

-- ============================================================================
-- 4. VERIFY VIEWS (Expected: 3)
-- ============================================================================

SELECT '4. VIEWS' as verification_step;

SELECT 
    table_name as view_name,
    CASE 
        WHEN table_name IN ('active_clients_view', 'upcoming_renewals_view', 'weekly_response_rates_view')
        THEN '✅ EXPECTED'
        ELSE 'ℹ️ OTHER'
    END as status
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check for missing views
SELECT 
    view_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.views 
            WHERE table_schema = 'public' 
              AND table_name = view_name
        ) THEN '✅ Exists'
        ELSE '❌ MISSING'
    END as status
FROM (VALUES 
    ('active_clients_view'),
    ('upcoming_renewals_view'),
    ('weekly_response_rates_view')
) AS expected_views(view_name);

-- ============================================================================
-- 5. VERIFY INDEXES (Expected: 24+)
-- ============================================================================

SELECT '5. INDEXES' as verification_step;

SELECT 
    indexname as index_name,
    tablename as table_name,
    indexdef as definition
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check for expected indexes
SELECT 
    index_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE schemaname = 'public' 
              AND indexname = index_name
        ) THEN '✅ Exists'
        ELSE '⚠️ Missing'
    END as status
FROM (VALUES 
    ('idx_clients_coach'),
    ('idx_clients_status'),
    ('idx_enrollments_coach'),
    ('idx_enrollments_end_date'),
    ('idx_checkins_coach_date'),
    ('idx_payments_coach'),
    ('idx_payments_paid_at'),
    ('idx_programs_coach_active'),
    ('idx_enrollments_client_status'),
    ('idx_enrollments_dates'),
    ('idx_checkins_client_date'),
    ('idx_checkins_enrollment'),
    ('idx_ai_summaries_coach_generated'),
    ('idx_payments_enrollment'),
    ('idx_whatsapp_log_client'),
    ('idx_whatsapp_log_sent_at'),
    ('idx_clients_full_name_trgm'),
    ('idx_programs_name_trgm')
) AS expected_indexes(index_name);

-- Total count
SELECT 
    COUNT(*) as total_indexes,
    CASE 
        WHEN COUNT(*) >= 24 THEN '✅ Good index coverage'
        ELSE '⚠️ Some indexes missing'
    END as status
FROM pg_indexes
WHERE schemaname = 'public';

-- ============================================================================
-- 6. VERIFY CHECK CONSTRAINTS (Expected: 6+)
-- ============================================================================

SELECT '6. CHECK CONSTRAINTS' as verification_step;

SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE contype = 'c'
  AND connamespace = 'public'::regnamespace
ORDER BY conname;

-- Check for expected constraints
SELECT 
    constraint_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE contype = 'c'
              AND connamespace = 'public'::regnamespace
              AND conname LIKE '%' || constraint_name || '%'
        ) THEN '✅ Exists'
        ELSE '⚠️ Missing'
    END as status
FROM (VALUES 
    ('coaches_checkin_day_valid'),
    ('coaches_checkin_time_format'),
    ('checkins_energy_score_range'),
    ('enrollments_date_range_valid'),
    ('programs_price_positive')
) AS expected_constraints(constraint_name);

-- ============================================================================
-- 7. VERIFY RLS ENABLED ON ALL TABLES
-- ============================================================================

SELECT '7. RLS ENABLED' as verification_step;

SELECT 
    schemaname as schema_name,
    tablename as table_name,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ Enabled'
        ELSE '❌ NOT ENABLED'
    END as status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================================
-- 8. VERIFY FOREIGN KEYS WITH CASCADE DELETE
-- ============================================================================

SELECT '8. FOREIGN KEYS' as verification_step;

SELECT 
    tc.table_name as child_table,
    kcu.column_name as child_column,
    ccu.table_name as parent_table,
    ccu.column_name as parent_column,
    rc.delete_rule as on_delete,
    CASE 
        WHEN rc.delete_rule = 'CASCADE' THEN '✅ CASCADE'
        WHEN rc.delete_rule = 'RESTRICT' THEN '🔒 RESTRICT'
        ELSE 'ℹ️ ' || rc.delete_rule
    END as delete_behavior
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
    AND rc.constraint_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ============================================================================
-- FINAL SUMMARY
-- ============================================================================

SELECT '=== FINAL SUMMARY ===' as section;

-- Create a summary report
WITH summary AS (
    SELECT 
        'Tables' as component,
        COUNT(*) FILTER (WHERE table_name IN (
            'coaches', 'programs', 'clients', 'enrollments', 
            'checkins', 'ai_summaries', 'payments', 'whatsapp_log'
        )) as found,
        8 as expected
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    
    UNION ALL
    
    SELECT 
        'RLS Policies',
        COUNT(*),
        24
    FROM pg_policies
    WHERE schemaname = 'public'
    
    UNION ALL
    
    SELECT 
        'Functions',
        COUNT(*),
        4
    FROM information_schema.routines
    WHERE routine_schema = 'public' 
      AND routine_type = 'FUNCTION'
      AND routine_name IN (
          'update_updated_at_column',
          'generate_unique_slug',
          'calculate_enrollment_week',
          'get_program_active_enrollments'
      )
    
    UNION ALL
    
    SELECT 
        'Views',
        COUNT(*),
        3
    FROM information_schema.views
    WHERE table_schema = 'public'
      AND table_name IN (
          'active_clients_view',
          'upcoming_renewals_view',
          'weekly_response_rates_view'
      )
    
    UNION ALL
    
    SELECT 
        'Indexes',
        COUNT(*),
        24
    FROM pg_indexes
    WHERE schemaname = 'public'
)

SELECT 
    component,
    found,
    expected,
    CASE 
        WHEN found >= expected THEN '✅'
        ELSE '⚠️'
    END as status,
    CASE 
        WHEN found >= expected THEN 'Complete'
        ELSE 'Incomplete'
    END as completion_status
FROM summary
ORDER BY component;

-- Overall status
SELECT 
    CASE 
        WHEN (
            SELECT COUNT(*) FILTER (WHERE table_name IN (
                'coaches', 'programs', 'clients', 'enrollments', 
                'checkins', 'ai_summaries', 'payments', 'whatsapp_log'
            ))
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ) = 8
        AND (
            SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public'
        ) >= 24
        AND (
            SELECT COUNT(*) FROM information_schema.routines
            WHERE routine_schema = 'public' 
              AND routine_type = 'FUNCTION'
              AND routine_name IN (
                  'update_updated_at_column',
                  'generate_unique_slug',
                  'calculate_enrollment_week',
                  'get_program_active_enrollments'
              )
        ) = 4
        AND (
            SELECT COUNT(*) FROM information_schema.views
            WHERE table_schema = 'public'
              AND table_name IN (
                  'active_clients_view',
                  'upcoming_renewals_view',
                  'weekly_response_rates_view'
              )
        ) = 3
        THEN '✅ DATABASE IS FULLY SYNCED'
        ELSE '⚠️ DATABASE NEEDS SYNC - Run migrations'
    END as overall_status;

-- ============================================================================
-- END OF VERIFICATION
-- ============================================================================
