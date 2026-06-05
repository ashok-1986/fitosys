This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Fitosys — Fitness Coaching Platform

Fitosys is a multi-tenant SaaS platform for fitness coaches to manage clients, programs, check-ins, payments, and AI-powered insights.

### Tech Stack
- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase PostgreSQL + Row Level Security
- **Auth**: Supabase Auth (email/password)
- **AI**: OpenRouter API (Qwen 2.5 72B Instruct)
- **Payments**: Razorpay (India)
- **WhatsApp**: Interakt API
- **Hosting**: Vercel + Vercel Cron

### Implementation Plan

A comprehensive 13-phase implementation plan has been created covering:
1. Core Infrastructure ✅ (Database schema, RLS, migrations)
2. Authentication & Onboarding
3. Program Management
4. Client Management
5. Enrollment & Payments
6. Weekly Check-In System
7. AI-Powered Features (OpenRouter integration)
8. Dashboard & Analytics
9. Settings & Configuration
10. Cron Jobs & Automation
11. WhatsApp Integration
12. Testing & QA
13. Deployment & Monitoring

See `CHANGELOG.md` for the latest updates and implementation status.

### Environment Variables

Fitosys requires several environment variables for production.
For security compliance, PII such as WhatsApp numbers are encrypted at rest using DPDP-compliant encryption.

- `ENCRYPTION_KEY`: A 32-byte hex string used for deterministic AES-256-CBC encryption of WhatsApp numbers and other PII. Ensure this is rotated according to policy.
- `AXIOM_TOKEN`: API token for Axiom log aggregation.
- `AXIOM_DATASET`: Dataset name for Axiom log aggregation (e.g. `fitosys_production`).

### Security & CI Checks

This project enforces strict security checks in the CI/CD pipeline and locally:

- **WAF & Edge Protection**: Vercel Web Application Firewall (WAF) is active at the edge, providing the primary defense against DDoS attacks, SQL injection (SQLi), and cross-site scripting (XSS) before requests hit the application logic.
- **Secret Scanning**: We use `detect-secrets` via Husky pre-commit hooks to prevent credentials from being committed locally. GitHub Actions (`.github/workflows/security.yml`) also scans for secrets on every PR and push.
- **Dependency Auditing**: `npm audit` is enforced in the GitHub Actions pipeline, blocking deployments if high/critical vulnerabilities are detected.
- **Database Connections**: The application connects to Supabase exclusively via the PostgREST HTTP API using `@supabase/supabase-js`, which natively manages connection pooling on the Supabase infrastructure side. No direct PostgreSQL connections are exposed or used by the Next.js app, eliminating pool exhaustion risks at the edge.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
