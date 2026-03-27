# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fitosys is a multi-tenant SaaS platform for fitness coaches in India. Coaches manage clients, programs, enrollments, weekly check-ins, payments (via Razorpay), and AI-powered insights (via OpenRouter/Qwen). Notifications go out via WhatsApp (Interakt API).

## Commands

```bash
npm run dev      # Start dev server on port 3005
npm run build    # Production build
npm run lint     # ESLint
```

No test suite is configured.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Auth**: Supabase Auth (email/password, SSR via `@supabase/ssr`)
- **Payments**: Razorpay (India)
- **AI**: OpenRouter API (Qwen 3 32B Instruct) for weekly summaries, risk scoring, renewal messages
- **WhatsApp**: Interakt API (Meta Cloud API wrapper)
- **Rate Limiting**: Upstash Redis
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Hosting**: Vercel + Vercel Cron

## Architecture

### Multi-Tenancy

Data isolation is per-coach. Every table has a `coach_id` column. RLS policies enforce this — most queries from client components use `createClient()` (honors RLS), while server actions and cron routes use `createServiceClient()` (bypasses RLS with service role key).

### Supabase Clients

- **`lib/supabase/server.ts`**: `createClient()` for browser/SSR with RLS, `createServiceClient()` for service role (cron routes, server actions)
- **`lib/supabase/client.ts`**: Browser client factory

### Middleware (`middleware.ts`)

Handles three concerns in order:
1. Rate limiting for `/api/*` routes (Upstash Redis, 100 req/min unauthenticated, 300 req/min authenticated)
2. Auth protection — redirects unauthenticated users to `/login`
3. Onboarding redirect — authenticated coaches without `whatsapp_number` are sent to `/onboarding/profile`

### Server Actions (`lib/actions.ts`)

Currently only `submitCheckin()` — inserts a weekly checkin and auto-calculates week number from enrollment start date.

### AI Features (`lib/openrouter.ts`)

`generateWeeklySummary()` uses OpenRouter with exponential backoff (4s → 16s → 60s). The prompt outputs a fixed 6-section structure (Response Rate, Needs Attention, Strong Progress, Group Average, This Week Priority, Non-Responders).

### Cron Routes (`app/api/cron/`)

| Route | Purpose | Auth |
|-------|---------|------|
| `expiry` | Marks enrollments expired if `end_date < today` and no recent payment | Bearer token (`CRON_SECRET`) |
| `checkins` | Triggers WhatsApp check-in messages to clients | Bearer token |
| `summaries` | Generates AI weekly summaries for all coaches | Bearer token |
| `renewals` | Sends renewal reminder WhatsApp messages | Bearer token |
| `process-deletions` | Hard-deletes coaches/clients marked for deletion | Bearer token |

### Payment Flow

1. Client enrolls → `POST /api/payments/create-order` → Razorpay order
2. Payment verified via `POST /api/payments/verify` → enrollment created
3. Razorpay webhook (`/api/webhooks/razorpay`) handles subscription events
4. Renewal flow at `/renew` page with `POST /api/renew`

### Database Schema

Core tables: `coaches`, `programs`, `clients`, `enrollments`, `checkins`, `ai_summaries`, `invoices`, `deletion_requests`

Migrations live in `supabase/migrations/`. Schema uses RLS policies that scope all queries to the authenticated coach's `coach_id`.

## Environment Variables

See `.env.example`. Required:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`
- `CRON_SECRET` for cron route authentication
- `NEXT_PUBLIC_APP_URL`

## Key Patterns

- Route groups: `(auth)` for login/signup/forgot-password, `(shell)` routes get Nav/Footer via `x-pathname` header from middleware
- shadcn/ui components live in `components/ui/`
- Layout components (Nav, Footer, Grain) in `components/layout/`
- AI modules in `lib/gemini/` (legacy) and `lib/openrouter/` (active)
