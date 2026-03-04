# Fitosys — Product Requirements Document
**Version:** 1.0  
**Date:** February 2026  
**Author:** Founder, Alchemetryx  
**Status:** Ready for Development  
**Build Stack:** Google Antigravity (Agentic IDE) + Google AI Studio (Gemini API)  
**Classification:** Confidential

---

## 1. PRODUCT OVERVIEW

### 1.1 What Is Fitosys

Fitosys is a SaaS business operating system built specifically for independent fitness, wellness, and yoga coaches. It automates the three most painful administrative tasks in a coaching business: client onboarding and payment collection, weekly progress check-ins, and program renewal reminders.

Coaches currently run their businesses on a combination of WhatsApp groups, Excel sheets, and memory. Fitosys replaces this broken stack with a single, automated system that runs in the background while the coach focuses on coaching.

### 1.2 The Core Promise

A coach using Fitosys should be able to manage 40 clients with the same effort it currently takes to manage 15.

### 1.3 Target Markets

**Primary:** India — Independent fitness coaches, yoga instructors, wellness practitioners in Tier 1 cities (Mumbai, Delhi, Bangalore, Hyderabad, Pune)

**Secondary:** United Kingdom, Canada, USA — South Asian diaspora wellness coaches, mainstream fitness coaches

### 1.4 Pricing

| Plan | India | UK | USA/Canada |
|------|-------|-----|------------|
| Basic Monthly | ₹1,499/month | £11/month | $14/month |
| Pro Monthly | ₹2,499/month | £18/month | $22/month |
| Basic Annual | ₹14,999/year | £110/year | $135/year |

MVP launches with Basic Monthly only. Pro and Annual tiers in Phase 2.

---

## 2. PROBLEM STATEMENT

### 2.1 The Real Situation

Independent coaches with 20 to 40 clients face these specific operational failures every month:

**Revenue Leakage from Renewals**
Coaches do not have a system to track when client programs expire. Renewals are initiated manually by memory or when the client stops responding. Average coaches lose 2 to 3 clients per month purely to administrative gaps, not coaching quality. At ₹3,000 per client per month, this is ₹72,000 to ₹1,08,000 in annual preventable revenue loss.

**Engagement Blindspot**
Without a structured check-in system, coaches have no data on whether a client is making progress until the client complains or drops out. There is no early warning system for disengagement.

**Client Onboarding Friction**
New clients are onboarded through a chain of WhatsApp messages: share your goals, pay here, let me explain the plan. This creates confusion, delays, and an unprofessional first impression. Payment reconciliation happens manually.

**Administrative Burnout**
Coaches report spending 2 to 4 hours per week on client management tasks that have nothing to do with coaching. This is time that could be used for training, content creation, or personal recovery.

### 2.2 Why Existing Tools Do Not Work

Generic tools like Google Sheets, Notion, or Calendly are not built for coaching workflows. WhatsApp Business has no CRM capability. Gym management software is designed for studio operations, not independent practitioners. No product exists that combines onboarding, check-ins, and renewals in one WhatsApp-native system for the independent coach segment.

---

## 3. USER PERSONAS

### Persona 1: Priya — The Solo Fitness Coach (Primary)
- Age: 28 to 38
- Location: Mumbai, Bangalore, or London
- Clients: 25 to 40 active
- Revenue: ₹60,000 to ₹1,20,000 per month
- Problem: Spends every Sunday manually sending check-in messages. Forgets renewals. Has no visibility into who is struggling.
- Tech comfort: High on Instagram and WhatsApp, moderate on apps
- Willingness to pay: Yes, if it clearly saves time and money

### Persona 2: Rahul — The Yoga Instructor (Secondary)
- Age: 30 to 45
- Location: Delhi, Pune, or Toronto
- Clients: 15 to 25, mix of group and individual
- Revenue: ₹40,000 to ₹80,000 per month
- Problem: Mixes spiritual practice clients with physical yoga clients. Needs different check-in questions for different client types.
- Tech comfort: Moderate
- Willingness to pay: Moderate. Needs to see ROI clearly.

### Persona 3: Sarah — The Wellness Coach Abroad (Tertiary)
- Age: 32 to 45
- Location: UK or Canada
- Clients: 10 to 20, premium pricing
- Revenue: £3,000 to £8,000 per month
- Problem: Clients expect a professional system. WhatsApp management feels unpolished for a premium brand.
- Tech comfort: High
- Willingness to pay: High. Price is not the barrier.

---

## 4. MVP SCOPE — PHASE 1

### 4.1 What Is In Scope

The MVP contains exactly 3 features. No feature outside this list gets built in Phase 1.

1. Client Onboarding with Payment
2. Weekly WhatsApp Check-in Automation with AI Summary
3. Renewal Reminder Automation

### 4.2 What Is Not In Scope (Phase 1)

- Mobile app (web-responsive first)
- Group coaching or cohort management
- Exercise library or workout builder
- Nutrition logging
- Video calls or lesson delivery
- Coach-to-coach marketplace
- Custom domain per coach
- Zapier or third-party integrations
- API access for coaches
- White labeling

---

## 5. FEATURE SPECIFICATIONS

### Feature 1: Client Onboarding with Payment

#### 5.1.1 Overview

Each coach gets a unique onboarding link at the format `fitosys.com/join/[coach-slug]`. The coach shares this link with any new client on WhatsApp, Instagram, or email. The client fills out an intake form, selects a program, and pays. Everything happens on one page. The coach receives a WhatsApp notification instantly.

