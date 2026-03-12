# Fitosys Build Status — Reality Check

**Date:** 2026-03-12  
**Purpose:** Honest assessment of what's built vs. what's pending

---

## ✅ What's Actually Complete

### Foundation & Security (100%)
- [x] Rate limiting (login/signup)
- [x] Zod validation everywhere
- [x] Structured logging
- [x] OAuth redirect whitelist
- [x] Password complexity enforcement
- [x] Error code propagation
- [x] Unique slug generation

### Authentication (100%)
- [x] Email/password login + signup
- [x] Google OAuth
- [x] Session management (middleware)
- [x] Protected routes
- [x] Logout

### Infrastructure (100%)
- [x] Supabase client (server + browser)
- [x] Razorpay integration (order creation)
- [x] WhatsApp Cloud API (templates, sending)
- [x] Cron jobs (checkins, renewals, summaries)
- [x] Webhook handlers (Razorpay, WhatsApp)

---

## ⚠️ What's Partially Built (Needs Verification/Wiring)

### Public Intake Page — `/join/[slug]` (80%)
**Status:** File exists, uses **MOCK DATA**  
**Issues:**
- `MOCK_COACH` hardcoded — needs real coach fetch by slug
- `MOCK_PROGRAMS` hardcoded — needs real program fetch
- Form validation exists but not wired to backend
- Razorpay button exists but order creation not tested end-to-end

**Files:**
- `app/join/[slug]/page.tsx` — Uses mock data ❌
- `components/razorpay-button.tsx` — Need to verify implementation

**What's Needed:**
1. Replace `MOCK_COACH` with actual Supabase fetch by slug
2. Replace `MOCK_PROGRAMS` with actual program query
3. Test full payment flow (order → checkout → webhook → enrollment)

---

### Razorpay Webhook — `/api/webhooks/razorpay` (70%)
**Status:** File exists, signature verification works  
**Issues:**
- Only updates `payments.gateway_payment_status`
- **Does NOT create client record on first payment**
- **Does NOT create enrollment record** (assumes it exists)
- Welcome message logic assumes enrollment already exists

**Current Flow:**
```
Payment Success → Webhook → Update payment status → Send welcome (if enrollment exists)
```

**Required Flow:**
```
Payment Success → Webhook → Verify signature → Create client → Create enrollment → Create payment record → Send welcome
```

**Missing Logic:**
1. Check if this is first payment (`payment.notes.payment_type === "new"`)
2. Create client record if doesn't exist
3. Create enrollment record with proper start/end dates
4. Update enrollment status from `pending` → `active`
5. THEN send welcome message

---

### Dashboard Data API — `/api/dashboard/data` (90%)
**Status:** File exists, fetches data  
**Issues:**
- Returns comprehensive data but UI may not be fully wired
- Need to verify all dashboard components consume this endpoint
- May need additional endpoints for specific views (renewals, payments table)

---

## ❌ What's NOT Built (According to PRD Sequence)

### 1. Client List + Profile — `/dashboard/clients` (0%)
**Status:** Files exist from Sprint 1 but need verification

**Check Required:**
- Does `/dashboard/clients` show real client list with search/filter?
- Does `/dashboard/clients/[id]` show full profile with:
  - 7-week check-in history?
  - Payment history table?
  - AI insights panel?
  - Manual check-in override?

**Files to Verify:**
- `app/dashboard/clients/page.tsx`
- `app/dashboard/clients/[id]/page.tsx`
- `app/api/clients/route.ts`
- `app/api/clients/[id]/route.ts`

---

### 2. Programs CRUD UI (0%)
**Status:** API endpoints exist, **NO UI**

**What's Missing:**
- `/dashboard/programs` — List page with search/filter
- `/dashboard/programs/create` — Create form
- `/dashboard/programs/[id]` — Detail/edit page
- Copy intake link button
- Soft delete confirmation

**API Endpoints (Exist):**
- `GET /api/programs` — List
- `POST /api/programs` — Create
- `PUT /api/programs/[id]` — Update
- `DELETE /api/programs/[id]` — Soft delete
- `GET /api/programs/public/[slug]` — Public lookup

---

### 3. Billing Dashboard — `/dashboard/settings/billing` (0%)
**Status:** Not built

**What's Needed:**
- Current plan display
- Usage meter (clients enrolled vs. plan limit)
- Upgrade/downgrade flow
- Invoice history table
- Payment method management

---

### 4. Weekly Pulse View (0%)
**Status:** AI summary cron exists, **no display UI**

**What's Needed:**
- Display latest AI summary (Monday 7AM)
- 8-week check-in trend chart
- Client flag list (At Risk/Strong/Watch)
- Download/share as PDF

---

### 5. Payments List — `/dashboard/payments` (0%)
**Status:** Not built

**What's Needed:**
- Transaction table (all payments)
- Month filter
- Status badges (Captured/Failed/Refunded)
- Search by client name

---

### 6. Settings Pages (0%)
**Status:** Not built

