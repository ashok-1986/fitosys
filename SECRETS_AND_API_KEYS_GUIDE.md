# 🔐 Secrets and API Keys - DO NOT COMMIT

**Status:** ⚠️ **CRITICAL FOR SECURITY**

---

## 🚫 Never Commit These Files

### Environment Files
- `.env`
- `.env.local`
- `.env.development.local`
- `.env.test.local`
- `.env.production.local`

### Key Files
- `*.pem` (SSL certificates)
- `*.key` (Private keys)
- `*.p12` / `*.pfx` (Certificate bundles)

### Database Files
- `*.db` / `*.sqlite` (Local databases)
- `dump.sql` (Database exports with data)

---

## ✅ Safe to Commit

### Example Files (With Placeholders)
- `.env.example` — Template with `<YOUR_KEY_HERE>` placeholders
- `.env.template` — Same as above

### Public Configuration
- `next.config.js` — No secrets
- `package.json` — No secrets
- `tsconfig.json` — No secrets

---

## 🔍 How to Check for Exposed Secrets

### Before Committing

```bash
# Check what will be committed
git status

# Preview staged changes
git diff --cached

# Search for common secret patterns
grep -r "rzp_live_" . --exclude-dir=.git
grep -r "sk-or-v1-" . --exclude-dir=.git
grep -r "eyJhbG" . --exclude-dir=.git  # JWT tokens
grep -r "SUPABASE_SERVICE_ROLE" . --exclude-dir=.git
```

### After Committing (Damage Control)

```bash
# Check last commit for secrets
git show HEAD --name-only

# Search entire history
git log -p --all | grep -E "(rzp_live_|sk-or-v1-|eyJhbG)"
```

---

## 🛡️ Prevention Tools

### 1. GitHub Secret Scanning (Enable This!)

**Steps:**
1. Go to repository Settings
2. Security → Secret scanning
3. Enable "Push protection"
4. Enable "Alerts"

**Free for public repositories**

### 2. GitGuardian (Recommended)

**Install:**
```bash
# Global installation
npm install -g gitguardian-cli

# Or use npx
npx gitguardian-cli
```

**Usage:**
```bash
# Scan repository
gg scan

# Scan specific file
gg scan path/to/file.md
```

**Get API Key:** https://dashboard.gitguardian.com

### 3. Pre-commit Hook

**Install:**
```bash
npm install -g detect-secrets
```

**Initialize:**
```bash
cd fitosys
detect-secrets scan --baseline .secrets.baseline
```

**Add to .git/hooks/pre-commit:**
```bash
#!/bin/bash
detect-secrets-hook --baseline .secrets.baseline
if [ $? -ne 0 ]; then
  echo "❌ Secrets detected! Commit aborted."
  exit 1
fi
```

---

## 📋 Secret Patterns to Watch

### Razorpay
- ❌ `rzp_live_XXXXXXXXXX` (Live key)
- ⚠️ `rzp_test_XXXXXXXXXX` (Test key - still should not commit)
- ✅ `rzp_test_your_key_here` (Placeholder - OK)

### OpenRouter
- ❌ `sk-or-v1-XXXXXXXXXX` (Real key)
- ✅ `sk-or-v1-your_key_here` (Placeholder - OK)

### Supabase
- ❌ `eyJhbGciOiJIUzI1NiIs...` (Real JWT token)
- ✅ `<YOUR_ANON_KEY>` (Placeholder - OK)

### Upstash Redis
- ❌ `upstash_redis_token_XXXXXXXXXX`
- ✅ `<YOUR_REDIS_TOKEN>` (Placeholder - OK)

### WhatsApp/Meta
- ❌ `EAABXXXXXXXXXX` (Real access token)
- ✅ `<YOUR_WHATSAPP_TOKEN>` (Placeholder - OK)

---

## 🚨 If You Accidentally Commit Secrets

### Step 1: Assess Exposure

```bash
# When was it committed?
git log -p --all | grep "your_secret_pattern"

# How many commits ago?
git log --oneline --all | head -20
```

### Step 2: Rotate the Secret IMMEDIATELY

**For Each Exposed Secret:**
1. Go to the service dashboard
2. Regenerate the key/token
3. Update `.env.local` with new key
4. Update Vercel environment variables
5. Test that app still works

### Step 3: Remove from Git History

**Option A: BFG Repo-Cleaner (Fastest)**

```bash
# Install
npm install -g bfg

# Remove file with secrets
bfg --delete-files .env

# Or remove specific secret
echo "YOUR_SECRET_HERE" > passwords.txt
bfg --replace-text passwords.txt

# Force push
git push --force
```

**Option B: Git Filter-Branch (Slower but built-in)**

```bash
# Remove specific file from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push --force --all
```

### Step 4: Notify Team

**Message Template:**
```
🚨 SECURITY ALERT: Exposed Credentials

Hi Team,

API keys were accidentally committed to the repository in commit [HASH].

Actions taken:
✅ Keys rotated
✅ Git history cleaned
✅ Environment variables updated

What you need to do:
1. Pull latest changes: git pull --force
2. Update your .env.local with new keys from Vercel
3. Run: npm run dev to verify

Exposed:
- Supabase Service Role Key
- [Other keys]

Timeframe: [DATE] to [DATE]

Contact: [Security Lead]
```

---

## 🔒 Best Practices

### 1. Use Environment Variables

**✅ Good:**
```typescript
const apiKey = process.env.OPENROUTER_API_KEY;
```

**❌ Bad:**
```typescript
const apiKey = "sk-or-v1-XXXXXXXXXX";
```

### 2. Use .env.example as Template

**✅ Good (`.env.example`):**
```bash
OPENROUTER_API_KEY=sk-or-v1-your_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
```

**❌ Bad (`.env.local` committed):**
```bash
OPENROUTER_API_KEY=sk-or-v1-abc123def456...
SUPABASE_URL=https://cwupeqgkahysocgzzjyp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 3. Code Review Checklist

Add to your PR template:

```markdown
## Security Checklist
- [ ] No `.env` files committed
- [ ] No API keys in code
- [ ] No JWT tokens in documentation
- [ ] No database credentials
- [ ] All secrets use environment variables
```

### 4. Regular Audits

**Monthly:**
```bash
# Scan for secrets
git log -p --all | grep -E "(rzp_|sk-or-|eyJ)" | head -20

# Check .gitignore
cat .gitignore | grep -v "^#" | grep -v "^$"
```

---

## 📚 Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [GitGuardian Documentation](https://docs.gitguardian.com/)
- [Detect Secrets (Python)](https://github.com/Yelp/detect-secrets)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## Current Status

**Last Audit:** 2026-03-13  
**Exposed Secrets Found:** 1 (Supabase keys in `SUPABASE_SYNC_STATUS.md`)  
**Status:** ⚠️ **FIXED** - Keys replaced with placeholders  

**Action Required:**
- ⏳ Rotate Supabase keys (CRITICAL)
- ⏳ Enable GitHub secret scanning
- ⏳ Install GitGuardian for ongoing monitoring

---

**Remember:** Once a secret is in git history, it's considered compromised. Always rotate!
