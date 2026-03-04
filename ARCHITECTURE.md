# Fitosys — Architecture Reference

> **Paste this at the start of every new AI coding session** to maintain context.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase PostgreSQL + RLS |
| Auth | Supabase Auth (email/password) |
| AI | Gemini API (Flash + Pro) |
| Payments | Razorpay (India) |
| WhatsApp | Interakt API |
| Hosting | Vercel + Vercel Cron |
| Domain | fitosys.alchemetryx.com (Hostinger DNS → Vercel) |

## Multi-Tenancy

Every table has `coach_id UUID`. RLS policy: `USING (coach_id = auth.uid())`.
Cron/webhook routes use `createServiceClient()` (service role) to bypass RLS.

## Database — 8 Tables

| Table | Purpose |
|---|---|
| `coaches` | One record per coach (auth.uid() = id) |
| `programs` | Coach's offered programs |
| `clients` | Clients enrolled under a coach |
| `enrollments` | Active/past program enrollments |
| `checkins` | Weekly check-in submissions |
| `ai_summaries` | AI-generated weekly summaries |
| `payments` | All payment transactions |
| `whatsapp_log` | Inbound/outbound WhatsApp log |

## Fonts

- **Body**: Urbanist (300/400/500/600/700) — `--font-sans`
- **Display**: Barlow Condensed (500/600/700) — `--font-display`, uppercase headings

## Colour Palette (Dark Theme)

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#0A0A0A` | Page background |
| `--card` | `#111111` | Cards, panels |
| `--foreground` | `#FFFFFF` | Primary text |
| `--brand` | `#E8001D` | CTAs, accents |
| `--brand-hover` | `#9E0014` | Hover states |
| `--muted-foreground` | `#A0A0A0` | Secondary text |
| `--border` | `#222222` | Borders, inputs |

## API Routes

### Auth & Dashboard
- `POST /api/auth/signup` — Coach signup
- `POST /api/auth/login` — Coach login
- `GET /api/coaches/dashboard` — Dashboard stats
- `GET|PUT /api/coaches/profile` — Profile CRUD
- `PUT /api/coaches/settings` — Check-in config

### Programs & Clients
- `GET|POST /api/programs` — List/create programs
- `PUT|DELETE /api/programs/[id]` — Edit/deactivate
- `GET /api/clients` — All clients
- `GET /api/clients/[id]` — Single client + history

### Payments (Razorpay)
- `POST /api/payments/create-order` — Create order
- `POST /api/payments/verify` — Verify signature
- `POST /api/webhooks/razorpay` — Webhook handler

### Cron Jobs (Vercel Cron + CRON_SECRET)
- `POST /api/cron/checkins` — Sunday 6:30 PM IST
- `POST /api/cron/summaries` — Monday 6:30 AM IST
- `POST /api/cron/renewals` — Daily 9:30 AM IST

### WhatsApp
- `POST /api/webhooks/whatsapp` — Inbound reply capture

## AI Modules (`lib/gemini/`)

| Module | Trigger | Model |
|---|---|---|
| `weekly-summary.ts` | Monday cron | Flash |
| `risk-score.ts` | Dashboard load | Flash |
| `renewal-message.ts` | 7d before expiry | Flash |
| `coach-insight.ts` | Monday summary | Pro |

## Key Files

```
src/
├── app/
│   ├── layout.tsx          # Fonts (Urbanist + Barlow Condensed)
│   ├── globals.css         # Theme tokens, dark palette
│   ├── page.tsx            # Landing page
│   ├── (auth)/             # Login, signup
│   ├── (dashboard)/        # Coach dashboard
│   ├── join/[slug]/        # Public client intake
│   └── api/                # All API routes
├── components/
│   ├── ui/                 # shadcn components
│   ├── razorpay-button.tsx # Payment component
│   └── gsap-provider.tsx   # Animation wrappers
├── lib/
│   ├── supabase/           # Client + server Supabase
│   ├── razorpay/           # Razorpay SDK wrappers
│   ├── whatsapp.ts         # Interakt messaging
│   ├── gemini.ts           # AI entry point
│   └── hooks.ts            # React data hooks
lib/
├── gemini/                 # 4 AI feature modules
└── razorpay/               # Razorpay helpers
supabase/
└── migrations/             # 001_initial + 002_razorpay
```

## Environment Variables

See `.env.example` for the full list. Critical:
- `CRON_SECRET` — secures cron routes
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, bypasses RLS
- `RAZORPAY_KEY_SECRET` — server-only
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — frontend modal
