# Supabase Sync Guide

## ⚠️ Current Status: NOT SYNCED

Your database schema exists only as **local SQL files**. To sync with Supabase, you need to:

1. Create/link Supabase project
2. Apply migrations
3. Configure environment variables

---

## Step 1: Create Supabase Project

### Option A: New Project (Recommended for Development)

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: fitosys-dev
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to you (e.g., Asia South for India)
4. Wait 2-3 minutes for provisioning

### Option B: Use Existing Project

If you already have a Fitosys project:
- Note your project reference ID
- Skip to Step 3

---

## Step 2: Install & Link Supabase CLI

### Install CLI

```bash
npm install -g supabase
```

### Login to Supabase

```bash
supabase login
```

This will open a browser window for authentication.

### Initialize Local Project

```bash
cd d:\Projects\Personal_Projects\Websites\fitosys
supabase init
```

### Link to Supabase Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**Find your project ref:**
- Go to Supabase Dashboard
- Click on your project
- Look in Settings → General
- Copy the "Project Reference" (e.g., `abcdefghijklmnopqrst`)

---

## Step 3: Get API Keys

From Supabase Dashboard:

1. Go to **Settings** → **API**
2. Copy these keys:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbG...` (starts with eyJ)
   - **Service Role Key**: `eyJhbG...` (longer key, keep secret!)

---

## Step 4: Configure Environment Variables

Create `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenRouter (AI)
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct

# Razorpay (Development)
RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# WhatsApp (Interakt - Optional for now)
WHATSAPP_AISENSY_API_KEY=
WHATSAPP_VERIFY_TOKEN=

# Cron Jobs
CRON_SECRET=generate_a_random_secret_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

⚠️ **IMPORTANT**: Never commit `.env.local` to Git!

---

## Step 5: Apply Migrations to Supabase

### Method 1: Push All Migrations (Recommended)

```bash
# This will apply all 3 migration files in order
supabase db push
```

Expected output:
```
Applying migration 001_initial_schema.sql... OK
Applying migration 002_razorpay_migration.sql... OK
Applying migration 003_phase1_completion.sql... OK
Schema successfully pushed to Supabase
```

### Method 2: Manual SQL Execution (Alternative)

If CLI doesn't work:

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy contents of each migration file
4. Paste and run in order:
   - First: `001_initial_schema.sql`
   - Second: `002_razorpay_migration.sql`
   - Third: `003_phase1_completion.sql`

---

## Step 6: Verify Sync

### Test Connection

```bash
# Check if linked
supabase status

# Should show:
# Linked to: xxxxxxxxxxxxxxxxxxxxxx
# Local URL: http://localhost:54321
# API URL: https://xxxxx.supabase.co
```

### Verify Tables Created

In Supabase Dashboard → **Table Editor**, you should see:

✅ **8 Tables:**
- coaches
- programs
- clients
- enrollments
- checkins
- ai_summaries
- payments
- whatsapp_log

### Verify Functions Created

Run this SQL in **SQL Editor**:

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

### Verify Views Created

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

### Verify RLS Enabled

```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Expected:** All tables should show `rowsecurity = true`

---

## Step 7: Test Multi-Tenancy

Create a test coach record:

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
    'test-coach',
    ARRAY['online', 'fitness'],
    0,
    '19:00'
);
```

Check it was created:

```sql
SELECT id, email, full_name, slug FROM coaches WHERE email = 'test@fitosys.com';
```

---

## Troubleshooting

### Error: "Not logged in"

```bash
supabase logout
supabase login
```

### Error: "Project not linked"

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Error: "Migration already exists"

This means migrations were partially applied. Check status:

```bash
supabase migration list
```

Then fix:
```bash
# If stuck migration, use:
supabase migration repair MIGRATION_NAME --status applied
```

### Error: "Permission denied"

Ensure you're using the **Service Role Key** for server operations, not the Anon key.

### Tables Missing After Push

Check migration logs:
```bash
supabase db diff --file debug_diff
```

This shows what would be different between local and remote.

---

## Production Deployment

When ready for production:

### 1. Create Production Project

Repeat Steps 1-3 for a new production project.

### 2. Apply Migrations

```bash
supabase link --project-ref PROD_PROJECT_REF
supabase db push
```

### 3. Update Environment Variables

Change `.env.local` (or Vercel environment variables):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://prod-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_key
```

---

## Backup Strategy

### Before Making Changes

```bash
# Dump current schema
supabase db dump -f backup_before_changes.sql

# Or dump data only
supabase db dump -data-only -f backup_data_only.sql
```

### Automated Backups (Pro Plan)

Enable Point-in-Time Recovery in Supabase Dashboard:
- Settings → Database
- Enable PITR
- Retains last 7 days automatically

---

## Quick Start Commands Summary

```bash
# 1. Install
npm install -g supabase

# 2. Login
supabase login

# 3. Init
supabase init

# 4. Link
supabase link --project-ref YOUR_REF

# 5. Push migrations
supabase db push

# 6. Verify
supabase status
```

---

## Verification Checklist

After syncing, verify:

- [ ] Supabase CLI installed and logged in
- [ ] Project linked (`supabase status`)
- [ ] `.env.local` configured with correct keys
- [ ] All 8 tables visible in Table Editor
- [ ] 4 functions exist (run function check query)
- [ ] 3 views exist (run view check query)
- [ ] RLS enabled on all tables
- [ ] Test coach record can be inserted
- [ ] No errors in migration push

---

## Next Steps After Sync

Once synced:

1. **Test locally**: Run `npm run dev` and test database queries
2. **Verify RLS**: Try accessing data without auth (should fail)
3. **Test AI integration**: Call `/api/demo-summary` endpoint
4. **Begin Phase 2**: Start building authentication UI

---

**Status After Following This Guide:** ✅ SYNCED WITH SUPABASE

**Estimated Time:** 15-20 minutes  
**Difficulty:** Beginner-friendly
