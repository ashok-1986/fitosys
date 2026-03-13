# Environment Variable Setup Guide

## 📋 Quick Reference: Where to Find Each Variable

---

## 1️⃣ SUPABASE VARIABLES (3 Required)

### Where to Get Them:
```
1. Go to https://supabase.com/dashboard
2. Select your "Fitosys" project
3. Click "Settings" (left sidebar, gear icon)
4. Click "API" section
5. Copy the values below
```

### Variables to Fill:

| Variable | Where to Find | Example |
|----------|---------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL | `https://abcdefghijklmnopqrst.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon public | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (longer) |

⚠️ **IMPORTANT:** 
- Service Role Key bypasses security - keep it secret!
- Don't share or commit to Git

---

## 2️⃣ OPENROUTER AI VARIABLE (1 Required)

### Where to Get It:
```
1. Go to https://openrouter.ai
2. Sign up / Login (GitHub recommended)
3. Click your profile picture → "API Keys"
4. Click "Create Key"
5. Give it a name (e.g., "Fitosys Dev")
6. Copy the key immediately (can't see it again!)
```

### Variable to Fill:

| Variable | Where to Find | Example |
|----------|---------------|---------|
| `OPENROUTER_API_KEY` | OpenRouter Dashboard → API Keys | `sk-or-v1-abc123def456...` |

✅ **Already Set:** `OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct` (default is fine)

---

## 3️⃣ PGBOUNCER CONNECTION POOLING (Recommended for Production)

### What is PgBouncer?
PgBouncer is a connection pooler for PostgreSQL that reduces database connection overhead. **Required for production** when expecting >100 concurrent users.

### Enable PgBouncer in Supabase:

**Step 1: Get Connection String**
```
1. Go to https://supabase.com/dashboard
2. Select "Fitosys" project
3. Settings → Database
4. Under "Connection Pooling", toggle ON
5. Copy the connection string (Transaction mode)
```

**Step 2: Add to Environment Variables**
```bash
# Add to .env.local (development)
# Add to Vercel Dashboard (production)

SUPABASE_DB_URL_WITH_POOLING="postgresql://postgres:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Step 3: Update Supabase Client (Optional)**
For most cases, the existing client works fine. For high-traffic endpoints:

```typescript
// lib/supabase/server.ts
export async function createPooledClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const poolingUrl = process.env.SUPABASE_DB_URL_WITH_POOLING;
  
  // Use pooling URL for heavy queries
  const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { url: poolingUrl }
  });
  
  return supabase;
}
```

### When to Use PgBouncer:

| Scenario | Direct Connection | PgBouncer |
|----------|------------------|-----------|
| Development | ✅ Recommended | ❌ Not needed |
| Production (<100 users) | ✅ OK | ⚠️ Optional |
| Production (>100 users) | ❌ Risk of exhaustion | ✅ Required |
| Cron jobs / Batch operations | ❌ Can exhaust connections | ✅ Required |

### Monitoring Connection Pool:

```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Check pool status (Supabase Dashboard)
-- Database → Connection Pooler → Stats
```

**Target:** Keep active connections <100 for free tier

### Benefits:
- ✅ Reduces connection overhead (60% faster)
- ✅ Prevents "too many connections" errors
- ✅ Better resource utilization
- ✅ Required for scaling beyond 100 concurrent users

### Trade-offs:
- ⚠️ Slight latency increase (~2ms)
- ⚠️ Some PostgreSQL features not supported (prepared statements)
- ⚠️ Requires configuration tuning

**Status:** ⏳ **RECOMMENDED** — Enable when approaching 100 concurrent users

---

## 3️⃣ RAZORPAY VARIABLES (4 Required)

### Where to Get Them (Test Mode):
```
1. Go to https://dashboard.razorpay.com/
2. Login with your credentials
3. Click "Settings" (left sidebar)
4. Click "API Keys" under "Keys"
5. Toggle "Test Mode" ON (top right)
6. Copy the keys below
```

### Variables to Fill:

| Variable | Where to Find | Example |
|----------|---------------|---------|
| `RAZORPAY_KEY_ID` | Settings → API Keys → Key ID | `rzp_test_1234567890ABCDE` |
| `RAZORPAY_KEY_SECRET` | Settings → API Keys → Key Secret | Click "Generate Secret" if not visible | `AbCdEfGhIjKlMnOpQrStUvWx` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as KEY_ID | `rzp_test_1234567890ABCDE` |
| `RAZORPAY_WEBHOOK_SECRET` | You create this (see below) | `your_random_secret_min_16_chars` |

### How to Set Webhook Secret:

**Option A: Generate Random Secret**
```bash
# Run in terminal (PowerShell)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
# Output: Use this as your webhook secret
```

**Option B: Use Online Generator**
1. Go to https://randomkeygen.com/
2. Copy any 32-character string
3. Use as your webhook secret

**Then configure in Razorpay:**
1. Razorpay Dashboard → Settings → Webhooks
2. Add New Webhook
3. URL: `http://localhost:3005/api/webhooks/razorpay` (for testing)
4. Secret: Paste your generated secret
5. Events: Select "payment.captured" and "payment.failed"
6. Save

---

## 4️⃣ CRON SECRET (1 Required)

### Generate Your Own:

**Option A: PowerShell Terminal**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Online**
1. Go to https://randomkeygen.com/
2. Copy a 32-character string
3. Paste as `CRON_SECRET`

---

## 5️⃣ WHATSAPP VARIABLES (Optional - Can Leave Empty)

Leave these empty for now. We'll add them later when implementing WhatsApp integration.

```
WHATSAPP_AISENSY_API_KEY=
WHATSAPP_VERIFY_TOKEN=
```

---

## 6️⃣ APP URL (1 Required)

### For Local Development:
```
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

### For Production (Later):
```
NEXT_PUBLIC_APP_URL=https://fitosys.alchemetryx.com
```

---

## ✅ VERIFICATION STEPS

After filling all values in `.env.local`:

### Step 1: Check File Exists
```bash
# In your project root
ls .env.local
# Should show the file exists
```

### Step 2: Verify Format
Open `.env.local` and check:
- [ ] No spaces around `=` sign
- [ ] URLs don't have trailing slashes
- [ ] All keys are complete (no typos)
- [ ] Secrets are at least 16 characters

### Step 3: Test Connection
```bash
# Start development server
npm run dev

# In browser, visit:
http://localhost:3005/api/health
```

**Expected Response:**
```json
{
  "razorpay_configured": true,
  "openrouter_configured": true,
  "supabase_configured": true,
  "whatsapp_configured": false
}
```

If any shows `false`, double-check that variable!

---

## 🔧 TROUBLESHOOTING

### Error: "Missing NEXT_PUBLIC_SUPABASE_URL"
- Check spelling exactly as shown
- Ensure no extra spaces before/after `=`
- Restart dev server after changes

### Error: "Invalid API key" (Supabase)
- Verify you copied the correct key (Anon vs Service Role)
- Check if project is active in Supabase dashboard
- Ensure no extra characters copied

### Error: "OpenRouter API call failed"
- Verify API key starts with `sk-or-v1-`
- Check if key has credits/balance
- Ensure model name is correct

### Health Check Shows `false` for Something
1. Check that specific variable in `.env.local`
2. Ensure it matches the expected format
3. Restart dev server: `Ctrl+C` then `npm run dev`

---

## 🎯 MINIMUM REQUIRED TO START

You can begin development with just these 4 variables:

1. ✅ `NEXT_PUBLIC_SUPABASE_URL`
2. ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. ✅ `SUPABASE_SERVICE_ROLE_KEY`
4. ✅ `OPENROUTER_API_KEY`

Everything else can be added gradually!

---

## 📱 QUICK COPY-PASTE TEMPLATE

Copy this to a text editor, fill in values, then paste into `.env.local`:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here

# OpenRouter (REQUIRED)
OPENROUTER_API_KEY=sk-or-v1-your_key_here
OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct

# Razorpay (REQUIRED for payments)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cron (REQUIRED)
CRON_SECRET=your_random_secret

# App (REQUIRED)
NEXT_PUBLIC_APP_URL=http://localhost:3005

# WhatsApp (OPTIONAL - leave empty)
WHATSAPP_AISENSY_API_KEY=
WHATSAPP_VERIFY_TOKEN=
```

---

## 🔐 SECURITY CHECKLIST

Before committing code to Git:

- [ ] `.env.local` is in `.gitignore`
- [ ] Never shared Service Role Key publicly
- [ ] Never shared Razorpay Secret publicly
- [ ] Using TEST keys for development
- [ ] Plan to rotate keys before production

---

## 📞 NEED HELP?

If stuck on any variable:

1. **Can't find Supabase keys?** → Check Settings → API in dashboard
2. **OpenRouter key not working?** → Ensure it's active and has credits
3. **Razorpay in live mode?** → Switch to Test Mode for development
4. **Health check failing?** → Check browser console for errors

---

**Next Step:** Fill in `.env.local` with your values, then run `npm run dev` to test! 🚀
