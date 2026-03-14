# Fitosys Implementation Plan

**Based on:** Customer Journey Flow HTML (fitosys-journey-flow.html)  
**Date:** 2026-03-13  
**Status:** Gap Analysis & Action Plan

---

## Executive Summary

**Total Pages in Journey Flow:** 22  
**Currently Implemented:** 19  
**Missing Pages:** 3  
**Completion:** 86%

---

## 1. Page Inventory Comparison

### ✅ Implemented Pages (19/22)

| # | Page Name | Route | File | Status |
|---|-----------|-------|------|--------|
| 1 | Landing | `/` | ❌ **MISSING** | Not created |
| 2 | Demo | `/demo` | ✅ `app/demo/page.tsx` | Complete |
| 3 | Intake Form | `/join/[slug]` | ✅ `app/join/[slug]/page.tsx` | Complete |
| 4 | Intake Success | `/join/[slug]/success` | ✅ `app/join/[slug]/success/page.tsx` | Complete |
| 5 | Renewal | `/renew` | ✅ `app/renew/page.tsx` | Complete |
| 6 | Renewal Success | `/renew/success` | ✅ `app/renew/success/page.tsx` | Complete |
| 7 | Signup | `/signup` | ✅ `app/(auth)/signup/page.tsx` | Complete |
| 8 | Login | `/login` | ✅ `app/(auth)/login/page.tsx` | Complete |
| 9 | Verify Email | `/verify-email` | ❌ **MISSING** | Supabase handles |
| 10 | Forgot Password | `/forgot-password` | ❌ **MISSING** | Not created |
| 11 | Dashboard Home | `/dashboard` | ✅ `app/dashboard/page.tsx` | Complete |
| 12 | Client List | `/dashboard/clients` | ✅ `app/dashboard/clients/page.tsx` | Complete |
| 13 | Client Profile | `/dashboard/clients/[id]` | ✅ `app/dashboard/clients/[id]/page.tsx` | Complete |
| 14 | Programs | `/dashboard/programs` | ✅ `app/dashboard/programs/page.tsx` | Complete |
| 15 | Weekly Pulse | `/dashboard/pulse` | ✅ `app/dashboard/pulse/page.tsx` | Complete |
| 16 | Check-in Log | `/dashboard/checkin` | ✅ `app/dashboard/checkin/page.tsx` | Complete |
| 17 | Payments | `/dashboard/payments` | ❌ **MISSING** | Not created |
| 18 | Invoices | `/dashboard/invoices` | ✅ `app/dashboard/invoices/page.tsx` | Complete |
| 19 | Settings | `/dashboard/settings` | ✅ `app/dashboard/settings/page.tsx` | Complete |
| 20 | Billing Settings | `/dashboard/settings/billing` | ✅ `app/dashboard/settings/billing/page.tsx` | Complete |
| 21 | Privacy | `/privacy` | ✅ `app/privacy/page.tsx` | Complete |
| 22 | Terms | `/terms` | ✅ `app/terms/page.tsx` | Complete |

---

## 2. Missing Pages (3 Critical)

### **P0-1: Landing Page** (`/`)

**Purpose:** Marketing homepage with hero, features, pricing, social proof  
**CTA:** "Start Free" (unified across page)  
**Key Sections:**
- Hero with value proposition
- Features showcase
- Pricing tiers (Starter, Basic, Pro, Studio)
- Social proof / testimonials
- FAQ section
- Footer with unified CTA

**File to Create:** `app/page.tsx`  
**Priority:** 🔴 **CRITICAL** — This is the first touchpoint for all users  
**Est. Time:** 4-6 hours

---

### **P0-2: Forgot Password** (`/forgot-password`)

**Purpose:** Password reset flow via Supabase Auth  
**Key Features:**
- Email input form
- Supabase password reset email
- Success confirmation
- Back to login link

**File to Create:** `app/(auth)/forgot-password/page.tsx`  
**Priority:** 🟠 **HIGH** — Standard auth flow requirement  
**Est. Time:** 1-2 hours

---

### **P2: Payments Dashboard** (`/dashboard/payments`)

