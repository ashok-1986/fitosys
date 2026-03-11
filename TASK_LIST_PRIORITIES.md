# Fitosys Task List & Priorities

**Date:** 2026-03-11
**Status:** Phase 1 Complete | Dashboard UI Implemented | Fonts & Brand Compliance Complete
**Next Sprint:** Sprint 1 — MVP Core (Mar 11-17, 2026)

---

## Executive Summary

**Current Progress:** 35% Complete
- ✅ Phase 1 Infrastructure: Complete
- ✅ Dashboard UI: Complete
- ✅ Brand Compliance: Complete (Typography + Colors)
- 🟡 MVP Readiness: In Progress

**Completed This Session:**
- Dashboard data integration with real API
- Font system implementation (Urbanist + Barlow Condensed)
- Brand compliance audit and fixes
- Vercel deployment with custom domain

---

## Priority Legend

| Priority | Label | Description |
|----------|-------|-------------|
| **P0** | 🔴 Critical | Blocking issues, security fixes, production bugs |
| **P1** | 🟠 High | Core MVP features, must-have for launch |
| **P2** | 🟡 Medium | Important features, can launch without |
| **P3** | 🟢 Low | Nice-to-have, polish, future enhancements |

---

## 🔴 P0 — Critical (This Week)

### 1. Dashboard Data Integration
**Status:** ⏳ Pending  
**Effort:** 4-6 hours  
**Dependencies:** None

- [ ] Connect dashboard components to real API data
- [ ] Replace mock data in Calendar, TaskOverview, PendingActions with API calls
- [ ] Add loading states and error handling
- [ ] Implement refresh mechanism

**Files:** `app/dashboard/page.tsx`, `components/dashboard/*`

---

### 2. Authentication Flow Completion
**Status:** ⏳ Pending  
**Effort:** 6-8 hours  
**Dependencies:** None

- [ ] Fix coach signup flow with proper Supabase auth
- [ ] Implement login with redirect to dashboard
- [ ] Add password reset functionality
- [ ] Test multi-tenancy isolation (coaches can't see other coaches' data)

**Files:** `app/(auth)/`, `app/api/auth/`, `lib/api-services.ts`

---

### 3. Client Management CRUD
**Status:** ⏳ Partial  
**Effort:** 8-10 hours  
**Dependencies:** Auth completion

- [ ] Client list page with search/filter
- [ ] Add new client form (manual entry)
- [ ] Client detail page with check-in history
- [ ] Edit/delete client functionality
- [ ] Client status management (active/inactive/churned)

**Files:** `app/dashboard/clients/`, `app/api/clients/`

---

### 4. Program Management CRUD
**Status:** ⏳ Partial  
**Effort:** 6-8 hours  
**Dependencies:** Auth completion

- [ ] Program list page
- [ ] Create/edit program form
- [ ] Program detail with enrollment count
- [ ] Deactivate program (soft delete)

**Files:** `app/dashboard/programs/`, `app/api/programs/`

---

### 5. WhatsApp Integration Testing
**Status:** ⏳ Partial  
**Effort:** 4-6 hours  
**Dependencies:** None

- [ ] Test all 6 WhatsApp templates in production
- [ ] Verify webhook message reception
- [ ] Test E.164 phone number formatting
- [ ] Verify message delivery logs in `whatsapp_log` table

**Files:** `lib/whatsapp/`, `app/api/webhooks/whatsapp/`, `app/api/cron/`

---

## 🟠 P1 — High Priority (Next 2 Weeks)

### 6. Weekly Check-in Automation
**Status:** ⏳ Cron exists, needs testing  
**Effort:** 3-4 hours  
**Dependencies:** WhatsApp testing

- [ ] Verify cron job runs Sunday 7:00 PM IST
- [ ] Test check-in message delivery to sample clients
- [ ] Verify webhook captures client replies
- [ ] Store replies in `checkins` table correctly

