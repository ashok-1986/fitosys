# Database Migration Guide

## Overview

This guide covers applying all Phase 1 database migrations to your Supabase instance.

---

## Migration Files

Three migration files must be applied **in order**:

1. `001_initial_schema.sql` - Base schema creation
2. `002_razorpay_migration.sql` - Razorpay integration
3. `003_phase1_completion.sql` - Complete RLS, functions, indexes, views

---

## Method 1: Supabase CLI (Recommended)

### Prerequisites
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login
```

### Local Development

```bash
# Initialize Supabase locally (if not done)
supabase init

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Reset local database and apply all migrations
supabase db reset

# OR apply migrations without reset
supabase db push
```

### Production Deployment

```bash
# Apply migrations to production
supabase db push

# Verify migrations
supabase db diff
```

---

## Method 2: Supabase Dashboard (Manual)

### Step-by-Step

1. **Open SQL Editor** in Supabase Dashboard
   - Navigate to your project
   - Click "SQL Editor" in left sidebar
   - Click "New query"

2. **Apply Migration 001**
   ```sql
   -- Copy contents of 001_initial_schema.sql
   -- Paste into editor
   -- Click "Run" button
   ```

3. **Apply Migration 002**
   ```sql
   -- Copy contents of 002_razorpay_migration.sql
   -- Paste into editor
   -- Click "Run" button
   ```

4. **Apply Migration 003**
   ```sql
   -- Copy contents of 003_phase1_completion.sql
   -- Paste into editor
   -- Click "Run" button
   ```

---

## Verification

After applying migrations, verify success:

### 1. Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Result:**
```
ai_summaries
checkins
clients
coaches
enrollments
payments
programs
whatsapp_log
```

### 2. Check Functions Created
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION';
```

**Expected Result:**
```
calculate_enrollment_week
generate_unique_slug
get_program_active_enrollments
update_updated_at_column
```

### 3. Check Views Created
```sql
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';
```

**Expected Result:**
```
active_clients_view
upcoming_renewals_view
weekly_response_rates_view
```

### 4. Check RLS Policies
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected:** 20+ policies across all tables

### 5. Test Auto-Update Trigger
```sql
-- Get initial updated_at
SELECT updated_at FROM coaches WHERE email = 'your-email@example.com';

-- Update record
UPDATE coaches SET full_name = 'Test Update' 
WHERE email = 'your-email@example.com';

-- Check if updated_at changed
SELECT updated_at FROM coaches WHERE email = 'your-email@example.com';
```

**Expected:** Second query should show newer timestamp

### 6. Test Slug Generation
```sql
SELECT generate_unique_slug('John Doe');
```

**Expected:** `john-doe` or `john-doe-1` if exists

### 7. Check Indexes
```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

**Expected:** 24+ indexes

---

## Troubleshooting

### Error: "relation already exists"

**Cause:** Migration already applied  
**Solution:** Use `IF NOT EXISTS` guards or drop existing objects first

```sql
-- Example: Drop and recreate
DROP TABLE IF EXISTS coaches CASCADE;
-- Then re-run migration
```

⚠️ **WARNING:** Only do this on development databases!

### Error: "permission denied"

**Cause:** Insufficient privileges  
**Solution:** Ensure you're using a role with proper permissions

```sql
-- Check current role
SELECT current_role;

-- Should be postgres or admin role
```

### Error: "function does not exist"

**Cause:** Migration 003 depends on Migration 001 & 002  
**Solution:** Apply migrations in correct order

### RLS Policy Conflicts

If you get "policy already exists":

```sql
-- Drop all existing policies first
DROP POLICY IF EXISTS "coaches_own_record" ON coaches;
DROP POLICY IF EXISTS "coaches_own_programs" ON programs;
-- ... repeat for all policies

