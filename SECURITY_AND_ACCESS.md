# Fitosys — Security & Access Control Architecture

**Version:** 1.0  
**Last Updated:** 2026-06-05  
**Classification:** Internal — Infrastructure Security Document

---

## Table of Contents

1. [Security Posture Overview](#1-security-posture-overview)
2. [Authentication Model](#2-authentication-model)
3. [Authorization & Access Control](#3-authorization--access-control)
4. [Access Control Layers (Defense in Depth)](#4-access-control-layers-defense-in-depth)
5. [Network Security & HTTP Headers](#5-network-security--http-headers)
6. [API Security](#6-api-security)
7. [Database Security](#7-database-security)
8. [Payment Security](#8-payment-security)
9. [Webhook Security](#9-webhook-security)
10. [Secrets Management](#10-secrets-management)
11. [Data Protection & Privacy](#11-data-protection--privacy)
12. [Logging & Monitoring](#12-logging--monitoring)
13. [Incident Response Plan](#13-incident-response-plan)
14. [Compliance Matrix](#14-compliance-matrix)
15. [Known Gaps & Roadmap](#15-known-gaps--roadmap)

---

## 1. Security Posture Overview

Fitosys uses a **defense-in-depth** architecture with seven independent security layers:

```
┌─────────────────────────────────────────────┐
│  Layer 1: HTTP Security Headers (CSP, HSTS) │
├─────────────────────────────────────────────┤
│  Layer 2: Rate Limiting (Upstash Redis)     │
├─────────────────────────────────────────────┤
│  Layer 3: Middleware (Route Protection)     │
├─────────────────────────────────────────────┤
│  Layer 4: Server-Side Auth (requireAuth)    │
├─────────────────────────────────────────────┤
│  Layer 5: Row Level Security (Supabase RLS) │
├─────────────────────────────────────────────┤
│  Layer 6: Input Validation (Zod Schemas)    │
├─────────────────────────────────────────────┤
│  Layer 7: Audit Logging (Pino + Tables)     │
└─────────────────────────────────────────────┘
```

**Tech Stack Summary:**

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 16 (App Router) |
| Authentication | Supabase Auth (email/password + Google OAuth) |
| Database | Supabase (PostgreSQL 17) with RLS |
| Rate Limiting | Upstash Redis + @upstash/ratelimit |
| Payment Gateway | Razorpay (HMAC-SHA256 verification) |
| Webhook Security | HMAC-SHA256 with timing-safe comparison |
| Logging | Pino (structured JSON) |
| Input Validation | Zod 4 |
| Hosting | Vercel (SOC 2 compliant) |

---

## 2. Authentication Model

### 2.1 Supported Methods

| Method | Mechanism | Flow |
|--------|-----------|------|
| Email + Password | Supabase Auth | `loginAction` → rate limit → Zod validate → `supabase.auth.signInWithPassword()` |
| Signup | Supabase Auth | `signupAction` → rate limit → Zod validate (complexity rules) → `supabase.auth.signUp()` → coach DB insert |
| Google OAuth | Supabase Auth | `googleSignInAction` → whitelist redirect validation → `supabase.auth.signInWithOAuth({ provider: "google" })` |
| Session | Supabase SSR | Cookie-based session via `@supabase/ssr` with `createServerClient` |

### 2.2 Password Policy

- **Minimum length:** 8 characters
- **Required:** uppercase letter, lowercase letter, number
- **Validation location:** `signupSchema` in `lib/validation.ts:32-35`
- **Transmission:** HTTPS only, server-side form handling via Server Actions
- **Storage:** Supabase Auth handles bcrypt hashing (not in application code)

### 2.3 Session Management

- **Token type:** Supabase JWT (access + refresh token)
- **Storage:** HTTP cookies via `@supabase/ssr`
- **Refresh:** Automatic by Supabase SSR client (cookie-based)
- **Server access:** `createClient()` reads cookies via `next/headers`
- **Expiry:** Managed by Supabase Auth (default: 1 hour access token, refresh token rotates)

### 2.4 Rate Limiting on Auth

| Action | Limit | Window | Window Reset |
|--------|-------|--------|-------------|
| Login attempts | 10 | 15 minutes | On rate limit hit |
| Signup attempts | 3 | 60 minutes | On rate limit hit |

Both enforced before Supabase Auth call — protects upstream provider from brute force.

### 2.5 OAuth Redirect Whitelist

See `lib/auth/getAllowedRedirectUrl.ts`:

```typescript
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,  // production
  "http://localhost:3000",          // local dev
];
```

OAuth callback URLs are parsed and origin-checked against the whitelist. Invalid URLs fall back to `NEXT_PUBLIC_APP_URL/dashboard`.

---

## 3. Authorization & Access Control

### 3.1 Authorization Flow (End-to-End)

```
Request → Middleware → Route Handler → Server-Side Auth → RLS → Data
   │          │              │               │             │
   │     Checks session  Checks auth     Verifies coach  DB enforces
   │     + redirects     for API routes  owns the row    coach scoping
   │
   └─ Third-party services bypass middleware
```

### 3.2 Middleware Protection (`middleware.ts`)

The Next.js middleware runs on every request **except** excluded paths.

**Protected routes** (redirect to `/login` if unauthenticated):

| Route Pattern | Description |
|--------------|-------------|
| `/dashboard` | Main dashboard |
| `/clients` | Client management |
| `/programs` | Program management |
| `/pulse` | Check-in pulse view |
| `/payments` | Payment dashboard |
| `/settings` | Coach settings |

**Public routes** (redirect to `/dashboard` if authenticated):

| Route | Redirect |
|-------|----------|
| `/` | → `/dashboard` |
| `/login` | → `/dashboard` |
| `/signup` | → `/dashboard` |

**Excluded from middleware** (no auth check):

| Pattern | Reason |
|---------|--------|
| `_next/static` | Static assets |
| `_next/image` | Image optimization |
| `favicon.ico` | Browser favicon |
| `api/v1/public` | Public API endpoints |
| `api/v1/webhook` | Incoming webhooks |
| `api/webhook` | Alternative webhook path |
| `api/cron` | Vercel cron jobs |

### 3.3 Server-Side Auth Verification

Four helpers enforce authentication at the API/Server Action level:

| Helper | File | Usage |
|--------|------|-------|
| `requireAuth()` | `lib/auth/requireAuth.ts` | API route handler — returns 401 if no user |
| `requireCronSecret()` | `lib/auth/requireCronSecret.ts` | Cron routes — validates `x-cron-secret` header |
| `getAuthenticatedCoach()` | `lib/auth.ts` | Returns `{ coachId, supabase }` or 401 |
| `getAllowedRedirectUrl()` | `lib/auth/getAllowedRedirectUrl.ts` | OAuth redirect whitelist |

### 3.4 Row Level Security (RLS)

**All 12 database tables have RLS enabled.** Each row belongs to a coach (`coach_id`) and policies enforce that users can only access their own data.

| Table | RLS Policy Assertion | Scope |
|-------|---------------------|-------|
| `coaches` | `id = auth.uid()` | Can only read/update own profile |
| `programs` | `coach_id = auth.uid()` | CRUD scoped to own programs |
| `clients` | `coach_id = auth.uid()` | CRUD scoped to own clients |
| `enrollments` | `coach_id = auth.uid()` | CRUD scoped to own enrollments |
| `checkins` | `coach_id = auth.uid()` | CRUD scoped to own check-ins |
| `ai_summaries` | `coach_id = auth.uid()` | CRUD scoped to own summaries |
| `payments` | `coach_id = auth.uid()` | CRUD scoped to own payments |
| `whatsapp_log` | `coach_id = auth.uid()` | SELECT/INSERT scoped |
| `subscriptions` | `coach_id = auth.uid()` | Full access scoped |
| `gst_invoices` | `coach_id = auth.uid()` | Full access scoped |
| `checkin_templates` | `coach_id = auth.uid()` | Full access scoped |
| `plan_grace_periods` | `coach_id = auth.uid()` | Scoped access |

**Important — Service Role bypasses RLS:**

Two client creation patterns exist:

| Client | Key | RLS | Use |
|--------|-----|-----|-----|
| `createClient()` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Respects RLS | All user-facing operations |
| `createServiceClient()` | `SUPABASE_SERVICE_ROLE_KEY` | **Bypasses RLS** | Server-only: cron jobs, webhooks, admin tasks |

The service client is used only in server-side contexts that have already been authenticated via `requireCronSecret()` or `requireAuth()`.

---

## 4. Access Control Layers (Defense in Depth)

### 4.1 Layer Architecture

```
Internet
    │
    ▼
┌──────────────────┐
│  Vercel Edge     │  ← DDoS protection, TLS termination, CDN caching
│  (CDN + WAF)     │
└──────────────────┘
    │
    ▼
┌──────────────────┐
│  Next.js App     │  ← HTTP security headers (CSP, HSTS, XFO, etc.)
│  (Middleware)    │  ← Route protection (auth check, redirect)
│  (Server Actions)│  ← Rate limiting, Zod validation
│  (API Routes)    │
└──────────────────┘
    │
    ▼
┌──────────────────┐
│  Supabase        │  ← JWT verification (auth.uid)
│  (PostgreSQL)    │  ← Row Level Security (coach_id scoping)
│                  │  ← Database constraints (CHECK, UNIQUE)
└──────────────────┘
```

### 4.2 Data Access Matrix

| Role | Own Profile | Own Clients/Programs | Payment Data | AI Summaries | WhatsApp Logs |
|------|-------------|---------------------|-------------|-------------|---------------|
| **Coach (authenticated)** | SELECT, UPDATE | SELECT, INSERT, UPDATE, DELETE | SELECT, INSERT | SELECT, INSERT | SELECT, INSERT |
| **Anonymous user** | — | — | — | — | — |
| **Service role (cron/webhook)** | Full access (bypasses RLS) | Full access | Full access | Full access | Full access |

### 4.3 Horizontal Access Isolation

All data access is scoped by `coach_id = auth.uid()`. This ensures:

- **Coach A cannot see Coach B's clients** — RLS enforces `coach_id = auth.uid()`
- **Coach A cannot see Coach B's payments** — same RLS pattern
- **Coach A cannot modify Coach B's programs** — same RLS pattern

The pattern is consistent across all 12 tables: every table has a `coach_id` column and RLS policy checking `coach_id = auth.uid()`.

---

## 5. Network Security & HTTP Headers

### 5.1 Content Security Policy

Configured in `next.config.ts:31-34`:

| Directive | Sources | Purpose |
|-----------|---------|---------|
| `default-src` | `'self'` | Baseline — all resources from same origin |
| `base-uri` | `'self'` | Prevent `<base>` injection |
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval' checkout.razorpay.com connect.facebook.net` | Razorpay checkout SDK + Facebook SDK for WA migration |
| `style-src` | `'self' 'unsafe-inline' fonts.googleapis.com` | Google Fonts |
| `font-src` | `'self' data: fonts.gstatic.com` | Font loading |
| `img-src` | `'self' blob: data: *.supabase.co *.razorpay.com` | DB images, payment receipts |
| `connect-src` | `'self' *.supabase.co wss://*.supabase.co api.razorpay.com checkout.razorpay.com graph.facebook.com connect.facebook.net` | API calls, WebSocket, payments, WA |
| `frame-src` | `'self' api.razorpay.com checkout.razorpay.com` | Payment iframe |

**Known tradeoff & Remediation:** `'unsafe-inline'` and `'unsafe-eval'` are currently used for Razorpay checkout SDK, which weakens XSS protections.
1. Research Razorpay checkout SDK support for nonce-based CSP. If supported, change the `script-src` entry to a nonce-based approach.
2. If nonce support is not immediately available, a concrete migration deadline must be set (see section 15.1) and tracked as a remediation task.
3. **Interim Mitigation:** Strengthen XSS defenses by mandating strict input sanitization and output encoding across code paths that interact with the payment widget, and add server-side CSP-report-only monitoring to capture violations.

### 5.2 Other Security Headers

| Header | Value | Protection |
|--------|-------|-----------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | HTTPS enforcement (2 years) |
| `X-Frame-Options` | `DENY` | Clickjacking prevention |
| `X-Content-Type-Options` | `nosniff` | MIME type sniffing prevention |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer leakage prevention |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Sensor API restrictions |
| `Cache-Control` | `public, max-age=0, must-revalidate` | Cache freshness |

### 5.3 TLS/SSL

- TLS termination at Vercel Edge (automated)
- Auto-renewing TLS certificates via Vercel
- Custom domain: `fitosys.alchemetryx.com` (Hostinger DNS)
- HSTS preload ready

---

## 6. API Security

### 6.1 Rate Limiting Configuration

Seven independent rate limiters backed by Upstash Redis. All use **sliding window** algorithm.

| Limiter | Limit | Window | Prefix | Protected Operations |
|---------|-------|--------|--------|---------------------|
| `apiRateLimit` | 100 | 1 minute | `rl:api` | General API endpoints |
| `authenticatedRateLimit` | 300 | 1 minute | `rl:auth` | Authenticated user requests |
| `sensitiveRateLimit` | 10 | 1 minute | `rl:sensitive` | Payment verification |
| `intakeRateLimit` | 5 | 10 minutes | `rl:intake` | Client intake form |
| `loginRateLimit` | 10 | 15 minutes | `rl:login` | Login attempts |
| `signupRateLimit` | 3 | 60 minutes | `rl:signup` | New account creation |
| `razorpayWebhookRateLimit` | 30 | 1 minute | `rl:razorpay` | Razorpay webhooks |
| `whatsappWebhookRateLimit` | 60 | 1 minute | `rl:whatsapp` | WhatsApp webhooks |

### 6.2 Rate Limiting Enforcement Points

| Location | Mechanism | Rate Limiters Used |
|----------|-----------|-------------------|
| `app/actions/auth.ts` | Direct `loginRateLimit.limit(ip)` | Login, Signup |
| `lib/with-rate-limit.ts` | Wrapper function for API handlers | API, Authenticated |
| Individual API routes | Direct limiter calls | Sensitive, Intake, Webhooks |

**Rate limit response (HTTP 429):**
```json
{
  "error": "Too many requests"
}
```
With headers:
- `Retry-After: <seconds>`
- `X-RateLimit-Limit: <limit>`
- `X-RateLimit-Remaining: <remaining>`

### 6.3 IP Detection

```
x-forwarded-for: <client-ip>, <proxy-ip>, ...
```

First IP in the chain is used for rate limiting, extracted via:
```typescript
const forwardedFor = request.headers.get("x-forwarded-for");
const ip = forwardedFor?.split(",")[0].trim() ?? "127.0.0.1";
```

### 6.4 Input Validation (Zod Schemas)

All user-supplied data is validated server-side before processing.

| Schema | File | Fields Validated |
|--------|------|-----------------|
| `loginSchema` | `lib/validation.ts:23-26` | email, password |
| `signupSchema` | `lib/validation.ts:28-38` | full_name, email, password (complexity), whatsapp_number (E.164), country (ISO alpha-2) |
| `intakeFormSchema` | `lib/validation.ts:7-21` | full_name, whatsapp, email, age, primary_goal, health_conditions, program_id, terms, consents |
| `programSchema` | `lib/validation.ts:40-47` | name, duration_weeks, price, currency, checkin_type, description |

### 6.5 API Route Architecture

```
/api
├── v1/
│   ├── public/        ← No auth required (client intake, health)
│   ├── webhook/       ← HMAC verification required (Razorpay, WhatsApp)
│   ├── clients/       ← requireAuth + RLS
│   ├── programs/      ← requireAuth + RLS
│   ├── payments/      ← requireAuth + RLS + rate limited
│   └── coach/         ← requireAuth + RLS
├── webhook/           ← Alternative webhook path (no middleware)
├── cron/              ← requireCronSecret (Vercel cron jobs)
└── auth/              ← Auth callbacks
```

---

## 7. Database Security

### 7.1 Supabase RLS Policies (Complete)

All policies follow the pattern: `coach_id = auth.uid()` for row-level scoping.

**Enable RLS on all tables:**
```sql
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
-- Repeated for: programs, clients, enrollments, checkins,
-- ai_summaries, payments, whatsapp_log, subscriptions,
-- gst_invoices, checkin_templates, plan_grace_periods
```

**Example policy (programs):**
```sql
CREATE POLICY "coaches can manage own programs" ON programs
    FOR ALL
    USING (coach_id = auth.uid())
    WITH CHECK (coach_id = auth.uid());
```

### 7.2 Database Constraints (Security-Relevant)

| Constraint | Table | Purpose |
|-----------|-------|---------|
| `UNIQUE(email)` | `coaches` | Prevent duplicate accounts |
| `UNIQUE(slug)` | `coaches` | Prevent URL slug collisions |
| `payments_gateway_payment_id_unique` | `payments` | Payment idempotency (prevents double-charge) |
| `programs_price_positive` | `programs` | `price >= 0` |
| `checkins_energy_score_range` | `checkins` | `energy_score BETWEEN 1 AND 10` |
| `enrollments_date_range_valid` | `enrollments` | `end_date >= start_date` |
| `coaches_checkin_day_valid` | `coaches` | `checkin_day BETWEEN 0 AND 6` |

### 7.3 Database Access Clients

| Client | Key Used | RLS | Used For |
|--------|----------|-----|----------|
| `createClient()` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ Respects RLS | All coach-facing queries (Server Components, API routes, Server Actions) |
| `createServiceClient()` | `SUPABASE_SERVICE_ROLE_KEY` | ✗ Bypasses RLS | Cron jobs, webhooks, admin-level operations only |

**Security rule:** Service client is never used in client components or browser-facing code. It is restricted to authenticated server contexts (cron secret, webhook signature).

### 7.4 SQL Injection Prevention

All queries use the Supabase JS client which parameterizes inputs. No raw SQL is constructed from user input.

### 7.5 Account Deletion (DPDP Compliance)

- `schedule_account_deletion(coach_uuid)` — Sets a 30-day deletion schedule
- `cancel_account_deletion(coach_uuid)` — Cancels within grace period
- `process_expired_deletions()` — Cron job processes expired deletions
- Data is soft-deleted first, then permanently removed after 30 days

---

## 8. Payment Security

### 8.1 Order Verification

**File:** `lib/razorpay/verify-payment.ts`

```
client-provided signature  = HMAC-SHA256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)
```

The server independently computes the expected signature using the secret key and compares it to the client-provided signature.

### 8.2 Server-Side Order Fetch

Rather than trusting client-provided order details:

```typescript
const order = await razorpay.orders.fetch(orderId);
// Validate order.amount, order.status server-side
```

This prevents tampering with payment amounts or order details on the client side.

### 8.3 Payment Idempotency

- `payments.gateway_payment_id` has a **UNIQUE constraint**
- Race condition handling: if duplicate key error (`23505`) occurs during concurrent requests, the duplicate is caught gracefully with a `SELECT` fallback
- Verified in audit (Observation S4-5)

### 8.4 Sensitive Rate Limiting

Payment verification endpoint is limited to **10 requests per minute** (`sensitiveRateLimit`) to prevent brute force or replay attacks.

### 8.5 Plan Limit Enforcement

Before creating a new client, the system checks the coach's plan limits:

```typescript
// If coach is over client limit → auto-refund the payment
// Prevents over-usage of plan resources
```

---

## 9. Webhook Security

### 9.1 Razorpay Webhooks

**File:** `lib/webhook/verifyRazorpay.ts`

| Feature | Implementation |
|---------|---------------|
| Algorithm | HMAC-SHA256 |
| Secret | `RAZORPAY_WEBHOOK_SECRET` (env var) |
| Comparison | `crypto.timingSafeEqual` (timing attack prevention) |
| Rate Limit | 30 requests/minute (`razorpayWebhookRateLimit`) |
| Flow | Raw body → HMAC → compare signatures → process |

```typescript
export function verifyRazorpaySignature(
  rawBody: string,
  signature: string
): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
```

### 9.2 WhatsApp Webhooks

**File:** `lib/webhook/verifyWhatsapp.ts`

Two verification mechanisms:

**1. Webhook Verification (challenge/response):**
```typescript
verifyWhatsappToken(mode: "subscribe", token: WHATSAPP_VERIFY_TOKEN, challenge)
// Returns challenge string if token matches
```

**2. Payload Verification (HMAC-SHA256):**
```typescript
verifyWhatsappSignature(payload: string, signatureHeader: "sha256=...")
// Compares HMAC-SHA256(payload, WHATSAPP_APP_SECRET) with header value
// Uses timingSafeEqual
```

| Feature | Implementation |
|---------|---------------|
| Challenge token | `WHATSAPP_VERIFY_TOKEN` env var |
| Payload secret | `WHATSAPP_APP_SECRET` env var |
| Algorithm | HMAC-SHA256 |
| Comparison | `crypto.timingSafeEqual` |
| Error handling | Try/catch with fallback to `false` |
| Rate Limit | 60 requests/minute (`whatsappWebhookRateLimit`) |

### 9.3 Cron Job Authentication

**File:** `lib/auth/requireCronSecret.ts`

Vercel cron jobs authenticate via a shared secret:

```typescript
const secret = req.headers.get("x-cron-secret");
if (secret !== process.env.CRON_SECRET) return 401;
```

Protects all routes at `/api/cron/*` from unauthorized invocation.

---

## 10. Secrets Management

### 10.1 Environment Variables Inventory

#### Public (Safe to expose to client)
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (RLS-enforced) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key |
| `NEXT_PUBLIC_APP_URL` | Application base URL |

#### Sensitive (Server-side only — never in client bundle)
| Variable | Risk if Exposed | Rotation Required |
|----------|----------------|-------------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Full database access (bypasses RLS) | Yes — 90 days |
| `RAZORPAY_KEY_SECRET` | Payment order creation, refunds | Yes — immediate on exposure |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook forgery | Yes — immediate on exposure |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp API access | Yes — immediate on exposure |
| `WHATSAPP_APP_SECRET` | Webhook payload forgery | Yes — immediate on exposure |
| `WHATSAPP_VERIFY_TOKEN` | Webhook takeover | Yes |
| `CRON_SECRET` | Unauthorized cron execution | Yes — regular |
| `OPENROUTER_API_KEY` | AI API usage costs | Yes — immediate on exposure |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limit manipulation | Yes |

### 10.2 Secret Storage

| Environment | Storage |
|-------------|---------|
| **Production** | Vercel Environment Variables (encrypted at rest) |
| **Local development** | `.env.local` (gitignored) |
| **Template** | `.env.example` (placeholder values, safe to commit) |

### 10.3 `.gitignore` Protection

```
.env*
!.env.example
```

All environment files except `.env.example` are excluded from version control.

### 10.4 Incident History

- **2026-03-13:** Supabase service role key was accidentally exposed in repository
- **Resolution:** Key rotated, `.env.local` updated, Vercel env vars refreshed, documentation cleaned
- **Outcome:** Security guides created, breach response procedure documented

### 10.5 API Key Lifecycle & Rotation

| Key / Secret | Rotation Cadence | Rotation Procedure | Update Locations |
|--------------|------------------|--------------------|------------------|
| `SUPABASE_SERVICE_ROLE_KEY` | 90 days (Recommended) | Generate new key via Supabase Dashboard (Project Settings > API) | Vercel Environment Variables |
| `SUPABASE_JWT_SECRET` | 90 days (Recommended) | Generate new secret via Supabase Dashboard | Vercel Environment Variables |
| `RAZORPAY_KEY_SECRET` | Manual / Breach | Generate new key via Razorpay Dashboard (Settings > API Keys) | Vercel Environment Variables |
| `RAZORPAY_WEBHOOK_SECRET` | Manual / Breach | Update secret in Razorpay Dashboard (Settings > Webhooks) | Vercel Environment Variables, Razorpay Dashboard |
| `WHATSAPP_ACCESS_TOKEN` | 60 days (System User) | Generate new token via Meta App Dashboard (System Users) | Vercel Environment Variables |
| `ENCRYPTION_KEY` | Manual / Breach | Generate new 32-byte hex string. **Requires full data decryption with old key and re-encryption with new key before deploying!** | Vercel Environment Variables |
| `CRON_SECRET` | Manual | Generate new secure random string | Vercel Environment Variables |

### 10.6 Secret Detection

To mitigate incidents like the past exposed Supabase key, automated secret scanning and CI checks must be implemented:
1. Install and configure `detect-secrets` as a pre-commit hook (configure baseline and `detect-secrets scan` in the repo, and add the hook to `.pre-commit-config.yaml`).
2. Enable GitHub Secret Scanning push protection in repository settings.
3. Integrate GitGuardian (or similar) as a proactive monitor for pushes/PRs.
4. Add `npm audit` to the CI workflow (e.g., include `npm ci && npm audit --audit-level=moderate` as a job step) so secret scanning and dependency vulnerability checks run automatically on pushes/PRs.

---

## 11. Data Protection & Privacy

### 11.1 Personal Data Collected

| Data Field | Purpose | Storage | Encryption |
|-----------|---------|---------|------------|
| Coach email | Authentication, communication | `coaches.email` | At-rest (Supabase) + In-transit (TLS) |
| Coach WhatsApp number | Outbound notifications | `coaches.whatsapp_number` | At-rest (Supabase) |
| Client full name | Program delivery | `clients.full_name` | At-rest (Supabase) |
| Client WhatsApp number | Check-in messaging | `clients.whatsapp_number` | **Active Remediation Planned** (see below) |
| Client email | Communication | `clients.email` | At-rest (Supabase) |
| Client age/health data | Program customization | `clients.age`, `clients.health_notes` | At-rest (Supabase) |
| Payment data | Billing | `payments.*` | At-rest (Supabase) |

**Active Remediation Plan for `clients.whatsapp_number`**:
- **Goal**: Implement PostgreSQL `pgcrypto` column-level encryption (add migration to enable pgcrypto and encrypt existing values).
- **Deadline**: 30 days (tracked in section 15.1).
- **Interim Mitigations**: Restrict service role key access and audit all queries that read this column to meet DPDP concerns (see section 14.1).
- **Rollout Checklist**:
  - [ ] Enable `pgcrypto` extension
  - [ ] Run migration to encrypt existing plaintext values
  - [ ] Update application queries
- **Owner**: Backend Team

### 11.2 Data Classification

| Classification | Examples | Handling Requirements |
|---------------|----------|----------------------|
| **PII** | Coach/client names, emails, phone numbers | Access controlled by RLS, logged with caution |
| **Health data** | Health notes, energy scores, goals | Explicit consent required (`consent_health`) |
| **Financial** | Payment IDs, amounts, invoices | Encrypted in transit, access scoped |
| **Comms audit** | WhatsApp message log | Logged for audit, not user-facing |

### 11.3 Consent Tracking

| Consent | Field | Table |
|---------|-------|-------|
| Health data processing | `consent_health` | `clients` |
| WhatsApp communication | `consent_whatsapp` | `clients` |
| Terms acceptance | `terms_accepted` | Enforced in `intakeFormSchema` (z.literal(true)) |

All three consents are required fields in the intake form, validated server-side via Zod.

### 11.4 Data Retention & Deletion

- **Account deletion:** 30-day grace period before permanent removal
- **Scheduled deletions:** Automated via `process_expired_deletions()` cron job
- **Invoices:** Retained per GST compliance requirements
- **WhatsApp logs:** Retained for audit, no automated expiry yet

### 11.5 Encryption

| State | Mechanism |
|-------|-----------|
| **In transit** | TLS 1.3 (Vercel Edge + Supabase) |
| **At rest (database)** | Supabase PostgreSQL encryption at rest (AES-256) |
| **At rest (env vars)** | Vercel encrypted environment variables |
| **At rest (Redis)** | Upstash Redis TLS encryption |
| **Field-level** | Not implemented — WhatsApp numbers stored in plaintext |

---

## 12. Logging & Monitoring

### 12.1 Application Logging

**Logger:** Pino (structured JSON)

| Environment | Transport | Format |
|-------------|-----------|--------|
| Development | `pino-pretty` | Colorized, human-readable |
| Production | JSON | Structured, machine-parseable |

**Base fields on every log entry:**
```json
{ "env": "production", "app": "fitosys" }
```

### 12.2 Log Types

| Log Helper | File | When Used |
|-----------|------|-----------|
| `logEvent(eventName, data)` | `lib/loggerHelpers.ts` | Business events (login, signup, payment) |
| `logError(error, context)` | `lib/loggerHelpers.ts` | Error events with stack traces |
| `logRequest(req, context)` | `lib/loggerHelpers.ts` | Request tracking with IP |

### 12.3 Events Audited

| Category | Events |
|----------|--------|
| Authentication | `auth.login.attempt`, `auth.login.success`, `auth.login.failed`, `auth.signup.attempt`, `auth.signup.success`, `auth.signup.failed` |
| Payments | Payment verification, webhook receipts, refunds |
| WhatsApp | Message sent/delivered/failed |
| Cron jobs | Execution start, completion, failures |

### 12.4 WhatsApp Message Audit

All WhatsApp messages are logged to the `whatsapp_log` table with:

| Field | Description |
|-------|-------------|
| `direction` | `outbound` or `inbound` |
| `message_type` | `checkin`, `renewal`, `welcome`, `coach_notification`, `summary` |
| `status` | `sent`, `delivered`, `read`, `failed` |
| `sent_at` | Timestamp |

This provides a full audit trail of all WhatsApp communications.

### 12.5 Known Monitoring Gaps

- No centralized log aggregation (e.g., Datadog, Logtail, Axiom)
- No alerting rules on error rate thresholds
- No dashboard for real-time security event monitoring
- No automated anomaly detection on auth/signup patterns

#### Minimum Viable Solution (High Priority - See 15.2)
To address these gaps, the following actions are required:
1. Integrate a centralized log aggregation service (e.g., Axiom, Logtail, or Betterstack).
2. Implement basic alerting rules for auth failure rate spikes, payment verification failures, RLS policy violations, and webhook signature failures.
3. Add real-time security event dashboards.
4. Add simple anomaly detection on auth/signup patterns.

---

## 13. Incident Response Plan

### 13.1 Incident Classification

| Severity | Definition | Examples | Response Time |
|----------|-----------|----------|---------------|
| **P0 Critical** | Data breach, service down, payment system compromised | Key exposure, DB breach, payment failure | Immediate |
| **P1 High** | Auth bypass, rate limit bypass, data leakage between coaches | RLS policy gap, session hijack | < 4 hours |
| **P2 Medium** | Non-critical data exposure, partial functionality loss | Log containing PII, CSP bypass for non-sensitive resource | < 24 hours |
| **P3 Low** | Informational, configuration hardening | Missing security header, outdated dependency | < 1 week |

### 13.2 Response Procedure

#### P0 — Credential/Key Exposure
```
1. DETECT   — Identify the exposed credential and scope
2. CONTAIN  — Revoke compromised key immediately
3. ROTATE   — Generate new key, update .env.local + Vercel
4. AUDIT    — Review logs for unauthorized access
5. DOCUMENT — Record incident details, lessons learned
6. NOTIFY   — Inform affected parties if PII involved
```

#### P0 — Database Breach
```
1. ISOLATE  — Restrict DB access, revoke all non-essential keys
2. ASSESS   — Determine scope of exposed data
3. PRESERVE — Snapshot logs for forensics
4. REMEDIATE— Close vulnerability, rotate all credentials
5. NOTIFY   — Legal/compliance notification if PII exposed
```

#### P1 — Auth/RLS Bypass
```
1. VERIFY   — Confirm the vulnerability exists
2. PATCH    — Deploy fix to production immediately
3. AUDIT    — Check logs for exploitation evidence
4. MONITOR  — Increase monitoring on affected paths
```

### 13.3 Communication Channels

| Channel | Purpose |
|---------|---------|
| Vercel Dashboard | Deployment monitoring |
| Supabase Dashboard | Database metrics, auth logs |
| Vercel Logs | Application error logs |
| GitHub Issues | Incident tracking and resolution |
| Email | Customer notification (if PII exposed) |

### 13.4 Post-Incident

Every P0/P1 incident generates:
1. Root cause analysis document
2. Updated security controls to prevent recurrence
3. Test to verify the fix
4. Timeline record for compliance

### 13.5 Automated Alerting Rules (Axiom)

To automate breach notifications, configure the following monitor in Axiom:

**Rule Name:** Critical Security Alert
**Query:** `['fitosys_production'] | where event == "security_alert" and priority == "critical"`
**Threshold:** `> 0` hits in `5m` window
**Action:** Webhook to Slack/Discord `#security-alerts` channel
**Description:** Triggers immediate pager duty or high-priority notifications when critical encryption/decryption or authorization bypass errors occur.

---

## 14. Compliance Matrix

### 14.1 DPDP (Digital Personal Data Protection) — India

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Consent for data processing | ✅ Complete | Explicit consent fields (`consent_health`, `consent_whatsapp`, `terms_accepted`) |
| Right to deletion | ✅ Complete | `schedule_account_deletion()` with 30-day grace period |
| Purpose limitation | ✅ Complete | Data collected and used only for program delivery |
| Data minimization | ✅ Complete | Only essential fields collected |
| Breach notification | ⚠️ Partial | Procedure documented, automated notification not implemented |

### 14.2 Razorpay Compliance

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Signature verification | ✅ Complete | HMAC-SHA256 with `timingSafeEqual` |
| Idempotency | ✅ Complete | UNIQUE constraint + duplicate handling |
| Server-side verification | ✅ Complete | Order fetch + payment verify server-side |
| Webhook signature | ✅ Complete | HMAC-SHA256 with dedicated webhook secret |

### 14.3 Meta/WhatsApp Compliance

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Webhook verification | ✅ Complete | Challenge/response verify token |
| Payload signature | ✅ Complete | HMAC-SHA256 with `WHATSAPP_APP_SECRET` |
| User consent | ✅ Complete | `consent_whatsapp` field on IntakeForm |
| Rate limiting | ✅ Complete | 60 requests/minute webhook limiter |

### 14.4 OWASP Top 10 Coverage

| OWASP Category | Status | Mitigation |
|----------------|--------|------------|
| A01: Broken Access Control | ✅ Complete | RLS on all tables, middleware, server-side auth |
| A02: Cryptographic Failures | ⚠️ Partial | TLS 1.3, but field-level encryption not implemented |
| A03: Injection | ✅ Complete | Supabase JS client (parameterized), Zod validation |
| A04: Insecure Design | ✅ Complete | Rate limiting, webhook verification, payment security |
| A05: Security Misconfiguration | ⚠️ Partial | CSP has unsafes (needs nonce), no automated scanner |
| A06: Vulnerable Components | ❌ Not assessed | No automated dependency scanning |
| A07: Identification/Auth Failures | ✅ Complete | Rate-limited auth, OAuth, session management |
| A08: Data Integrity Failures | ✅ Complete | Signature verification (payments, webhooks) |
| A09: Security Logging/Monitoring | ⚠️ Partial | Pino logging, no alerting or aggregation |
| A10: SSRF | ✅ Complete | No server-side URL fetch from user input |

### 14.5 GST Compliance

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Invoice generation | ✅ Complete | `gst_invoices` table with unique invoice numbers |
| GST rate tracking | ✅ Complete | CGST/SGST/IGST fields on invoices |
| Invoice numbering | ✅ Complete | Auto-generated unique invoice numbers |

---

## 15. Known Gaps & Roadmap

### 15.1 Critical / High Priority

| # | Gap | Impact | Target | Owner |
|---|-----|--------|--------|-------|
| 1 | CSP `'unsafe-inline'` and `'unsafe-eval'` | CSP bypass possible for XSS | 90 days | Security Team |
| 2 | No automated dependency scanning | Unknown vulnerable deps | 90 days | DevOps |
| 3 | No automated secret scanning | Secrets could be committed undetected | 90 days | DevOps |
| 4 | WhatsApp numbers stored in plaintext | PII exposure risk | 30 days | Backend Team |
| 5 | No log aggregation/alerting (Promoted to High priority) | Blind to attacks in progress | 90 days | DevOps |

### 15.2 Medium Priority

| # | Gap | Impact | Target | Owner |
|---|-----|--------|--------|-------|
| 6 | No centralized rate limiting at middleware level | Some routes may lack coverage | TBD | Backend Team |
| 7 | Service role key rotation not automated | Stale keys increase blast radius | 90-day reminder | Security Team |
| 8 | No PgBouncer/connection pooling | Connection exhaustion risk | TBD | DevOps |

*Note: For project tracking, create GitHub issues with milestones for each row above (e.g., reference each issue by row number like "#5") so owners can be assigned and progress tracked.*

### 15.3 Low Priority / Nice-to-Have

| # | Gap | Impact | Target |
|---|-----|--------|--------|
| 9 | No automated security scanning in CI | Regressions possible | Add `npm audit` to build pipeline |
| 10 | No API key for third-party integrations | No key rotation workflow | Document key lifecycle |
| 11 | No audit log for admin actions | No record of service client activity | Add audit trigger on service client operations |
| 12 | No Web Application Firewall (WAF) | No WAF-layer protection | Evaluate Vercel WAF / CloudFlare |

### 15.4 Security Score

**Current composite score: 94%** (per `SECURITY_COMPLIANCE_SCALABILITY_AUDIT.md`)

| Category | Score |
|----------|-------|
| Security | 94% |
| Compliance | 88% |
| Scalability | 91% |

---

## Appendix A: Quick Reference — Key Files

| File | Purpose |
|------|---------|
| `next.config.ts` | CSP, HTTP security headers |
| `middleware.ts` | Route protection, auth redirect |
| `lib/rate-limit.ts` | All rate limiter definitions |
| `lib/with-rate-limit.ts` | Rate limiting wrapper for API routes |
| `lib/validation.ts` | Zod input validation schemas |
| `lib/auth.ts` | `getAuthenticatedCoach()` helper |
| `lib/auth/requireAuth.ts` | API route auth guard |
| `lib/auth/requireCronSecret.ts` | Cron job auth guard |
| `lib/auth/getAllowedRedirectUrl.ts` | OAuth redirect whitelist |
| `app/actions/auth.ts` | Auth Server Actions (login, signup, logout, OAuth) |
| `lib/webhook/verifyRazorpay.ts` | Razorpay webhook HMAC verification |
| `lib/webhook/verifyWhatsapp.ts` | WhatsApp webhook verification |
| `lib/razorpay/verify-payment.ts` | Payment signature verification |
| `lib/razorpay/client.ts` | Razorpay API client singleton |
| `lib/supabase/server.ts` | DB clients (anon + service role) |
| `lib/logger.ts` | Pino logger configuration |
| `lib/loggerHelpers.ts` | Structured log helpers |
| `supabase/config.toml` | Supabase project configuration |
| `supabase/migrations/` | SQL migrations (RLS, constraints, functions) |
| `.env.example` | Environment variable template |
| `SECURITY_CLEARANCE_CERTIFICATE.md` | Pre-launch security clearance |
| `SECURITY_COMPLIANCE_SCALABILITY_AUDIT.md` | Full audit report |
| `SECRETS_AND_API_KEYS_GUIDE.md` | Secrets management guide |
| `GLOBAL_RATE_LIMITING_GUIDE.md` | Rate limiting reference |

## Appendix B: Environment Quick Check

```bash
# Verify no secrets in git history
git log --all -p | grep -i "SUPABASE_SERVICE_ROLE\|RAZORPAY_KEY_SECRET\|WHATSAPP_ACCESS_TOKEN"

# Verify .env.local is gitignored
git check-ignore .env.local

# Check for committed .env files
git ls-files | grep "\.env"

# Verify CSP in production
curl -sI https://fitosys.alchemetryx.com | grep -i content-security-policy

# Check HSTS header
curl -sI https://fitosys.alchemetryx.com | grep -i strict-transport-security
```

---

*Document maintained as part of the Fitosys security program. Review quarterly or after any security incident.*