#### 5.1.2 User Stories

**Coach Stories**

- As a coach, I want a personal onboarding link I can share anywhere so that clients can onboard without me guiding them step by step.
- As a coach, I want to configure my programs with names, durations, and prices so that clients see my actual offerings.
- As a coach, I want to receive a WhatsApp notification immediately when a client onboards and pays so that I can send a personal welcome message.
- As a coach, I want the client to automatically appear in my dashboard after payment so that I do not have to manually add them.

**Client Stories**

- As a client, I want to fill out one form and pay in one step so that onboarding feels professional and simple.
- As a client, I want to receive a WhatsApp confirmation immediately after payment so that I know I am registered.

#### 5.1.3 Functional Requirements

**Coach Program Setup (done once)**
- Coach logs into dashboard and navigates to Programs section
- Coach creates one or more programs with: Program Name, Duration (4 weeks / 8 weeks / 12 weeks / Custom), Price (in coach's local currency), Description (optional), Check-in Type (Fitness / Yoga / Wellness / Custom)
- Coach can edit or deactivate programs at any time
- Active programs appear on the client-facing onboarding page

**Client Intake Form Fields**
- Full Name (required)
- WhatsApp Number with country code (required)
- Email Address (required)
- Age (required)
- Primary Goal — single select: Weight Loss, Muscle Gain, Flexibility, Overall Fitness, Mental Wellness, Spiritual Practice, Custom (if coach enabled it)
- Health Conditions to Note — free text, optional
- Program Selection — shows coach's active programs with prices
- Agreement to terms (checkbox)

**Payment Flow**
- Stripe Checkout embedded or redirected
- Supported payment methods: UPI (India), Debit/Credit Card (global), Apple Pay (UK/USA)
- On successful payment: Stripe webhook fires to backend
- Backend creates Client record, creates Program Enrollment record, sends WhatsApp to client and coach
- On failed payment: client sees error, can retry, no records created

**Post-Payment Actions (automated, no coach action needed)**
- Client record created with status: Active
- Program start date set to today
- Program end date calculated from program duration
- Welcome WhatsApp sent to client from coach's registered number
- Notification WhatsApp sent to coach
- Client appears in coach's Active Clients list

#### 5.1.4 WhatsApp Message Templates

**Client Welcome Message**
```
Hi [Client First Name] 👋

Welcome to [Coach Name]'s coaching program!

Your [Program Name] program starts today and runs until [End Date].

Here's what to expect:
• Every [check-in day] evening, I'll send you a quick 4-question check-in on WhatsApp
• Just reply here, it takes 2 minutes
• I'll review your responses and flag anything that needs attention

Talk soon,
[Coach Name]
```

**Coach Notification Message**
```
💰 New client onboarded

Name: [Client Name]
Program: [Program Name]
Amount: [Currency][Amount]
Program dates: [Start] to [End]

They're now in your Active Clients list.
```

#### 5.1.5 Acceptance Criteria

- Coach onboarding link is live within 24 hours of coach account creation
- Client can complete form and pay in under 5 minutes
- WhatsApp notifications sent within 60 seconds of payment confirmation
- Client appears in coach dashboard within 2 minutes of payment
- Payment failure does not create orphan records in database
- Stripe webhook handles duplicate events idempotently

---

### Feature 2: Weekly Check-In Automation with AI Summary

#### 5.2.1 Overview

Every Sunday at 7:00 PM local time for each coach, the system sends a structured 4-question WhatsApp check-in to every active client. Clients reply naturally on WhatsApp. The system captures replies and stores them. Every Monday at 7:00 AM local time, Gemini API processes all collected responses and generates a coach-readable summary. This summary is delivered via WhatsApp and visible in the dashboard.

#### 5.2.2 User Stories

**Coach Stories**

- As a coach, I want check-ins to go out to all my clients automatically every week so that I never have to send them manually.
- As a coach, I want a weekly AI summary every Monday morning so that I can immediately see which clients need my attention.
- As a coach, I want to see which clients did not respond to check-ins so that I can reach out personally.
- As a coach, I want to configure the check-in day and time so that it fits my client base's availability.

**Client Stories**

- As a client, I want the check-in message to feel personal, not robotic so that I actually respond.
- As a client, I want to reply in my own words, not fill a form, so that it feels like a conversation.

#### 5.2.3 Functional Requirements

**Check-In Scheduling**
- Default: Every Sunday at 7:00 PM in coach's timezone
- Coach can change the day (Mon through Sun) and time from dashboard settings
- Timezone auto-detected from coach's country setting, adjustable manually
- System runs check-ins for all active clients under that coach at the configured time

**Check-In Message**
```
Hey [Client First Name] 👋

Quick weekly check-in from [Coach Name].
Takes 2 minutes, reply right here.

1️⃣ Weight this week? (e.g., 73.2 kg)
2️⃣ Sessions completed this week? (e.g., 3)
3️⃣ Energy level 1 to 10? (1 = exhausted, 10 = amazing)
4️⃣ Any wins or struggles this week?

Just reply in one message or separate messages, whatever is easier.
```

**Reply Capture**
- WhatsApp Business API receives client reply via webhook
- System matches reply to correct client using their registered phone number
- Reply stored in CheckIns table with timestamp
- System marks client as "Responded" for the current week
- If client sends multiple messages, all messages concatenated and stored as one check-in entry

**Gemini AI Summary Generation**
- Triggered every Monday at 7:00 AM in coach's timezone
- System fetches all check-in responses for the previous week for that coach
- Constructs structured prompt with all client data
- Sends to Gemini API via Google AI Studio endpoint
- Summary generated and stored
- Summary delivered via WhatsApp to coach
- Summary also visible in Weekly Pulse section of dashboard

**AI Summary Prompt Template (sent to Gemini)**
```
You are a coaching assistant reviewing weekly check-in data for a fitness coach.

Coach: [Coach Name]
Week ending: [Date]
Total active clients: [N]
Clients who responded: [N]
Clients who did not respond: [Names as comma-separated list]

CLIENT RESPONSES:
[For each responding client:]
Client: [Name]
Weight update: [value or blank]
Sessions completed: [value]
Energy score: [value]/10
Notes: [free text reply]
---

Generate a structured summary with exactly these sections:

RESPONSE RATE
[X of Y clients responded — one line only]

NEEDS ATTENTION (up to 3 clients)
[List clients with specific concern and one action suggestion per client]

STRONG PROGRESS (up to 3 clients)
[List clients with specific achievement]

GROUP AVERAGE
Energy score: [average to 1 decimal]
Sessions per week: [average to 1 decimal]

THIS WEEK PRIORITY
[One specific coaching action for the coach — be direct, not vague]

NON-RESPONDERS
[List names of clients who did not respond this week]

Keep total under 150 words. Be specific. No filler phrases.
```

**Monday Morning Coach Message**
```
Good morning [Coach Name] 👋

Your weekly coaching pulse is ready.

[Full AI Summary pasted here]

View full details in your dashboard: [Dashboard link]
```

#### 5.2.4 Coach Dashboard — Weekly Pulse View

- Current week summary shown prominently
- Archive of last 12 weeks of summaries
- Response rate trend chart (last 8 weeks)
- Click on any client name in summary to open their profile
- Non-responders list with one-tap option to send personal follow-up

#### 5.2.5 Acceptance Criteria

- Check-in messages sent within 5-minute window of configured time
- System handles clients in different countries and timezones correctly
- Reply capture works for messages sent up to 24 hours after check-in
- Gemini summary generated and delivered by 7:15 AM Monday
- If Gemini API fails, system retries once and notifies coach of delay
- Coach can view historical summaries for any previous week

---

### Feature 3: Renewal Reminder Automation

#### 5.3.1 Overview

Every day at 10:00 AM, the system checks for programs ending in the next 7 days. For matching clients, it sends a personalized renewal WhatsApp with a payment link. If the client does not pay within 3 days, a second reminder is sent. If still unpaid, the coach is flagged in the dashboard. Paid renewals automatically extend the program.

#### 5.3.2 User Stories

**Coach Stories**

- As a coach, I want renewal reminders sent automatically so that I never lose a client to a forgotten follow-up.
- As a coach, I want to see all pending renewals in one place so that I can prioritize personal outreach.
- As a coach, I want to know when a client has churned and why so that I can learn from it.

**Client Stories**

- As a client, I want my renewal reminder to feel personal, not like a generic invoice, so that it feels like my coach cares.
- As a client, I want one tap to renew so that it is frictionless.

#### 5.3.3 Functional Requirements

**Daily Renewal Check**
- System runs every day at 10:00 AM UTC
- Queries for all active enrollments where End Date is between today and today plus 7 days
- For each match, checks if renewal reminder already sent this cycle
- If not sent: send first renewal WhatsApp, log reminder date

**First Renewal Message (7 days before end)**
```
Hey [Client First Name] 👋

Your [Program Name] with [Coach Name] ends on [End Date].

Here's a quick look at your journey:
📊 [N] sessions completed
[If weight data available: 📉 [X] kg progress tracked]
✅ [N] weeks of check-ins completed

Ready to keep the momentum going?

Renew your program here:
[Stripe Payment Link]

Questions? Just reply here.

[Coach Name]
```

**Second Renewal Message (3 days after first if unpaid)**
```
Hi [Client First Name], just a quick reminder that your program ends in [N] days.

Renewing takes 2 minutes:
[Stripe Payment Link]

If you are taking a break, no problem — just let me know so I can keep your spot open.

[Coach Name]
```

**Coach Dashboard Alert (if still unpaid after second reminder)**
- Client appears in "Renewals Overdue" section with red flag
- Shows: Client Name, Program End Date, Days Since Last Reminder, Quick Action button
- Quick Action button opens WhatsApp with pre-drafted personal message that coach can edit and send in 30 seconds

**On Successful Renewal Payment**
- Stripe webhook triggers backend
- Program End Date extended by one program duration from new payment date
- PAYMENTS table updated with new transaction
- Status remains Active
- Coach notified via WhatsApp: "[Client Name] renewed [Program Name] until [New End Date]. ₹[Amount] received."

**On Non-Renewal (client does not pay and program ends)**
- Client status changed to Inactive after 3 days post end date with no payment
- Coach prompted to log churn reason: Price, Program Complete, Dissatisfied, Personal Reasons, Unresponsive, Other
- Churn data stored for analytics

#### 5.3.4 Acceptance Criteria

- No duplicate renewal messages sent within same 7-day window
- Stripe payment link in reminder is pre-filled with correct amount and client metadata
- Renewal payment correctly extends program end date (not restarts from today)
- Coach notification sent within 60 seconds of renewal payment
- Churn logging is optional but prompted

---

## 6. SYSTEM ARCHITECTURE

### 6.1 Overview

Fitosys is a multi-tenant SaaS application. Every coach is a separate tenant. Data isolation is enforced at the database query level. The system has four primary components: web application, backend API, database, and automation engine.

```
┌─────────────────────────────────────────────────────────────┐
│                        FITOSYS SYSTEM                       │
├─────────────────┬───────────────────┬───────────────────────┤
│  WEB APP        │  BACKEND API      │  EXTERNAL SERVICES    │
│  (Next.js)      │  (Node.js/        │                       │
│                 │   Python FastAPI) │  ┌─────────────────┐  │
│  Coach Dashboard│                   │  │ WhatsApp API    │  │
│  Client Intake  │  Auth Layer       │  │ (Interakt/WATI) │  │
│  Landing Page   │  Business Logic   │  └─────────────────┘  │
│                 │  Webhook Handler  │  ┌─────────────────┐  │
│                 │  Scheduler        │  │ Stripe Payments │  │
│                 │                   │  └─────────────────┘  │
│                 │                   │  ┌─────────────────┐  │
├─────────────────┴───────────────────┤  │ Gemini API      │  │
│           DATABASE LAYER            │  │ (AI Studio)     │  │
│        (PostgreSQL via Supabase)    │  └─────────────────┘  │
│                                     │  ┌─────────────────┐  │
│  coaches | clients | enrollments    │  │ Email (Resend)  │  │
│  checkins | payments | summaries    │  └─────────────────┘  │
└─────────────────────────────────────┴───────────────────────┘
```

### 6.2 Tech Stack for Antigravity Build

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Next.js 14 (App Router) | Antigravity generates excellent Next.js. Google AI Studio has tutorials for it. |
| Styling | Tailwind CSS | Fast, clean, Antigravity handles it natively |
| Backend | Next.js API routes or Python FastAPI | Start with Next.js API routes. Switch to FastAPI only if background jobs need it. |
| Database | Supabase (PostgreSQL) | Free tier generous. Row-level security built in for multi-tenancy. Real-time subscriptions. Antigravity works well with Supabase. |
| Auth | Supabase Auth | Coach login via email/password or Google OAuth. Free. |
| Payments | Stripe | Global. UPI support for India. Webhooks are clean. |
| WhatsApp | Interakt (India) + WATI (Global) | WhatsApp Business API access. Interakt is ₹2,499/month. WATI similar. |
| AI | Gemini API via Google AI Studio | Free tier: 15 requests/min, 1M tokens/day. Sufficient for MVP. |
| Email | Resend | Simple transactional emails. Free 3,000/month. |
| Scheduler | Supabase Edge Functions + pg_cron | Scheduled jobs inside Supabase. No external cron service needed. |
| Hosting | Vercel (Frontend) + Supabase (Backend/DB) | Both have free tiers sufficient for MVP. |
| File Storage | Supabase Storage | For any future file uploads (profile photos, documents) |

### 6.3 Multi-Tenancy Model

Every coach is identified by a unique `coach_id` (UUID generated at account creation).

**Data Isolation Rules:**
- Every database table that contains coach-specific data has a `coach_id` column
- All backend queries include `WHERE coach_id = [authenticated coach id]` automatically
- Supabase Row Level Security (RLS) policies enforce this at the database level as a second safety layer
- A coach can never see, access, or modify another coach's data under any condition

**Coach ID Format:** UUID v4 (e.g., `a3f8b2c1-d4e5-6789-abcd-ef0123456789`)

**Supabase RLS Policy Example:**
```sql
-- On the clients table
CREATE POLICY "coaches_see_own_clients" ON clients
FOR ALL USING (coach_id = auth.uid());
```

---

## 7. DATABASE SCHEMA

### 7.1 Complete Table Definitions

```sql
-- COACHES TABLE
CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'IN',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  coaching_type TEXT[] DEFAULT '{}',
  stripe_customer_id TEXT,
  stripe_account_id TEXT,
  plan TEXT DEFAULT 'trial',
  checkin_day INTEGER DEFAULT 0, -- 0=Sunday, 1=Monday...6=Saturday
  checkin_time TEXT DEFAULT '19:00',
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROGRAMS TABLE
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  checkin_type TEXT DEFAULT 'fitness',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTS TABLE
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  primary_goal TEXT,
  health_notes TEXT,
  stripe_customer_id TEXT,
  status TEXT DEFAULT 'active', -- active | inactive | trial
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENROLLMENTS TABLE
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  program_id UUID REFERENCES programs(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'active', -- active | expired | renewed | cancelled
  renewal_reminder_1_sent BOOLEAN DEFAULT FALSE,
  renewal_reminder_2_sent BOOLEAN DEFAULT FALSE,
  churn_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHECKINS TABLE
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  enrollment_id UUID REFERENCES enrollments(id),
  week_number INTEGER NOT NULL,
  check_date DATE NOT NULL,
  raw_reply TEXT,
  weight_kg DECIMAL(5,2),
  sessions_completed INTEGER,
  energy_score INTEGER CHECK (energy_score >= 1 AND energy_score <= 10),
  notes TEXT,
  responded_at TIMESTAMPTZ,
  message_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI SUMMARIES TABLE
CREATE TABLE ai_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  summary_text TEXT NOT NULL,
  total_clients INTEGER,
  responded_count INTEGER,
  avg_energy_score DECIMAL(3,1),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_to_coach BOOLEAN DEFAULT FALSE
);

-- PAYMENTS TABLE
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  enrollment_id UUID REFERENCES enrollments(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  payment_type TEXT NOT NULL, -- new | renewal
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_payment_status TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WHATSAPP MESSAGES LOG TABLE
CREATE TABLE whatsapp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id),
  client_id UUID REFERENCES clients(id),
  direction TEXT NOT NULL, -- outbound | inbound
  message_type TEXT, -- checkin | renewal | welcome | coach_notification | summary
  message_content TEXT,
  whatsapp_message_id TEXT,
  status TEXT, -- sent | delivered | read | failed
  sent_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. API SPECIFICATIONS

### 8.1 Authentication

All API routes except `/api/auth/*` and `/api/webhook/*` require a valid JWT from Supabase Auth in the Authorization header.

`Authorization: Bearer [supabase_jwt_token]`

### 8.2 Core API Routes

**Auth Routes**
```
POST /api/auth/signup          -- Coach signup
POST /api/auth/login           -- Coach login
POST /api/auth/logout          -- Coach logout
GET  /api/auth/me              -- Get current coach profile
```

**Coach Routes**
```
GET  /api/coaches/profile      -- Get coach profile
PUT  /api/coaches/profile      -- Update coach profile
PUT  /api/coaches/settings     -- Update checkin day/time/timezone
GET  /api/coaches/dashboard    -- Dashboard summary data
```

**Program Routes**
```
GET    /api/programs           -- List all programs for coach
POST   /api/programs           -- Create new program
PUT    /api/programs/:id       -- Edit program
DELETE /api/programs/:id       -- Deactivate program
GET    /api/programs/public/:slug  -- Public: get coach's programs for intake form (no auth)
```

**Client Routes**
```
GET    /api/clients            -- List all clients with filters
GET    /api/clients/:id        -- Get single client with history
POST   /api/clients            -- Create client (internal use)
PUT    /api/clients/:id        -- Update client details
GET    /api/clients/:id/checkins  -- Get client's check-in history
GET    /api/clients/:id/payments  -- Get client's payment history
```

**Enrollment Routes**
```
GET  /api/enrollments          -- List active enrollments
GET  /api/enrollments/expiring -- List enrollments expiring in 7 days
PUT  /api/enrollments/:id/churn  -- Log churn reason
```

**Check-In Routes**
```
GET  /api/checkins/weekly      -- Get all check-ins for current week
GET  /api/checkins/summary/:week  -- Get AI summary for given week
POST /api/checkins/trigger     -- Manual trigger for coach (admin/testing)
```

**Payment Routes**
```
GET  /api/payments             -- List payments with date filter
POST /api/payments/create-link  -- Generate Stripe payment link for client
```

**Webhook Routes (no auth, signature verified)**
```
POST /api/webhook/stripe       -- Stripe payment events
POST /api/webhook/whatsapp     -- Incoming WhatsApp replies
```

**Public Routes (no auth required)**
```
GET  /api/public/:slug         -- Coach intake page data
POST /api/public/:slug/intake  -- Submit intake form
```

### 8.3 Key Request/Response Examples

**POST /api/programs**
```json
Request:
{
  "name": "12-Week Transformation",
  "duration_weeks": 12,
  "price": 15000,
  "currency": "INR",
  "checkin_type": "fitness",
  "description": "Full body transformation program"
}

Response:
{
  "id": "uuid",
  "coach_id": "uuid",
  "name": "12-Week Transformation",
  "duration_weeks": 12,
  "price": 15000,
  "currency": "INR",
  "is_active": true,
  "created_at": "2026-02-24T00:00:00Z"
}
```

**GET /api/coaches/dashboard**
```json
Response:
{
  "active_clients": 34,
  "revenue_this_month": 87500,
  "currency": "INR",
  "renewals_due_this_week": 4,
  "checkin_response_rate_last_week": 0.82,
  "clients_needing_attention": [
    {
      "id": "uuid",
      "name": "Rohan Sharma",
      "reason": "No check-in response for 2 weeks",
      "last_energy_score": 4
    }
  ],
  "last_summary_preview": "8 of 10 clients checked in. 2 struggling...",
  "renewals": [
    {
      "client_name": "Neha Singh",
      "program": "8-Week Fitness",
      "end_date": "2026-03-02",
      "days_remaining": 6
    }
  ]
}
```

### 8.4 Webhook Handler: Stripe

Events handled:
- `checkout.session.completed` → Create client + enrollment + send WhatsApp messages
- `payment_intent.succeeded` → Update payment record, if renewal update enrollment end date
- `payment_intent.payment_failed` → Flag client in dashboard if renewal, log failure

Idempotency: Check `stripe_payment_intent_id` before processing. Duplicate events return 200 with no action.

### 8.5 Webhook Handler: WhatsApp

**Incoming message processing:**
1. Extract sender phone number from payload
2. Query clients table: `SELECT * FROM clients WHERE whatsapp_number = [number]`
3. If match found, check if there is an open check-in for current week
4. Store reply in checkins table
5. Mark client as responded for current week
6. If no match found (unknown number), log to whatsapp_log with `client_id = null`

---

## 9. SCHEDULED JOBS

All scheduled jobs run via Supabase pg_cron or Edge Functions.

| Job Name | Schedule | Action |
|----------|----------|--------|
| weekly_checkin_blast | Every coach's configured day/time | Send check-in WhatsApp to all active clients of that coach |
| monday_ai_summary | Every Monday at configured time per coach | Generate Gemini summary, deliver to coach |
| daily_renewal_check | Daily at 10:00 AM UTC | Check enrollments expiring in 7 days, send reminders |
| enrollment_expiry | Daily at midnight UTC | Move expired enrollments to inactive status |
| reminder_followup | Daily at 10:00 AM UTC | Send second reminders where first sent 3+ days ago, no payment |

---

## 10. USER INTERFACE SPECIFICATIONS

### 10.1 Coach Dashboard — Page Structure

**Navigation (sidebar or top bar)**
- Home (Dashboard)
- Clients
- Programs
- Weekly Pulse
- Payments
- Settings

**Home Dashboard Layout**

```
┌──────────────────────────────────────────────┐
│  Good morning, Priya 👋   [Today's Date]     │
├──────────┬──────────┬──────────┬─────────────┤
│  Active  │  Revenue │ Renewals │  Response   │
│  Clients │  Month   │  Due 7d  │  Rate       │
│    34    │  ₹87,500 │    4     │   82%       │
├──────────┴──────────┴──────────┴─────────────┤
│  CLIENTS NEEDING ATTENTION                   │
│  ┌─────────────────────────────────────────┐ │
│  │ Rohan S.   Energy 4/10   No response 2w │ │
│  │ [Message] [View Profile]                │ │
│  ├─────────────────────────────────────────┤ │
│  │ Ankita M.  Energy 3/10   Struggling     │ │
│  │ [Message] [View Profile]                │ │
│  └─────────────────────────────────────────┘ │
├──────────────────────────────────────────────┤
│  RENEWALS DUE THIS WEEK                      │
│  Neha Singh — 8-Week Fitness — ends Mar 2    │
│  [Send Reminder]                             │
├──────────────────────────────────────────────┤
│  LAST WEEK'S PULSE (preview)                 │
│  8 of 10 responded. Avg energy: 6.8.         │
│  2 clients need attention.                   │
│  [View Full Summary]                         │
└──────────────────────────────────────────────┘
```

**Clients Page Layout**
- Table view: Name, Program, Start, End, Last Check-in, Energy Score, Status
- Filter by: Active / Inactive / Renewal Due
- Search by name or phone number
- Click row to open client profile

**Client Profile Page**
- Header: Name, photo initial, phone, email, program, dates
- Tab 1: Overview — key stats, current program status
- Tab 2: Check-in History — week by week table with all data
- Tab 3: Payment History — list of all transactions
- Quick action buttons: Send WhatsApp / Generate Renewal Link

**Weekly Pulse Page**
- Current week summary (AI generated)
- Response rate bar chart — last 8 weeks
- Week selector to view historical summaries
- Non-responders list with quick message button

**Programs Page**
- List of programs with Active/Inactive toggle
- Add New Program button
- Your onboarding link displayed prominently with copy button

**Payments Page**
- Monthly revenue chart
- List of all transactions with client name, program, amount, date, type
- Date range filter
- Currency filter (if multi-currency coach)

**Settings Page**
- Profile: Name, email, WhatsApp number, country, timezone
- Check-in: Day of week, time
- Programs: Redirect to programs page
- Billing: Manage Fitosys subscription (Stripe Customer Portal)
- Integrations: Connect WhatsApp Business number

### 10.2 Client Intake Page (Public)

URL: `fitosys.com/join/[coach-slug]`

```
┌──────────────────────────────────┐
│  [Coach Name]                    │
│  Fitness | Wellness | Yoga       │
│                                  │
│  Ready to start your journey?    │
│  Fill in your details below.     │
├──────────────────────────────────┤
│  [Intake Form Fields]            │
│                                  │
│  Select Your Program:            │
│  ○ 8-Week Fitness - ₹9,999      │
│  ○ 12-Week Transform - ₹15,000  │
│                                  │
│  [Pay Securely with Stripe]      │
│  Powered by Stripe ■■■ ■■■      │
├──────────────────────────────────┤
│  [Coach short bio — optional]    │
│  [Testimonial — optional]        │
└──────────────────────────────────┘
```

### 10.3 Design Guidelines for Antigravity Build

**Color Palette**
- Primary: `#2563EB` (Blue 600) — trust, professional
- Secondary: `#10B981` (Emerald 500) — health, growth
- Warning: `#F59E0B` (Amber 400) — renewals, attention
- Danger: `#EF4444` (Red 500) — overdue, churn
- Background: `#F9FAFB` (Gray 50)
- Card background: `#FFFFFF`
- Text primary: `#111827` (Gray 900)
- Text secondary: `#6B7280` (Gray 500)

**Typography**
- Font: Inter (Google Fonts, free)
- Heading sizes: 30px / 24px / 20px / 16px
- Body: 14px / 16px

**Design Principles**
- Mobile-first responsive layout
- Dashboard is usable on a phone in one hand
- Every important action maximum 2 taps from home
- No modals for critical actions
- Empty states always have a next-step CTA

---

## 11. GOOGLE ANTIGRAVITY BUILD INSTRUCTIONS

### 11.1 How to Use Antigravity for This PRD

Antigravity works best when you give it one focused task at a time, not the entire PRD. Use Agent Manager to spawn separate agents for separate workstreams. Do not prompt "build me a SaaS" — that produces generic garbage. Use the component-by-component approach below.

### 11.2 Build Sequence in Antigravity

**Phase 1 Prompt — Project Scaffolding**
```
Create a Next.js 14 project with TypeScript using the App Router.
Install: Tailwind CSS, Supabase client, Stripe SDK, shadcn/ui components.
Set up environment variables file with: 
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY,
STRIPE_WEBHOOK_SECRET, GEMINI_API_KEY.
Create folder structure:
app/ (pages)
components/ (reusable UI)
lib/ (supabase client, stripe client, gemini client)
types/ (TypeScript interfaces)
api/ (route handlers)
Do not generate any page content yet.
```

**Phase 2 Prompt — Database Setup**
```
Create a Supabase migration file with this exact schema:
[paste the complete SQL from Section 7.1 here]
Add Row Level Security policies so coaches can only see their own data.
RLS rule: for every table with coach_id, add policy:
USING (coach_id = auth.uid())
Generate the TypeScript types file from this schema automatically.
```

**Phase 3 Prompt — Auth System**
```
Build coach authentication using Supabase Auth.
Create pages: /login, /signup, /dashboard (protected).
Login page: email and password, simple clean form.
Signup page: email, password, full name, WhatsApp number with country code, country dropdown.
On successful signup: create a record in the coaches table with default values and a URL slug generated from their name.
Protected routes: redirect to /login if no session.
Use middleware.ts for route protection.
```

**Phase 4 Prompt — Coach Dashboard**
```
Build the /dashboard page for coaches.
Fetch data from these API routes (create them too):
GET /api/coaches/dashboard — returns the structure in Section 8.3
Display: active client count, month revenue, renewals due, response rate in 4 stat cards at top.
Below: clients needing attention section with message and view profile buttons.
Below: renewals due this week as a list.
Below: last week's AI summary preview.
Use the color palette from Section 10.3.
Mobile responsive. Use Tailwind CSS only, no custom CSS.
```

**Phase 5 Prompt — Stripe Webhooks**
```
Create /api/webhook/stripe as a Next.js route handler.
Verify Stripe webhook signature using STRIPE_WEBHOOK_SECRET.
Handle these events:
1. checkout.session.completed:
   - Create client record in Supabase
   - Create enrollment record with correct end date
   - Create payment record
   - Trigger two WhatsApp messages (client welcome, coach notification) via [WhatsApp API endpoint]
2. payment_intent.succeeded for renewals:
   - Find enrollment by stripe_payment_intent_id
   - Extend end_date by enrollment duration
   - Update payment record
   - Notify coach via WhatsApp
Handle idempotency: check if stripe_payment_intent_id already exists before processing.
Return 200 for all events including ones you do not handle.
```

**Phase 6 Prompt — Gemini AI Summary**
```
Create a function in lib/gemini.ts that:
1. Accepts an array of check-in objects: {client_name, weight, sessions, energy_score, notes}
2. Accepts coach_name, week_date_range, total_active_clients as parameters
3. Constructs the prompt from Section 5.2.3
4. Calls Gemini API via Google AI Studio endpoint with GEMINI_API_KEY
5. Returns the summary text
6. Handles API errors gracefully with a fallback message

Also create the Supabase Edge Function that:
- Runs every Monday at 7 AM UTC
- Fetches all coaches and their timezone
- For each coach, calculates if it is their Monday 7 AM
- Fetches last week's check-ins for that coach
- Calls the Gemini function above
- Stores summary in ai_summaries table
- Sends summary via WhatsApp
```

**Phase 7 Prompt — Scheduled Jobs**
```
Create Supabase Edge Functions for these scheduled jobs:
1. weekly_checkin: Query all coaches, check their configured checkin_day and checkin_time against current UTC time. For matching coaches, fetch all active clients, send check-in WhatsApp to each.
2. daily_renewal_check: Query enrollments where end_date is between today and today+7 days AND status is active AND renewal_reminder_1_sent is false. Send first renewal WhatsApp. Set renewal_reminder_1_sent to true.
3. renewal_second_reminder: Query enrollments where renewal_reminder_1_sent is true AND renewal_reminder_2_sent is false AND reminder was sent 3+ days ago AND payment not received. Send second WhatsApp. Set renewal_reminder_2_sent to true.
4. enrollment_expiry: Set enrollments to inactive where end_date < today AND status = active AND no payment in last 3 days.
Set up pg_cron in Supabase to trigger these functions.
```

### 11.3 Antigravity Pro Tips for This Build

**Use Manager View for parallel work.** While one agent builds the database schema, spawn another to build the coach signup flow. These are independent.

**Give Antigravity the TypeScript types first.** Once you generate types from the Supabase schema, paste them in every subsequent prompt. Antigravity writes much cleaner code when types are defined.

**Review Artifacts before approving.** For every task, Antigravity generates a task list and implementation plan. Read the plan before it executes. Wrong architecture at this stage breaks everything downstream.

**Gemini for structure, Claude for logic.** In Antigravity's model selector, use Gemini 3 Pro for building frontend components and page structure. Switch to Claude Sonnet for the Stripe webhook logic and Gemini AI integration. Claude handles conditional logic more reliably.

**Commit after each working feature.** Do not let Antigravity work across multiple features without committing. If something breaks, you need a clean rollback point.

---

## 12. GOOGLE AI STUDIO INTEGRATION SPEC

### 12.1 Model Configuration

```javascript
// lib/gemini.ts
const GEMINI_API_ENDPOINT = 
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

const GEMINI_CONFIG = {
  model: 'gemini-2.0-flash',  // Fast and cheap for summaries
  temperature: 0.3,           // Low temperature for consistent structured output
  maxOutputTokens: 512,       // Summaries are short
  topK: 40,
  topP: 0.95
}
```

### 12.2 Prompt Engineering Rules

Do not let Antigravity write generic prompts. Use the exact prompt from Section 5.2.3. Test it in Google AI Studio Playground first with dummy data before adding to code. Adjust temperature if output is too variable.

### 12.3 Rate Limit Management

Free tier: 15 requests per minute, 1 million tokens per day.

At 50 coaches with 20 clients each, Monday summary generation = 50 API calls. Well within free tier limits.

Add exponential backoff for rate limit errors:
- First retry: wait 4 seconds
- Second retry: wait 16 seconds
- Third retry: wait 60 seconds
- After third failure: store summary as failed, notify coach of delay, try again in 2 hours

---

## 13. NON-FUNCTIONAL REQUIREMENTS

### 13.1 Performance
- Dashboard loads under 2 seconds on 4G mobile connection
- Webhook handlers respond under 5 seconds to avoid Stripe timeout
- WhatsApp messages sent within 60 seconds of triggering event
- AI summary generation under 30 seconds per coach

### 13.2 Security
- All API routes authenticated except public intake page and webhooks
- Webhook endpoints verify cryptographic signatures before processing
- No coach can ever access another coach's client data (enforced by RLS + application layer)
- Client WhatsApp numbers stored but never exposed to the frontend without need
- Stripe handles all card data. Fitosys never stores raw card numbers.

### 13.3 Reliability
- Stripe webhook handler is idempotent (duplicate events safe)
- WhatsApp message failures logged but do not crash other operations
- Gemini API failure falls back gracefully with delayed retry
- Scheduled jobs have failure alerting to the founder's WhatsApp

### 13.4 Scalability
- MVP architecture handles 500 coaches and 20,000 clients without changes
- Supabase free tier handles up to 500 MB database and 2 GB bandwidth per month
- Scale to paid Supabase tier ($25/month) at approximately 100 coaches
- Vercel free tier handles sufficient traffic for MVP. Scale at 1,000 daily active users.

---

## 14. LAUNCH READINESS CHECKLIST

### Technical
- [ ] All 3 features working end to end in staging
- [ ] Multi-tenant data isolation tested with 2 dummy coach accounts
- [ ] Stripe webhook tested with Stripe CLI locally
- [ ] WhatsApp check-in tested with real replies
- [ ] Gemini summary tested with real check-in data
- [ ] Renewal flow tested with manual trigger
- [ ] Mobile responsive check on iPhone and Android
- [ ] Scheduled jobs verified in Supabase

### Business
- [ ] fitosys.com domain active and pointing to Vercel
- [ ] Stripe account KYC complete and live keys active
- [ ] WhatsApp Business API (Interakt or WATI) approved and number connected
- [ ] Google AI Studio API key active
- [ ] Terms of Service page live
- [ ] Privacy Policy page live
- [ ] 5 beta coaches confirmed
- [ ] First real coach onboarded and active

---

## 15. PHASE 2 ROADMAP (Post-Validation)

These features are explicitly not in Phase 1. Build them only after 20 paying coaches validate the core.

| Feature | Priority | Rationale |
|---------|----------|-----------|
| Progress photo upload by clients | High | Coaches request this universally |
| Custom check-in questions per program | High | Yoga vs fitness need different questions |
| Group coaching / cohort mode | Medium | Unlocks studio owner segment |
| Coach mobile app | Medium | Power users want native experience |
| Client progress report PDF | Medium | Premium feature, justifies Pro tier |
| Referral program for coaches | High | Viral growth mechanism |
| White label for studio owners | Low | Enterprise segment, separate pricing |
| Nutrition tracking module | Low | Scope creep risk, build only if demanded |
| API for third-party integrations | Low | Developer ecosystem, Phase 3 |

---

## 16. SUCCESS METRICS

### MVP Validation Metrics (Weeks 1 to 8)
- 5 beta coaches onboarded
- 3 of 5 beta coaches have at least 10 active clients on the platform
- Check-in response rate above 70% across beta coaches
- Renewal conversion rate above 60%
- Coach churn in first 60 days: 0

### Month 3 Targets
- 20 paying coaches at ₹1,499/month
- MRR: ₹29,980
- Average clients per coach: 15 or more
- NPS from coaches: 40 or above

### Month 6 Targets
- 50 paying coaches
- MRR: ₹74,950
- Coaches in 2 or more countries
- CAC recovered within 3 months for 80% of coaches
- LTV:CAC ratio above 8x

---

## 17. OPEN QUESTIONS FOR FOUNDER DECISION

Before development starts, these need your call:

1. **WhatsApp provider choice.** Interakt for India (₹2,499/month, good support) or WATI for global (similar pricing, stronger API). Recommendation: start with Interakt for Indian beta coaches, add WATI when first UK or Canadian coach signs up.

2. **Backend language.** Next.js API routes are simpler and Antigravity handles them well. Python FastAPI gives more control for complex scheduled jobs. Recommendation: start with Next.js API routes. Move Gemini summary job to a Python Edge Function only if needed.

3. **Beta pricing.** Charge ₹1,499 from day one or offer first 3 months free to beta coaches? Recommendation: charge from day one even if discounted to ₹499. Paying coaches behave differently from free users. Real feedback comes from paid users.

4. **Coach onboarding delivery.** Self-serve (coach sets up alone) or founder-assisted (you walk them through on a call)? Recommendation: founder-assisted for first 10 coaches. Invaluable for product learning.

---

*Document ends. Version 1.0. Build starts now.*