-- Then re-run Migration 003
```

---

## Rollback Procedures

### Rollback Migration 003 Only

```sql
-- Drop triggers
DROP TRIGGER IF EXISTS update_coaches_updated_at ON coaches;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop views
DROP VIEW IF EXISTS weekly_response_rates_view;
DROP VIEW IF EXISTS upcoming_renewals_view;
DROP VIEW IF EXISTS active_clients_view;

-- Drop functions
DROP FUNCTION IF EXISTS generate_unique_slug(TEXT);
DROP FUNCTION IF EXISTS calculate_enrollment_week(UUID, DATE);
DROP FUNCTION IF EXISTS get_program_active_enrollments(UUID);

-- Drop indexes
-- (List all indexes from Migration 003)

-- Revert constraints
ALTER TABLE coaches DROP CONSTRAINT IF EXISTS coaches_checkin_day_valid;
ALTER TABLE coaches DROP CONSTRAINT IF EXISTS coaches_checkin_time_format;
-- ... etc
```

### Full Rollback (All Migrations)

```sql
-- Drop everything in reverse dependency order
DROP VIEW IF EXISTS weekly_response_rates_view;
DROP VIEW IF EXISTS upcoming_renewals_view;
DROP VIEW IF EXISTS active_clients_view;

DROP TABLE IF EXISTS whatsapp_log CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS ai_summaries CASCADE;
DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS coaches CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS generate_unique_slug(TEXT);
DROP FUNCTION IF EXISTS calculate_enrollment_week(UUID, DATE);
DROP FUNCTION IF EXISTS get_program_active_enrollments(UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();
```

---

## Post-Migration Tasks

### 1. Create First Coach Record

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
    'coach@example.com',
    'John Coach',
    '+919876543210',
    'john-coach',
    ARRAY['online', 'fitness'],
    0,  -- Sunday
    '19:00'
);
```

### 2. Create Sample Program

```sql
INSERT INTO programs (
    coach_id,
    name,
    description,
    duration_weeks,
    price,
    currency,
    checkin_type
) 
SELECT 
    c.id,
    '12-Week Transformation',
    'Complete fitness and nutrition program',
    12,
    9999.00,
    'INR',
    'fitness'
FROM coaches c
WHERE c.email = 'coach@example.com';
```

### 3. Verify Multi-Tenancy

```sql
-- Create test data as different "coach"
-- Then try to access with different auth.uid()
-- Should return empty results due to RLS
```

---

## Performance Benchmarks

After applying migrations, expect:

### Query Performance (with indexes)
- Client lookup by coach: <10ms
- Enrollment date range queries: <20ms
- Check-in timeline queries: <15ms
- Payment history queries: <10ms
- Response rate analytics: <50ms

### Without Indexes (for comparison)
- Same queries: 100-500ms on 10k rows

---

## Security Checklist

After migration:

- [ ] RLS enabled on all tables
- [ ] Service role key stored securely
- [ ] Anon key used for client-side operations
- [ ] Webhook endpoints use CRON_SECRET
- [ ] No hardcoded credentials in code
- [ ] Environment variables properly scoped

---

## Backup Recommendations

Before applying migrations to production:

1. **Create Manual Backup**
   ```bash
   supabase db dump -f backup_before_migrations.sql
   ```

2. **Enable Point-in-Time Recovery** (Supabase Pro plan)

3. **Test on Staging First**
   - Clone production to staging
   - Apply migrations
   - Test thoroughly
   - Then apply to production

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://postgresql.org/docs
- **Migration Issues:** Check GitHub issues or contact support

---

## Migration Status Tracker

| Environment | Migration 001 | Migration 002 | Migration 003 | Applied Date |
|-------------|---------------|---------------|---------------|--------------|
| Local Dev   | ⬜ | ⬜ | ⬜ | - |
| Staging     | ⬜ | ⬜ | ⬜ | - |
| Production  | ⬜ | ⬜ | ⬜ | - |

Mark ✅ when complete.

---

**Last Updated:** March 7, 2026  
**Migration Version:** 003
