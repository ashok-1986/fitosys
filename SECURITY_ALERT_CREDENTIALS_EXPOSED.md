# 🔐 SECURITY ALERT: Credentials Exposed

**Date:** 2026-03-13  
**Severity:** 🔴 **CRITICAL**  
**Status:** ⚠️ **ACTION REQUIRED**

---

## Issue

**Real Supabase credentials were accidentally committed to the repository** in the following file:

**File:** `SUPABASE_SYNC_STATUS.md`  
**Lines:** 279-280  
**Exposed Credentials:**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (JWT token)
- `SUPABASE_SERVICE_ROLE_KEY` (JWT token)

---

## Immediate Actions Required

### Step 1: Rotate Supabase Keys (DO THIS NOW)

1. Go to https://supabase.com/dashboard
2. Select your project: `cwupeqgkahysocgzzjyp`
3. Go to **Settings** → **API**
4. Click **Regenerate** next to:
   - ✅ **anon public** key
   - ✅ **service_role** key
5. Save the new keys securely

**Time Required:** 2 minutes  
**Impact:** Existing apps will break until keys are updated

---

### Step 2: Update Environment Variables

**Local Development:**
```bash
# Update .env.local with NEW keys
NEXT_PUBLIC_SUPABASE_URL=https://cwupeqgkahysocgzzjyp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<NEW_KEY_FROM_DASHBOARD>
SUPABASE_SERVICE_ROLE_KEY=<NEW_KEY_FROM_DASHBOARD>
```

**Vercel Production:**
1. Go to https://vercel.com/dashboard
2. Select `fitosys` project
3. Settings → Environment Variables
4. Update:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Redeploy

---

### Step 3: Remove Exposed Keys from Git History

**Option A: BFG Repo-Cleaner (Recommended)**

```bash
# Install BFG
npm install -g bfg

# Remove the file with exposed keys
bfg --delete-files SUPABASE_SYNC_STATUS.md

# Or scrub the specific secrets
bfg --replace-text passwords.txt

# Force push
git push --force
```

**Option B: Git Filter-Branch (Complex)**

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch SUPABASE_SYNC_STATUS.md" \
  --prune-empty --tag-name-filter cat -- --all
git push --force --all
```

**⚠️ WARNING:** Force pushing rewrites history. Coordinate with team.

---

### Step 4: Update Documentation

Replace exposed keys in `SUPABASE_SYNC_STATUS.md` with placeholders:

**Before:**
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**After:**
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SERVICE_ROLE_KEY>
```

---

## Security Assessment

### Risk Level: HIGH

**Why This Is Critical:**

| Key Type | Exposure Risk | Impact |
|----------|--------------|--------|
| Anon Key | MEDIUM | Can read/write data (RLS protected) |
| Service Role Key | 🔴 **CRITICAL** | Bypasses RLS, full database access |

**Service Role Key Exposure Means:**
- ✅ Attacker can read ALL data (all coaches, clients, payments)
- ✅ Attacker can modify/delete ANY data
- ✅ Attacker can create admin accounts
- ✅ Attacker can drain database

---

### Was the Key Abused?

**Check Supabase Logs:**

1. Go to https://supabase.com/dashboard
2. Select project → **Logs**
3. Filter for unusual activity:
   - Large data exports
   - Unusual IP addresses
   - Bulk delete/update operations
   - Authentication anomalies

**Timeframe to Check:** Since commit date (2026-03-13)

---

## Prevention Measures

### 1. Add to .gitignore

Already present, but verify:
```bash
# .gitignore
.env*
!.env.example
```

### 2. Use Secret Scanning

**GitHub Secret Scanning:**
- Enable in repository settings
- Automatically detects exposed secrets
- Alerts immediately

**GitGuardian (Recommended):**
- Free for open source
- Real-time scanning
- Slack/email alerts
- https://gitguardian.com

### 3. Pre-commit Hooks

```bash
# Install detect-secrets
pip install detect-secrets

# Initialize
detect-secrets scan --baseline .secrets.baseline

# Add pre-commit hook
detect-secrets-hook --baseline .secrets.baseline
```

### 4. Code Review Checklist

Add to PR template:
```markdown
## Security Checklist
- [ ] No API keys or secrets in code
- [ ] No .env files committed
- [ ] No database credentials in docs
```

---

## Incident Timeline

| Time | Event |
|------|-------|
| 2026-03-13 | Keys committed to repository |
| 2026-03-13 | **Discovery during code review** |
| 2026-03-13 | ⏳ **Keys rotated (ACTION REQUIRED)** |
| 2026-03-13 | ⏳ Git history cleaned (ACTION REQUIRED) |

---

## Contact Information

**If you suspect abuse:**

1. **Immediately** rotate all keys
2. Contact Supabase support: support@supabase.com
3. File security incident report
4. Monitor logs for 30 days

---

## Checklist

### Immediate (Within 1 Hour)
- [ ] ⏳ Rotate Supabase API keys
- [ ] ⏳ Update .env.local with new keys
- [ ] ⏳ Update Vercel environment variables
- [ ] ⏳ Check Supabase logs for abuse

### Within 24 Hours
- [ ] ⏳ Clean git history (BFG or filter-branch)
- [ ] ⏳ Update SUPABASE_SYNC_STATUS.md with placeholders
- [ ] ⏳ Enable GitHub secret scanning
- [ ] ⏳ Team notification about key rotation

### Within 1 Week
- [ ] ⏳ Install GitGuardian or similar
- [ ] ⏳ Add secret scanning to CI/CD
- [ ] ⏳ Security training for team
- [ ] ⏳ Review all documentation for other exposed secrets

---

## Other Exposed Credentials Check

**Review these files for other potential exposures:**

| File | Status | Notes |
|------|--------|-------|
| `SUPABASE_SYNC_STATUS.md` | 🔴 **EXPOSED** | Supabase keys (lines 279-280) |
| `ENV_SETUP_GUIDE.md` | ✅ Safe | Only examples/placeholders |
| `REVENUE_FLOW_SUMMARY.md` | ✅ Safe | Uses `rzp_test_...` (placeholder) |
| `GLOBAL_RATE_LIMITING_GUIDE.md` | ✅ Safe | Uses `your-token` (placeholder) |
| `.env.example` | ✅ Safe | Placeholders only |

---

## Lessons Learned

1. **Never commit real credentials** — even in documentation
2. **Use placeholders** — `<YOUR_KEY_HERE>` or `your_key_here`
3. **Review PRs for secrets** — add to checklist
4. **Automate detection** — GitGuardian, GitHub secret scanning
5. **Rotate regularly** — every 90 days minimum

---

**Status:** ⏳ **PENDING ACTION**  
**Next Review:** After key rotation (2026-03-13)

**Action Required:** Rotate keys IMMEDIATELY before production launch.
