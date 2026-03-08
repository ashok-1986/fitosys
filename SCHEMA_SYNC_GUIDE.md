# Supabase Schema Sync Guide

## Current Status: ✅ TABLES VERIFIED

**Date:** 2026-03-08  
**Project Ref:** cwupeqgkahysocgzzjyp  
**Tables Status:** All 8 tables exist ✅

---

## What Was Done

1. ✅ Verified Supabase connection works
2. ✅ Confirmed all 8 tables exist:
   - coaches
   - programs
   - clients
   - enrollments
   - checkins
   - ai_summaries
   - payments
   - whatsapp_log

3. ⏳ **Pending:** Verify RLS policies, functions, views, indexes

---

## Next Step: Run Complete Verification

### Instructions

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select project: `cwupeqgkahysocgzzjyp`

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Run Verification Script**
   - Copy contents of: `verify-schema-complete.sql`
   - Paste into SQL Editor
   - Click "Run" or press `Ctrl+Enter`

4. **Review Results**

The script will show:
- ✅ **Summary by Category** - Tables, RLS, Functions, Views, Indexes, Constraints
- ✅ **Overall Status** - Pass/fail with percentage
- ✅ **Issues Found** - Any missing components
- ✅ **Detailed Results** - Full itemized list

---

## Expected Results

### If Database is Fully Synced

You should see:
```
╔══════════════════════════════════════════════════════════════╗
║          FITOSYS SCHEMA VERIFICATION REPORT                  ║
╚══════════════════════════════════════════════════════════════╝

=== SUMMARY BY CATEGORY ===
category      | total_items | passed | issues | overall_status
--------------|-------------|--------|--------|----------------
CONSTRAINTS   |     5       |   5    |   0    | ✅ COMPLETE
FUNCTIONS     |     4       |   4    |   0    | ✅ COMPLETE
INDEXES       |    18       |  18    |   0    | ✅ COMPLETE
RLS_ENABLED   |     8       |   8    |   0    | ✅ COMPLETE
RLS_POLICIES  |    24       |  24    |   0    | ✅ COMPLETE
TABLES        |     8       |   8    |   0    | ✅ COMPLETE
VIEWS         |     3       |   3    |   0    | ✅ COMPLETE

=== OVERALL STATUS ===
total_checks: 70
passed: 70
issues: 0
pass_rate_percent: 100.0
final_status: ✅ DATABASE FULLY SYNCED
```

### If Database Needs Sync

You'll see issues marked with ⚠️ or ❌. In that case:

---

## Apply Migrations (If Needed)

### Option 1: Copy-Paste SQL (Recommended)

1. **Open Migration Files**
   - `supabase/migrations/20260307000001_initial_schema.sql`
   - `supabase/migrations/20260307000002_razorpay_migration.sql`
   - `supabase/migrations/20260307000003_phase1_completion.sql`

2. **Run in Order**
   - Open SQL Editor
   - Copy first migration (001)
   - Paste and Run
   - Repeat for 002 and 003

3. **Re-run Verification**
   - Run `verify-schema-complete.sql` again
   - Confirm all issues resolved

### Option 2: Supabase CLI

```bash
# Navigate to project
cd d:\Projects\Personal_Projects\Websites\fitosys

# Push migrations
npx supabase db push
```

**Note:** This may fail if migration history doesn't match. Use Option 1 if you encounter errors.

---

## Migration File Contents

### 001_initial_schema.sql
Creates:
- 8 tables with basic schema
- 7 basic indexes
- Initial RLS policies (SELECT only)
- Foreign key relationships

### 002_razorpay_migration.sql
Changes:
- Stripe → Razorpay column renames
- Adds `payment_gateway` columns
- Makes `client_id` nullable in enrollments
- Removes UNIQUE constraints on payment IDs

### 003_phase1_completion.sql
Adds:
- Auto-update trigger for `updated_at`
- Complete CRUD RLS policies (24 total)
- 4 database functions
- 3 analytical views
- 17 additional indexes
- 5 data validation constraints
- Cascade delete rules

---

## Manual Fixes (If Specific Items Missing)

### Missing RLS Policies

```sql
-- Re-enable RLS on all tables
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_log ENABLE ROW LEVEL SECURITY;

-- Then run 003_phase1_completion.sql for full policies
```

### Missing Functions

```sql
-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Then run 003_phase1_completion.sql for remaining functions
```

### Missing Views

Just run `003_phase1_completion.sql` - it creates all views.

---

## Post-Sync Verification

After applying migrations, verify:

### 1. Test Auto-Update Trigger

```sql
-- Update a test record
UPDATE coaches 
SET full_name = 'Test Update' 
WHERE email = 'test@example.com';

-- Check updated_at changed
SELECT updated_at FROM coaches WHERE email = 'test@example.com';
```

### 2. Test Slug Function

```sql
SELECT generate_unique_slug('John Doe');
-- Should return: 'john-doe' or 'john-doe-1'
```

### 3. Test Views

```sql
SELECT * FROM active_clients_view LIMIT 5;
SELECT * FROM upcoming_renewals_view LIMIT 5;
SELECT * FROM weekly_response_rates_view LIMIT 5;
```

### 4. Test RLS

```sql
-- Without auth context, should return empty or error
SELECT * FROM coaches;
```

---

## Files Created for Sync

| File | Purpose |
|------|---------|
| `check-supabase-schema.js` | Quick table existence check |
| `verify-schema-complete.sql` | Full schema verification |
| `SUPABASE_SYNC_STATUS.md` | Sync status documentation |
| `SUPABASE_SYNC_GUIDE.md` | Original sync guide |

---

## Troubleshooting

### "Relation does not exist"

The table/view doesn't exist. Run the appropriate migration.

### "Function does not exist"

Function not created. Run `003_phase1_completion.sql`.

### "Permission denied"

You're using anon key instead of service role. Make sure you're logged in as project owner.

### "Migration already applied"

Migration history mismatch. Use manual copy-paste method instead of CLI.

---

## Success Criteria

Your database is fully synced when:

- ✅ All 8 tables exist
- ✅ RLS enabled on all tables
- ✅ 24+ RLS policies exist
- ✅ 4 functions exist
- ✅ 3 views exist
- ✅ 24+ indexes exist
- ✅ 5+ check constraints exist
- ✅ `verify-schema-complete.sql` shows 100% pass rate

---

## After Sync is Complete

1. ✅ Update this document with verification results
2. ✅ Mark "Sync Supabase schema" task as complete
3. ✅ Begin Phase 2: Authentication & Onboarding

---

**Contact:** If you encounter issues, share the verification report output.
