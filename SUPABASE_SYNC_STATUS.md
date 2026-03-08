# Supabase Schema Sync Status

## Current Status: ⚠️ NEEDS VERIFICATION

Your migration files exist locally but need to be verified against the actual Supabase instance.

---

## Quick Sync Options

### Option 1: Using Supabase CLI (Recommended)

```bash
# 1. Install Supabase CLI (if not already installed)
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link to your project
supabase link --project-ref cwupeqgkahysocgzzjyp

# 4. Push all migrations
supabase db push
```

**Expected Output:**
```
Applying migration 001_initial_schema.sql... OK
Applying migration 002_razorpay_migration.sql... OK
Applying migration 003_phase1_completion.sql... OK
Schema successfully pushed to Supabase
```

---

### Option 2: Manual SQL Execution

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_razorpay_migration.sql`
   - `supabase/migrations/003_phase1_completion.sql`
3. Click "Run" for each migration

---

## Verification Steps

After syncing, verify the schema was applied correctly:

### Step 1: Run Verification Script

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy contents of `verify-schema.sql`
3. Paste and click "Run"

### Step 2: Check Results

You should see:

| Component | Expected | Status |
|-----------|----------|--------|
| Tables | 8 | ✅ |
| RLS Policies | 24+ | ✅ |
| Functions | 4 | ✅ |
| Views | 3 | ✅ |
| Indexes | 24+ | ✅ |
| Constraints | 6+ | ✅ |

### Step 3: Verify in Table Editor

Go to **Table Editor** and confirm these 8 tables exist:
- ✅ coaches
- ✅ programs
- ✅ clients
- ✅ enrollments
- ✅ checkins
- ✅ ai_summaries
- ✅ payments
- ✅ whatsapp_log

---

## Migration Files Overview

### 001_initial_schema.sql
**Purpose:** Base schema creation
**Changes:**
- Creates all 8 tables
- Adds basic RLS policies (SELECT only)
- Creates 7 basic indexes
- Sets up foreign key relationships

### 002_razorpay_migration.sql
**Purpose:** Stripe → Razorpay migration
**Changes:**
- Renames `stripe_customer_id` → `gateway_customer_id`
- Renames `stripe_payment_intent_id` → `gateway_payment_id`
- Adds `payment_gateway` column
- Makes `client_id` nullable in enrollments
- Removes UNIQUE constraint on payment IDs

### 003_phase1_completion.sql
**Purpose:** Complete Phase 1 infrastructure
**Changes:**
- Adds auto-update trigger for `updated_at`
- Adds complete CRUD RLS policies (24 total)
- Creates 3 database functions
- Creates 3 analytical views
- Adds 17 additional indexes
- Fixes cascade delete rules
- Adds 5 data validation constraints

---

## Troubleshooting

### Error: "Relation already exists"

**Cause:** Migrations were partially applied before

**Solution:**
```bash
# Check migration status
supabase migration list

# If migrations show as pending but exist in DB:
supabase migration repair 001_initial_schema --status applied
supabase migration repair 002_razorpay_migration --status applied
supabase migration repair 003_phase1_completion --status applied
```

### Error: "Permission denied"

**Cause:** Using anon key instead of service role

**Solution:** Ensure you're logged in with correct credentials:
```bash
supabase logout
supabase login
supabase link --project-ref cwupeqgkahysocgzzjyp
```

### Tables Missing After Push

**Cause:** Migration failed partway through

**Solution:**
1. Check Supabase Dashboard → **Logs**
2. Look for error messages
3. Fix the issue and re-run `supabase db push`

### RLS Policies Not Working

**Cause:** RLS not enabled or policies incomplete

**Solution:**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- All tables should show rowsecurity = true

-- Re-enable RLS if needed
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_log ENABLE ROW LEVEL SECURITY;
```

---

## Post-Sync Testing

### Test 1: Insert Test Coach

```sql
INSERT INTO coaches (
    email,
    full_name,
    whatsapp_number,
    slug,
    coaching_type,
    checkin_day,
    checkin_time
) VALUES (
    'test@fitosys.com',
    'Test Coach',
    '+919876543210',
    'test-coach-sync',
    ARRAY['online', 'fitness'],
    0,
    '19:00'
);

-- Verify it was created
SELECT id, email, full_name, slug, created_at 
FROM coaches 
WHERE email = 'test@fitosys.com';
```

### Test 2: Verify Auto-Update Trigger

```sql
-- Update the coach
UPDATE coaches 
SET full_name = 'Updated Test Coach' 
WHERE email = 'test@fitosys.com';

-- Check updated_at changed
SELECT full_name, updated_at 
FROM coaches 
WHERE email = 'test@fitosys.com';

-- updated_at should be recent (within last minute)
```

### Test 3: Verify Slug Function

```sql
-- Test slug generation
SELECT generate_unique_slug('John Doe');
-- Should return: 'john-doe' or 'john-doe-1' if exists
```

### Test 4: Verify Views

```sql
-- Test active clients view (should return empty or data)
SELECT * FROM active_clients_view;

-- Test upcoming renewals view
SELECT * FROM upcoming_renewals_view;

-- Test weekly response rates view
SELECT * FROM weekly_response_rates_view;
```

### Test 5: Verify RLS

```sql
-- This should fail or return empty (no auth context)
SELECT * FROM coaches;

-- RLS should prevent access without authentication
```

---

## Clean Up Test Data

After verification, remove test data:

```sql
-- Delete test coach (cascade will clean up related data)
DELETE FROM coaches WHERE email = 'test@fitosys.com';

-- Verify deletion
SELECT COUNT(*) FROM coaches WHERE email = 'test@fitosys.com';
-- Should return 0
```

---

## Environment Variables Check

Ensure your `.env.local` has correct values:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://cwupeqgkahysocgzzjyp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dXBlcWdrYWh5c29jZ3p6anlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMDQ4NTYsImV4cCI6MjA4NzU4MDg1Nn0.fgIbJFwpKbQ3xvzHlx6W6XcFn6NK3dRVUmhyNLQUGe8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dXBlcWdrYWh5c29jZ3p6anlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAwNDg1NiwiZXhwIjoyMDg3NTgwODU2fQ.ISXF0J_d7n2Gbpa4Lw8sh-T0XLuncxexIP3EgNh72yE
```

✅ **Already configured** - Your `.env.local` has valid Supabase credentials!

---

## Next Steps After Sync

Once schema is verified:

1. ✅ Test local dev server: `npm run dev`
2. ✅ Test database queries in dashboard
3. ✅ Begin Phase 2: Authentication UI
4. ✅ Implement CRUD operations

---

## Sync Checklist

- [ ] Supabase CLI installed
- [ ] Logged in to Supabase (`supabase login`)
- [ ] Project linked (`supabase link --project-ref cwupeqgkahysocgzzjyp`)
- [ ] Migrations pushed (`supabase db push`)
- [ ] Verification SQL run (`verify-schema.sql`)
- [ ] All 8 tables visible in Table Editor
- [ ] RLS enabled on all tables
- [ ] Test coach record created successfully
- [ ] Test data cleaned up
- [ ] `.env.local` configured correctly
- [ ] Local dev server tested

---

**Last Updated:** 2026-03-08
**Project Ref:** cwupeqgkahysocgzzjyp
**Status:** ⚠️ Pending Verification