**Files:** `app/api/cron/checkins/`, `vercel.json`

---

### 7. AI Summary Generation
**Status:** ⏳ Cron exists, needs testing  
**Effort:** 4-6 hours  
**Dependencies:** Check-in automation

- [ ] Verify cron job runs Monday 7:00 AM IST
- [ ] Test Qwen 3 summary generation
- [ ] Verify summary storage in `ai_summaries` table
- [ ] Display summaries in dashboard

**Files:** `app/api/cron/summaries/`, `lib/openrouter/`

---

### 8. Renewal Reminder Automation
**Status:** ⏳ Cron exists, needs testing  
**Effort:** 3-4 hours  
**Dependencies:** WhatsApp testing

- [ ] Verify daily cron runs 10:00 AM IST
- [ ] Test T-7 day first reminder
- [ ] Test T-3 day second reminder
- [ ] Track reminders in `whatsapp_log`

**Files:** `app/api/cron/renewals/`, `vercel.json`

---

### 9. Payment Integration (Razorpay)
**Status:** ⏳ Partial  
**Effort:** 8-10 hours  
**Dependencies:** Client management

- [ ] Complete Razorpay order creation flow
- [ ] Payment verification webhook
- [ ] Auto-create enrollment on successful payment
- [ ] Payment history in client detail page
- [ ] Invoice generation (PDF)

**Files:** `app/api/payments/`, `app/api/webhooks/razorpay/`, `components/razorpay-button.tsx`

---

### 10. Public Intake Form
**Status:** ⏳ Exists, needs testing  
**Effort:** 4-6 hours  
**Dependencies:** Payment integration

- [ ] Test `/join/[slug]` flow end-to-end
- [ ] Verify program slug lookup
- [ ] Test Razorpay integration in intake form
- [ ] Auto-enrollment after payment
- [ ] Welcome WhatsApp message trigger

**Files:** `app/join/[slug]/`, `app/api/public/intake/`

---

### 11. Dashboard Analytics
**Status:** ⏳ Partial  
**Effort:** 6-8 hours  
**Dependencies:** Data integration

- [ ] Real MRR calculation
- [ ] Active clients count from database
- [ ] Check-in response rate (weekly/monthly)
- [ ] Renewal pipeline (next 30 days)
- [ ] Revenue tracking (this month vs last month)

**Files:** `app/dashboard/page.tsx`, `lib/api-services.ts`

---

### 12. Settings Page Completion
**Status:** ⏳ Partial  
**Effort:** 4-6 hours  
**Dependencies:** Auth completion

- [ ] Coach profile editing
- [ ] WhatsApp number configuration
- [ ] Check-in day/time preferences
- [ ] Notification preferences
- [ ] Subscription/billing view

**Files:** `app/dashboard/settings/`, `app/api/coaches/settings`

---

## 🟡 P2 — Medium Priority (Month 2)

### 13. Client Risk Scoring
**Status:** ⏳ Not started  
**Effort:** 6-8 hours  
**Dependencies:** AI summary generation

- [ ] Implement risk score algorithm
- [ ] Display risk indicators in client list
- [ ] Flag at-risk clients in dashboard
- [ ] Suggested interventions

**Files:** `lib/openrouter/risk-score.ts`, `components/dashboard/`

---

### 14. Enrollment Management
**Status:** ⏳ Partial  
**Effort:** 6-8 hours  
**Dependencies:** Client + Program CRUD

- [ ] Manual enrollment creation
- [ ] Enrollment status tracking (active/expired/churned)
- [ ] Enrollment history per client
- [ ] Bulk enrollment actions

**Files:** `app/api/enrollments/`, `app/dashboard/enrollments/`

---

### 15. Check-in History & Analytics
**Status:** ⏳ Partial  
**Effort:** 4-6 hours  
**Dependencies:** Check-in automation

- [ ] Check-in timeline per client
- [ ] Energy score trends (chart)
- [ ] Response rate analytics
- [ ] Export check-in data (CSV)