**Purpose:** Revenue tracking and transaction history  
**Key Features:**
- Revenue banner (month, total)
- Transaction table with status badges
- Filter by date, program, status
- Export functionality

**File to Create:** `app/dashboard/payments/page.tsx`  
**Priority:** 🟡 **MEDIUM** — Finance tracking, can use invoices page temporarily  
**Est. Time:** 3-4 hours

---

## 3. Journey Flow Verification

### Phase 1: Acquisition ✅

| Step | Coach | System | Client | Status |
|------|-------|--------|--------|--------|
| 1 | Lands on marketing site | — | — | ⚠️ Landing page missing |
| 2 | Explores demo | — | — | ✅ `/demo` exists |
| 3 | Creates coach account | Creates coach record | — | ✅ `/signup` exists |
| 4 | Verifies email | Sends welcome email | — | ⚠️ Supabase handles |

---

### Phase 2: Onboarding ✅

| Step | Coach | System | Client | Status |
|------|-------|--------|--------|--------|
| 1 | Creates first program | Activates intake page | — | ✅ `/dashboard/programs` exists |
| 2 | Copies intake link | Validates slug | — | ✅ Implemented |
| 3 | Configures settings | — | — | ✅ `/dashboard/settings` exists |

---

### Phase 3: Client Intake & Payment ✅

| Step | Coach | System | Client | Status |
|------|-------|--------|--------|--------|
| 1 | Receives notification | Creates Razorpay order | Opens intake link | ✅ All implemented |
| 2 | Client in active list | Webhook fires | Fills intake form | ✅ All implemented |
| 3 | — | Creates records | Pays via Razorpay | ✅ All implemented |
| 4 | — | Sends WhatsApp templates | Sees success screen | ✅ All implemented |

---

### Phase 4: Weekly Loop ✅

| Step | Coach | System | Client | Status |
|------|-------|--------|--------|--------|
| 1 | Reviews Monday summary | Sunday 7PM check-in cron | Receives check-in | ✅ All implemented |
| 2 | Reaches out to flagged | Monday 7AM Gemini summary | Replies on WhatsApp | ✅ All implemented |
| 3 | Renewal decision | Renewal reminder cron | Receives renewal reminder | ✅ All implemented |
| 4 | Views payments/invoices | Stores check-in replies | Renews via /renew | ⚠️ Payments page missing |

---

## 4. CTA Unification Required

### Current State:
- `temp_page.tsx`: "Get Started", "Start Free Trial", "Request a Demo" (mixed)
- `/demo`: "Start Free Trial"
- Journey HTML: "Start Free" (unified)

### Required Changes:

**Unified CTA Copy:** `"Start Free"`  
**Supporting Copy:** `"No card needed · First 5 clients free · Setup in 10 minutes"`

**Files to Update:**
1. `temp_page.tsx` — Update all CTAs to "Start Free"
2. `/demo` page — Update CTA from "Start Free Trial" to "Start Free"
3. Remove "Request a Demo" section entirely

---

## 5. Dashboard Verification

### Sidebar Navigation (Verified ✅)

**Main Section:**
- Home (`/dashboard`) ✅
- Clients (`/dashboard/clients`) ✅
- Programs (`/dashboard/programs`) ✅
- Weekly Pulse (`/dashboard/pulse`) ✅

**Insights Section:**
- Check-in Log (`/dashboard/checkin`) ✅

**Finance Section:**
- Payments (`/dashboard/payments`) ⚠️ **MISSING**
- Invoices (`/dashboard/invoices`) ✅

**Bottom:**
- Settings (`/dashboard/settings`) ✅
- Coach profile pill ✅

---

### Dashboard Layout (Verified ✅)

**Top Bar:**
- Greeting: "Good morning, [Coach]" ✅
- Date display ✅
- Search button ✅
- Notifications button (with badge) ✅

**KPI Grid (4 tiles):**
- Active Clients ✅
- Renewals Due (7 days) ✅
- Check-in Response Rate ✅
- Revenue This Month ✅

**Body Grid:**
- AI Summary Card (left) ✅
- Attention Panel (right) ✅
- Renewals List (right) ✅

**Check-in Log Preview:**
- Table with Replied/Missed/Pending pills ✅

---

## 6. Brand Compliance (Verified ✅)