**What's Needed:**
- `/dashboard/settings/profile` — Edit name, email, WhatsApp
- `/dashboard/settings/notifications` — Email/WhatsApp toggles
- `/dashboard/settings/security` — Change password
- `/dashboard/settings/check-in` — Configure day/time

---

## 🔍 Critical Path Analysis

### Revenue-Generating Flow (MUST WORK)

```
1. Coach creates program → /dashboard/programs/create ❌ NOT BUILT
2. Client visits /join/[slug] → ✅ EXISTS (mock data)
3. Client fills intake form → ⚠️ PARTIAL (not wired to backend)
4. Razorpay order created → ⚠️ PARTIAL (order creation exists, not tested)
5. Client completes payment → ✅ RAZORPAY HANDLES
6. Webhook fires → ⚠️ PARTIAL (doesn't create client/enrollment)
7. Welcome message sent → ⚠️ PARTIAL (assumes enrollment exists)
8. Client appears in coach dashboard → ❌ NOT BUILT (client list UI missing)
```

**Blockers:**
1. **Program creation UI** — Coach can't create programs without UI
2. **Intake backend wiring** — Form submits to nowhere
3. **Webhook client/enrollment creation** — Payment succeeds but no record created
4. **Client list UI** — Coach can't see enrolled clients

---

## 📋 Immediate Build Priority (Next 48 Hours)

### P0-1: Wire Intake Form to Backend
**File:** `app/join/[slug]/page.tsx`

**Changes:**
```tsx
// Replace MOCK_COACH with:
const { data: coach } = await supabase
  .from("coaches")
  .select("*, coaching_type")
  .eq("slug", slug)
  .eq("status", "active")
  .single();

// Replace MOCK_PROGRAMS with:
const { data: programs } = await supabase
  .from("programs")
  .select("*")
  .eq("coach_id", coach.id)
  .eq("is_active", true);
```

**Test:** Visit `/join/priya-sharma` and verify real coach/programs load

---

### P0-2: Fix Razorpay Webhook to Create Client + Enrollment
**File:** `app/api/webhooks/razorpay/route.ts`

**Add to `payment.captured` case:**
```typescript
if (payment.notes?.payment_type === "new") {
  // 1. Create client if doesn't exist
  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("email", payment.notes.client_email)
    .single();

  let clientId = existingClient?.id;

  if (!clientId) {
    const { data: newClient } = await supabase
      .from("clients")
      .insert({
        coach_id: payment.notes.coach_id,
        full_name: payment.notes.client_full_name,
        email: payment.notes.client_email,
        whatsapp_number: payment.notes.client_whatsapp,
        age: parseInt(payment.notes.client_age) || null,
        primary_goal: payment.notes.client_primary_goal,
        health_conditions: payment.notes.client_health_notes,
        status: "active",
      })
      .select()
      .single();
    clientId = newClient.id;
  }

  // 2. Update enrollment status
  if (payment.notes.enrollment_id) {
    await supabase
      .from("enrollments")
      .update({ status: "active", client_id: clientId })
      .eq("id", payment.notes.enrollment_id);
  }
}
```

**Test:** Complete test payment → Verify client + enrollment records created

---

### P0-3: Build Program Creation UI
**Files to Create:**
- `app/dashboard/programs/page.tsx` — List page
- `app/dashboard/programs/create/page.tsx` — Create form
- `components/programs/program-form.tsx` — Shared form

**Minimum Viable:**
- Form with: name, duration_weeks, price, currency, description
- Submit to `POST /api/programs`
- Redirect to list page on success
- Show success/error toast

---

## 📊 Real Status Summary

| Area | Claimed | Actual | Gap |
|------|---------|--------|-----|
| Authentication | 100% | 100% | ✅ |
| Security | 100% | 100% | ✅ |
| Intake Page | Built | Mock Data | ⚠️ 80% |
| Razorpay Webhook | Built | Partial | ⚠️ 70% |
| Client Management | Built | UI Missing | ❌ 40% |
| Program Management | API Built | UI Missing | ❌ 20% |
| Billing | — | Not Built | ❌ 0% |
| Settings | — | Not Built | ❌ 0% |

**Overall MVP Completion:** ~55% (not 80% as previously thought)

---

## 🎯 Revised Next Steps

### Week 1 (Mar 13-19): Revenue Flow
1. Wire intake page to real data
2. Fix webhook to create client + enrollment
3. Build program creation UI
4. End-to-end test: Create program → Enroll client → Payment → Dashboard

### Week 2 (Mar 20-26): Coach Dashboard
1. Client list page with search/filter
2. Client detail page (7-week history, payments)
3. Basic settings (profile edit, check-in config)

### Week 3 (Mar 27-Apr 2): Billing + Polish
1. Billing dashboard
2. Usage meter
3. Invoice table
4. Bug fixes, edge cases

---

**Bottom Line:** Security foundation is solid. Now we need to build the actual revenue-generating features. No more infrastructure work until the intake → payment → enrollment flow works end-to-end.
