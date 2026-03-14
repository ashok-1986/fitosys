# Fitosys Production Deployment Checklist

**Version:** 1.0  
**Date:** 2026-03-13  
**Status:** Ready for Production Launch

---

## Pre-Deployment Verification

### 1. Code & Build Status

- [x] TypeScript compilation passes with no errors
- [x] Build completes successfully (`npm run build`)
- [x] No console errors in development
- [x] All API routes respond correctly
- [x] Middleware rate limiting configured

**Verification Command:**
```bash
npm run build
# Expected: ✓ Compiled successfully, ✓ TypeScript: No errors
```

---

### 2. Database Migrations

**Action Required:** Apply all pending migrations to production Supabase instance.

**Migrations to Apply:**
```sql
-- 1. Initial Schema (if not already applied)
-- File: supabase/migrations/20260307000001_initial_schema.sql

-- 2. Razorpay Migration
-- File: supabase/migrations/20260307000002_razorpay_migration.sql

-- 3. Phase 1 Completion
-- File: supabase/migrations/20260307000003_phase1_completion.sql

-- 4. Pricing & GST (P1-2)
-- File: supabase/migrations/20260309000001_pricing_tier_gst.sql

-- 5. Account Deletion Tracking (P1-5)
-- File: supabase/migrations/20260313000001_account_deletion_tracking.sql
```

**Apply via Supabase CLI:**
```bash
supabase db push
```

**Or via Supabase Dashboard:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy each migration file content
3. Execute in order (1 → 5)

**Verification:**
```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected: 11 tables (ai_summaries, checkins, checkin_templates, coaches, clients, enrollments, gst_invoices, payments, programs, subscriptions, whatsapp_log)

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Expected: All tables show rowsecurity = true
```

---

### 3. Environment Variables (Production)

**Action Required:** Add all environment variables to Vercel project settings.

**Navigate to:** Vercel Dashboard → fitosys → Settings → Environment Variables

**Required Variables:**

```bash
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay (Live Keys for Production)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx

# WhatsApp (Meta Cloud API)
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=838337922704261
WHATSAPP_VERIFY_TOKEN=fitosys_whatsapp_verify_2026

# AI (OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=qwen/qwen3-32b

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxx

# Cron Jobs
CRON_SECRET=your_super_secret_cron_key_here

# App
NEXT_PUBLIC_APP_URL=https://fitosys.alchemetryx.com
```

**Verification:**
```bash
# After deploying, verify env vars are loaded
curl https://fitosys.alchemetryx.com/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

---

### 4. WhatsApp Template Approval

**Action Required:** Verify all templates are approved in Meta Business Manager.

**Navigate to:** Meta Business Manager → WhatsApp Accounts → Fitosys → Message Templates

**Templates to Verify:**

| Template Name | Category | Status | Action |
|---------------|----------|--------|--------|
| `fitosys_weekly_checkin` | MARKETING | ⏳ Check | Verify approved |
| `fitosys_client_welcome` | UTILITY | ⏳ Check | Verify approved |
| `fitosys_renewal_reminder` | MARKETING | ⏳ Check | Verify approved |
| `fitosys_second_renewal_reminder` | UTILITY | ⏳ Check | Verify approved |
| `fitosys_coach_weekly_summary` | UTILITY | ⏳ Check | Verify approved |
| `fitosys_new_client_notification` | UTILITY | ⏳ Check | Verify approved |

**If Not Approved:**
1. Submit template via Meta Business Manager
2. Wait for approval (typically 24-48 hours)
3. Test template sending after approval

**Test Command (via WhatsApp API):**
```bash
curl -X POST "https://graph.facebook.com/v19.0/838337922704261/messages" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "919876543210",
    "type": "template",
    "template": {
      "name": "fitosys_weekly_checkin",
      "language": {"code": "en"},
      "components": [{
        "type": "body",
        "parameters": [
          {"type": "text", "text": "Test User"},
          {"type": "text", "text": "Test Coach"}
        ]
      }]
    }
  }'