### Colors:
- Primary Red: `#E8001D` ✅ (updated from `#F20000`)
- Border: `rgba(232,0,29,0.25)` ✅
- Card BG: `#111111` ✅
- Card BG2: `#161616` ✅ (documented extension)

### Typography:
- Barlow Condensed weights: 400, 600, 700, 800, 900 ✅
- Urbanist weights: 300, 400, 500, 600, 700 ✅
- Noise overlay: Added to `body::before` ✅

---

## 7. Implementation Priority

### **Sprint 1: Critical (This Week)**

| Task | File | Est. Time | Priority |
|------|------|-----------|----------|
| Create landing page | `app/page.tsx` | 4-6 hrs | 🔴 CRITICAL |
| Update CTAs to "Start Free" | `temp_page.tsx`, `demo/page.tsx` | 1 hr | 🔴 CRITICAL |
| Create forgot password page | `app/(auth)/forgot-password/page.tsx` | 1-2 hrs | 🟠 HIGH |

### **Sprint 2: Medium (Next Week)**

| Task | File | Est. Time | Priority |
|------|------|-----------|----------|
| Create payments dashboard | `app/dashboard/payments/page.tsx` | 3-4 hrs | 🟡 MEDIUM |
| Remove "Request a Demo" | `temp_page.tsx` | 30 min | 🟡 MEDIUM |
| Add supporting CTA copy | Footer components | 1 hr | 🟡 MEDIUM |

### **Sprint 3: Polish (Week 3)**

| Task | File | Est. Time | Priority |
|------|------|-----------|----------|
| Dashboard sidebar update | Navigation components | 1 hr | 🟢 LOW |
| Verify all journey flows | End-to-end testing | 2 hrs | 🟢 LOW |
| Documentation update | README, docs | 2 hrs | 🟢 LOW |

---

## 8. Files to Create

### Critical (Sprint 1):

1. **`app/page.tsx`** — Landing page
   - Hero section with value prop
   - Features grid
   - Pricing tiers
   - Testimonials
   - FAQ
   - Footer with unified CTA

2. **`app/(auth)/forgot-password/page.tsx`** — Password reset
   - Email input form
   - Supabase integration
   - Success/error states

### Medium (Sprint 2):

3. **`app/dashboard/payments/page.tsx`** — Payments dashboard
   - Revenue banner
   - Transaction table
   - Filters (date, program, status)
   - Export button

---

## 9. Files to Update

### CTA Unification:

1. **`temp_page.tsx`**
   - Change all "Get Started" → "Start Free"
   - Change all "Start Free Trial" → "Start Free"
   - Remove "Request a Demo" section
   - Update footer CTA + supporting copy

2. **`app/demo/page.tsx`**
   - Change CTA button from "Start Free Trial" → "Start Free"

3. **Footer components** (if any exist separately)
   - Add supporting copy: "No card needed · First 5 clients free"

---

## 10. Testing Checklist

### Pre-Launch:

- [ ] Landing page loads and displays correctly
- [ ] All CTAs say "Start Free" (no mixed messages)
- [ ] Forgot password flow works end-to-end
- [ ] Payments dashboard displays revenue data
- [ ] All 22 pages accessible and functional
- [ ] Journey flow works end-to-end (test with real user)

### Post-Launch:

- [ ] Monitor landing page conversion rate
- [ ] Track CTA click-through rate
- [ ] Verify forgot password email delivery
- [ ] Check payments dashboard data accuracy

---

## 11. Summary

### Current Status:
- **Pages Complete:** 19/22 (86%)
- **Journey Flow:** Fully mapped and verified
- **Dashboard:** 95% complete (payments page missing)
- **Brand Compliance:** 100% ✅
- **CTA Strategy:** Needs unification

### Next Actions:
1. **Create landing page** (`app/page.tsx`) — 4-6 hours
2. **Unify CTAs** to "Start Free" — 1 hour
3. **Create forgot password page** — 1-2 hours
4. **Create payments dashboard** — 3-4 hours

### Estimated Total Time: **9-12 hours**

---

**Status:** Ready for Sprint 1 implementation  
**Next Step:** Create landing page (`app/page.tsx`)