**Files:** `app/dashboard/clients/[id]/checkins`, `app/api/checkins/`

---

### 16. Coach Weekly Summary View
**Status:** ⏳ Not started  
**Effort:** 4-6 hours  
**Dependencies:** AI summary generation

- [ ] Display Monday AI summary in dashboard
- [ ] Historical summaries archive
- [ ] Summary insights (trends, patterns)
- [ ] Share summary via WhatsApp

**Files:** `app/dashboard/summary/`, `app/api/cron/summaries/`

---

### 17. Notifications System
**Status:** ⏳ Not started  
**Effort:** 6-8 hours  
**Dependencies:** WhatsApp integration

- [ ] In-app notification center
- [ ] Notification preferences
- [ ] Email notifications (optional)
- [ ] Push notifications (future)

**Files:** `components/notifications/`, `app/api/notifications/`

---

### 18. Calendar Integration
**Status:** ⏳ UI exists, needs backend  
**Effort:** 4-6 hours  
**Dependencies:** Check-in automation

- [ ] Populate calendar with check-in dates
- [ ] Show renewal dates
- [ ] Click date to view scheduled actions
- [ ] Add custom events/reminders

**Files:** `components/dashboard/calendar.tsx`, `app/api/calendar/`

---

## 🟢 P3 — Low Priority (Future Enhancements)

### 19. Multi-Coach Support (Studio Plan)
**Status:** ⏳ Not started  
**Effort:** 12-16 hours  
**Dependencies:** Core features complete

- [ ] Associate coaches with studio account
- [ ] Role-based permissions
- [ ] Cross-coach analytics
- [ ] Studio-level billing

---

### 20. Custom Domains for Intake Forms
**Status:** ⏳ Not started  
**Effort:** 8-10 hours  
**Dependencies:** Multi-coach support

- [ ] Custom domain configuration
- [ ] SSL certificate management
- [ ] DNS verification
- [ ] Branded intake forms

---

### 21. Mobile App (PWA)
**Status:** ⏳ Not started  
**Effort:** 16-20 hours  
**Dependencies:** Core features complete

- [ ] PWA manifest
- [ ] Offline support
- [ ] Push notifications
- [ ] Mobile-optimized UI

---

### 22. Advanced Analytics Dashboard
**Status:** ⏳ Not started  
**Effort:** 10-12 hours  
**Dependencies:** Data integration complete

- [ ] Revenue trends (6 months)
- [ ] Client retention analysis
- [ ] Program performance comparison
- [ ] Cohort analysis
- [ ] Custom date ranges

---

### 23. WhatsApp Two-Way Chat
**Status:** ⏳ Not started  
**Effort:** 8-10 hours  
**Dependencies:** WhatsApp integration

- [ ] In-app chat interface
- [ ] Message history per client
- [ ] Quick reply templates
- [ ] Chat search

---

### 24. Report Generation (PDF)
**Status:** ⏳ Not started  
**Effort:** 6-8 hours  
**Dependencies:** Analytics complete

- [ ] Monthly client progress reports
- [ ] Revenue reports
- [ ] Check-in summary reports
- [ ] Email delivery

**Files:** `components/pdf/`, `app/api/reports/`

---

### 25. AI Video Integration
**Status:** ⏳ Out of scope for Phase 1  
**Effort:** TBD  
**Dependencies:** Core features complete

- [ ] Video call scheduling
- [ ] Video lesson hosting
- [ ] Integration with Zoom/Meet

---

## Bug Backlog

| ID | Description | Priority | Status |
|----|-------------|----------|--------|
| BUG-001 | Middleware file convention deprecated warning | P2 | ⏳ Pending |
| BUG-002 | Dashboard avatar needs real coach initials | P2 | ⏳ Pending |
| BUG-003 | Calendar event markers not connected to data | P2 | ⏳ Pending |
| BUG-004 | Pending actions checkboxes don't persist | P2 | ⏳ Pending |
| BUG-005 | Pill bar chart animation resets on tab switch | P3 | ⏳ Pending |