```

---

### 5. Razorpay Configuration

**Action Required:** Switch from test to live keys and configure webhooks.

**Steps:**

1. **Get Live Keys:**
   - Navigate to Razorpay Dashboard → Settings → API Keys
   - Generate live key pair (if not already done)
   - Copy `Key ID` and `Key Secret`

2. **Configure Webhook:**
   - Navigate to Razorpay Dashboard → Settings → Webhooks
   - Add webhook URL: `https://fitosys.alchemetryx.com/api/webhooks/razorpay`
   - Add subscription webhook: `https://fitosys.alchemetryx.com/api/webhooks/razorpay-subscription`
   - Select events:
     - `payment.captured`
     - `payment.failed`
     - `subscription.charged`
     - `subscription.halted`
     - `subscription.cancelled`
   - Generate webhook secret
   - Add to Vercel: `RAZORPAY_WEBHOOK_SECRET`

3. **Verify KYC:**
   - Ensure Razorpay KYC is complete
   - Verify account is in "Activated" status

**Test Payment:**
```bash
# Create test order with live keys
curl -X POST "https://fitosys.alchemetryx.com/api/payments/create-order" \
  -H "Content-Type: application/json" \
  -d '{"programId":"valid-uuid","clientData":{"full_name":"Test User","email":"test@example.com","whatsapp_number":"+919876543210"}}'
```

---

### 6. Vercel Cron Configuration

**Action Required:** Enable cron jobs in Vercel production.

**Steps:**

1. Navigate to Vercel Dashboard → fitosys → Settings → Cron Jobs
2. Enable the following crons (already defined in `vercel.json`):

| Path | Schedule | Timezone | Purpose |
|------|----------|----------|---------|
| `/api/cron/checkins` | `0 13 * * 0` | UTC | Sunday 7PM IST |
| `/api/cron/renewals` | `0 10 * * *` | UTC | Daily 10AM UTC |
| `/api/cron/summaries` | `30 1 * * 1` | UTC | Monday 7AM IST |
| `/api/cron/expiry` | `0 0 * * *` | UTC | Daily midnight UTC |
| `/api/cron/process-deletions` | `0 0 * * *` | UTC | Daily midnight UTC |

3. Click "Enable" for each cron

**Verification:**
```bash
# Manually trigger cron to verify it works
curl -X POST "https://fitosys.alchemetryx.com/api/cron/checkins" \
  -H "Authorization: Bearer $CRON_SECRET"

# Expected: {"sent": X, "errors": 0}
```

---

## Deployment Steps

### Step 1: Push to Production

```bash
# Ensure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Deploy to Vercel
vercel --prod
```

**Or via Git:**
```bash
# Push to main branch (triggers auto-deploy)
git add .
git commit -m "Production release v1.0"
git push origin main
```

---

### Step 2: Verify Deployment

**Wait for build to complete** (typically 2-3 minutes)

**Check Build Logs:**
```bash
vercel logs
# Look for: ✓ Compiled successfully, ✓ Finalizing page optimization
```

**Verify Routes:**
```bash
# Health check
curl https://fitosys.alchemetryx.com/api/health

# Auth routes
curl https://fitosys.alchemetryx.com/api/coaches/profile

# Dashboard data
curl https://fitosys.alchemetryx.com/api/dashboard/data
```

---

### Step 3: End-to-End Testing

#### Test 1: Coach Signup → Login
- [ ] Visit `/signup`
- [ ] Create new coach account
- [ ] Verify email confirmation (if enabled)
- [ ] Login with credentials
- [ ] Verify redirect to `/dashboard`

#### Test 2: Create Program
- [ ] Navigate to `/dashboard/programs`
- [ ] Click "Create Program"
- [ ] Fill form (name, duration, price)
- [ ] Submit and verify program appears in list
- [ ] Copy intake link

#### Test 3: Client Onboarding (Full Flow)
- [ ] Open intake link in incognito window
- [ ] Fill intake form
- [ ] Complete Razorpay payment (use test card: `4111 1111 1111 1111`)
- [ ] Verify success page appears
- [ ] Check WhatsApp for welcome message
- [ ] Verify client appears in coach dashboard

#### Test 4: Weekly Check-in Cron
- [ ] Wait for Sunday 7PM IST OR manually trigger:
  ```bash
  curl -X POST "https://fitosys.alchemetryx.com/api/cron/checkins" \
    -H "Authorization: Bearer $CRON_SECRET"
  ```
- [ ] Verify WhatsApp check-in sent to active clients

#### Test 5: AI Summary Cron
- [ ] Wait for Monday 7AM IST OR manually trigger:
  ```bash
  curl -X POST "https://fitosys.alchemetryx.com/api/cron/summaries" \
    -H "Authorization: Bearer $CRON_SECRET"
  ```
- [ ] Verify AI summary generated
- [ ] Verify WhatsApp sent to coach

#### Test 6: Renewal Flow
- [ ] Create enrollment ending in 7 days
- [ ] Wait for renewal cron OR manually trigger:
  ```bash
  curl -X POST "https://fitosys.alchemetryx.com/api/cron/renewals" \
    -H "Authorization: Bearer $CRON_SECRET"
  ```
- [ ] Verify renewal reminder sent
- [ ] Click payment link
- [ ] Complete payment
- [ ] Verify enrollment extended

#### Test 7: Subscription Upgrade
- [ ] Navigate to `/dashboard/settings/billing`
- [ ] Click "Upgrade to Basic"
- [ ] Complete Razorpay payment
- [ ] Verify plan updated to Basic
- [ ] Verify client limit increased to 25

#### Test 8: Account Deletion
- [ ] Navigate to `/dashboard/settings`
- [ ] Click "Delete Account"
- [ ] Confirm with email
- [ ] Verify account marked as `pending_deletion`
- [ ] Verify 30-day grace period starts

---

### Step 4: Monitor & Verify

**First 24 Hours:**

- [ ] Monitor Vercel Function logs for errors
- [ ] Check Supabase logs for database errors
- [ ] Verify webhook delivery in Razorpay dashboard
- [ ] Check WhatsApp delivery rates in Meta Business Manager
- [ ] Monitor Upstash Redis for rate limit triggers

**Monitoring Commands:**
```bash
# Check Vercel function errors
vercel logs --follow

# Check Supabase logs (via Dashboard)
# Supabase Dashboard → Logs → Query Logs

# Check Razorpay webhook delivery
# Razorpay Dashboard → Settings → Webhooks → Delivery Logs

# Check WhatsApp message delivery
# Meta Business Manager → WhatsApp → Message Templates → Insights
```

---

## Rollback Plan

**If Critical Issues Found:**

### Option 1: Rollback to Previous Deployment
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-name]
```

### Option 2: Disable Cron Jobs
```bash
# Temporarily disable crons in Vercel Dashboard
# Vercel → Settings → Cron Jobs → Disable all
```

### Option 3: Emergency Maintenance Mode
```bash
# Add to Vercel Environment Variables
MAINTENANCE_MODE=true

# Deploy immediately
vercel --prod
```

---

## Post-Deployment Checklist

### Day 1 (Launch Day)
- [ ] All tests pass
- [ ] No critical errors in logs
- [ ] First webhook received successfully
- [ ] First WhatsApp message delivered

### Week 1
- [ ] Monitor daily active users
- [ ] Track payment success rate
- [ ] Verify all cron jobs executed
- [ ] Check WhatsApp template delivery rates
- [ ] Review error logs daily

### Week 2
- [ ] Analyze user feedback
- [ ] Review AI summary quality
- [ ] Check renewal conversion rate
- [ ] Plan Phase 2 features

---

## Success Metrics

**Launch Week KPIs:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | >99% | Vercel Analytics |
| Payment Success Rate | >95% | Razorpay Dashboard |
| WhatsApp Delivery Rate | >90% | Meta Business Manager |
| Page Load Time | <2s | Vercel Analytics |
| API Error Rate | <1% | Vercel Function Logs |
| Cron Job Success | 100% | Vercel Cron Logs |

---

## Emergency Contacts

| Role | Contact | Escalation |
|------|---------|------------|
| Development | [Your Email] | Immediate |
| Razorpay Support | support@razorpay.com | 24-48 hours |
| Supabase Support | support@supabase.com | 24-48 hours |
| Meta Business Support | Via Business Manager | 24-48 hours |
| Vercel Support | support@vercel.com | 24-48 hours |

---

## Sign-Off

**Deployment Approved By:**

- [ ] Development Lead: _________________ Date: _______
- [ ] QA Lead: _________________ Date: _______
- [ ] Product Owner: _________________ Date: _______

**Production Launch Date:** _________________

**Launch Time:** _________________ (IST)

---

**Status:** ✅ **READY FOR PRODUCTION**

**Next Step:** Execute deployment checklist above.