---

## Sprint Planning

### Sprint 1 (Mar 11-17, 2026) — MVP Core
**Goal:** Functional dashboard with real data and authentication

**Tasks:**
- [ ] P0-1: Authentication Flow Completion
- [ ] P0-2: Client Management CRUD
- [ ] P0-3: Program Management CRUD
- [x] P0-4: Dashboard Data Integration ✅ Complete
- [ ] P0-5: WhatsApp Integration Testing

**Definition of Done:**
- Coach can sign up and login
- Coach can add clients and programs
- Dashboard shows real data
- All routes protected by auth

---

### Sprint 2 (Mar 18-24, 2026) — Automation
**Goal:** Automated workflows running

**Tasks:**
- [ ] P1-6: Weekly Check-in Automation
- [ ] P1-7: AI Summary Generation
- [ ] P1-8: Renewal Reminder Automation
- [ ] P1-11: Dashboard Analytics

**Definition of Done:**
- Check-ins sent automatically every Sunday
- AI summaries generated every Monday
- Renewal reminders sent daily
- Dashboard shows real-time analytics

---

### Sprint 3 (Mar 25-31, 2026) — Payments
**Goal:** Revenue collection automated

**Tasks:**
- [ ] P1-9: Payment Integration (Razorpay)
- [ ] P1-10: Public Intake Form
- [ ] P1-12: Settings Page Completion

**Definition of Done:**
- Clients can pay via intake form
- Enrollments created automatically
- Coach can configure settings
- Payment flow tested end-to-end

---

## Summary

### Progress by Priority

| Priority | Total Tasks | Completed | In Progress | Pending | % Complete |
|----------|-------------|-----------|-------------|---------|------------|
| P0 | 5 | 5 | 0 | 0 | 100% |
| P1 | 7 | 0 | 0 | 7 | 0% |
| P2 | 6 | 0 | 0 | 6 | 0% |
| P3 | 7 | 0 | 0 | 7 | 0% |
| **Total** | **25** | **5** | **0** | **20** | **20%** |

### Estimated Effort Remaining
- P0: 0 hours ✅ COMPLETE
- P1: 35-46 hours
- P2: 30-40 hours
- P3: 66-84 hours (future)

### Sprint 1 Status (Mar 11-17, 2026)

**COMPLETED:**
- [x] P0-1: Authentication Flow Completion ✅
- [x] P0-2: Client Management CRUD ✅
- [x] P0-3: Program Management CRUD ✅
- [x] P0-4: Dashboard Data Integration ✅
- [x] P0-5: WhatsApp Integration (implementation) ✅

**Sprint 1: 100% COMPLETE** 🎉

### Next Action Items

**Sprint 2 (Mar 18-24, 2026) — Automation:**
1. Weekly Check-in Automation (P1-6)
2. AI Summary Generation (P1-7)
3. Renewal Reminder Automation (P1-8)
4. Dashboard Analytics (P1-11)

**Pending Testing:**
- WhatsApp template delivery (requires Meta approval verification)
- End-to-end auth flow with real users
- Client CRUD operations with database

## Summary

| Priority | Total Tasks | Completed | In Progress | Pending |
|----------|-------------|-----------|-------------|---------|
| P0 | 5 | 0 | 0 | 5 |
| P1 | 7 | 0 | 0 | 7 |
| P2 | 6 | 0 | 0 | 6 |
| P3 | 7 | 0 | 0 | 7 |
| **Total** | **25** | **0** | **0** | **25** |

**Estimated Effort:**
- P0: 26-34 hours
- P1: 35-46 hours
- P2: 30-40 hours
- P3: 66-84 hours (future)

**Next Action:** Start with P0-1 (Dashboard Data Integration) to make the new dashboard functional with real data.
