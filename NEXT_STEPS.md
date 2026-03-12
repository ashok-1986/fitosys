# Fitosys Next Steps

**Last Updated:** 2026-03-12  
**Status:** Security Foundation Complete — Ready for Feature Development

---

## ✅ Completed (Sprint 1 + Security)

### MVP Core Features (100% Complete)
- [x] Authentication (Email/Password + Google OAuth)
- [x] Client Management CRUD
- [x] Program Management CRUD
- [x] Dashboard Data Integration
- [x] WhatsApp Integration (templates, webhooks, cron jobs)
- [x] Razorpay Payment Integration
- [x] AI Summary Generation (Qwen 3)
- [x] Landing Page with GSAP animations
- [x] Brand compliance (typography, colors, logo)

### Security Hardening (100% Complete)
- [x] Rate limiting on login/signup
- [x] Zod validation across all forms
- [x] Structured logging
- [x] Unique slug generation
- [x] Email/WhatsApp normalization
- [x] Try/catch error handling
- [x] OAuth redirect whitelist
- [x] Password complexity enforcement
- [x] Error code propagation

---

## 🎯 Next Priorities (Sprint 2)

### P0 — Critical Path (Week 1-2)

#### 1. Client Detail Page Enhancement
**Priority:** P0 | **Effort:** Medium | **Impact:** High

**Current State:** Basic client profile exists  
**Missing:**
- Full check-in history with week-by-week navigation
- Payment history table with status badges
- AI insights panel (trend analysis, risk factors)
- Manual check-in override (coach can add entries)
- Export to PDF/WhatsApp functionality

**Files to Create/Modify:**
- `app/dashboard/clients/[id]/checkins.tsx` — Check-in timeline
- `app/dashboard/clients/[id]/payments.tsx` — Payment history
- `app/dashboard/clients/[id]/ai-insights.tsx` — AI analysis panel
- `app/api/clients/[id]/checkins/route.ts` — POST endpoint for manual entries
- `app/api/clients/[id]/export/route.ts` — PDF export endpoint

**Acceptance Criteria:**
- Coach can view all 7 weeks of check-in data
- Coach can add manual check-in if client missed
- Payment status visible (Paid/Pending/Overdue)
- AI insights show trends (energy improving/declining)
- Export button generates shareable PDF

---

#### 2. Program Management UI
**Priority:** P0 | **Effort:** Medium | **Impact:** High

**Current State:** API endpoints exist, no UI  
**Missing:**
- Program list page with search/filter
- Create/Edit program modal or page
- Program detail view with enrolled clients
- Copy intake link functionality
- Soft delete with confirmation

**Files to Create:**
- `app/dashboard/programs/page.tsx` — Program list (server component)
- `app/dashboard/programs/program-list-view.tsx` — Interactive table (client component)
- `app/dashboard/programs/[id]/page.tsx` — Program detail
- `app/dashboard/programs/create/page.tsx` — Create program form
- `components/programs/program-card.tsx` — Reusable program card
- `components/programs/program-form.tsx` — Shared form for create/edit

**Acceptance Criteria:**
- Coach can create new programs with all fields
- Coach can edit existing programs
- Coach can view enrolled clients per program
- Coach can copy intake link to clipboard
- Soft delete marks program as inactive (not hard delete)

---

#### 3. Billing & Subscription Management
**Priority:** P0 | **Effort:** High | **Impact:** Critical

**Current State:** Basic webhook handling exists  
**Missing:**
- Billing dashboard page (current plan, usage, invoices)
- Upgrade/downgrade flow
- Payment method management
- Invoice download
- Usage meter (clients enrolled vs. plan limit)

**Files to Create:**
- `app/dashboard/settings/billing/page.tsx` — Billing overview
- `app/dashboard/settings/billing/plan-card.tsx` — Current plan display
- `app/dashboard/settings/billing/usage-meter.tsx` — Client count vs. limit
- `app/dashboard/settings/billing/invoice-table.tsx` — Invoice history
- `app/api/billing/portal/route.ts` — Stripe/Razorpay customer portal
- `app/api/billing/upgrade/route.ts` — Plan upgrade handler

**Acceptance Criteria:**
- Coach sees current plan (Starter/Basic/Pro/Studio)
- Coach sees client count vs. plan limit (e.g., 12/20)
- Coach can upgrade plan via Razorpay
- Coach can download past invoices as PDF
- Usage meter shows warning at 80% capacity

---

### P1 — High Priority (Week 2-3)

#### 4. Coach Settings Page
**Priority:** P1 | **Effort:** Medium | **Impact:** Medium

**Missing:**
- Profile editing (name, email, WhatsApp, timezone)
- Notification preferences (email on/off, WhatsApp on/off)
- Check-in schedule customization (day/time)
- Password change form
- Account deletion (with confirmation flow)

**Files to Create:**
- `app/dashboard/settings/profile/page.tsx` — Profile form
- `app/dashboard/settings/notifications/page.tsx` — Notification toggles
- `app/dashboard/settings/security/page.tsx` — Password + 2FA
- `app/api/coaches/settings/route.ts` — PUT endpoint for settings

---

#### 5. Check-in Reminder Manual Trigger
**Priority:** P1 | **Effort:** Low | **Impact:** Medium

**Missing:**
- "Send Check-in Now" button on client detail page
- Bulk send for multiple clients
- Preview message before sending
- Delivery status tracking

**Files to Create:**
- `app/api/checkins/trigger/route.ts` — Manual trigger endpoint
- `components/clients/send-checkin-button.tsx` — Reusable button

---

#### 6. Renewal Management Dashboard
**Priority:** P1 | **Effort:** Medium | **Impact:** High

**Missing:**
- Renewal pipeline view (T-7, T-3, T-1 days)
- Bulk renewal reminder send
- Renewal conversion tracking
- "Extend Program" quick action

**Files to Create:**
- `app/dashboard/renewals/page.tsx` — Renewal pipeline
- `app/dashboard/renewals/renewal-card.tsx` — Client renewal card
- `app/api/renewals/bulk-send/route.ts` — Bulk reminder endpoint
- `app/api/enrollments/[id]/extend/route.ts` — Extension handler

---

### P2 — Medium Priority (Week 3-4)

#### 7. Analytics Dashboard
**Priority:** P2 | **Effort:** High | **Impact:** Medium

**Features:**
- Revenue trends (monthly/quarterly)
- Client retention rate
- Check-in response rate trends
- Program popularity (enrollment counts)
- Churn analysis (why clients leave)

**Files to Create:**
- `app/dashboard/analytics/page.tsx` — Analytics overview
- `app/api/analytics/revenue/route.ts` — Revenue data
- `app/api/analytics/retention/route.ts` — Retention metrics
- `components/analytics/revenue-chart.tsx` — Line chart
- `components/analytics/retention-funnel.tsx` — Funnel visualization

---

#### 8. Bulk Actions
**Priority:** P2 | **Effort:** Medium | **Impact:** Medium

**Features:**
- Bulk client enrollment (CSV upload)
- Bulk WhatsApp message send
- Bulk status change (active → inactive)
- Bulk tag/label assignment

**Files to Create:**
- `components/bulk/bulk-action-bar.tsx` — Selection toolbar
- `components/bulk/csv-upload.tsx` — CSV parser
- `app/api/clients/bulk/route.ts` — Bulk operation endpoint

---

#### 9. Notifications System
**Priority:** P2 | **Effort:** Medium | **Impact:** Medium

**Features:**
- In-app notification center (bell icon)
- Notification preferences per type
- Email digest (weekly summary)
- Push notifications (PWA-ready)

**Files to Create:**
- `components/notifications/notification-bell.tsx` — Bell with dropdown
- `app/api/notifications/route.ts` — GET/POST notifications
- `app/api/notifications/mark-read/route.ts` — Mark as read

---

### P3 — Low Priority (Week 4+)

#### 10. Demo Page Enhancement
**Priority:** P3 | **Effort:** Low | **Impact:** Low

**Improvements:**
- Interactive demo (try before signup)
- Sample dashboard with mock data
- Video walkthrough (Loom embed)
- Before/after comparison (time saved)

---

#### 11. SEO & Performance
**Priority:** P3 | **Effort:** Medium | **Impact:** Low (for B2B)

**Tasks:**
- Add meta descriptions to all pages
- Generate sitemap.xml
- Optimize images (WebP conversion)
- Add lazy loading for below-fold content
- Implement ISR for static pages

---

#### 12. Accessibility (WCAG 2.1 AA)
**Priority:** P3 | **Effort:** Medium | **Impact:** Low (for MVP)

**Tasks:**
- Add ARIA labels to all interactive elements
- Keyboard navigation testing
- Screen reader testing
- Color contrast audit
- Focus indicator improvements

---

## 📋 Technical Debt & Maintenance

### Monitoring & Observability
- [ ] Set up Sentry for error tracking
- [ ] Add performance monitoring (Vercel Analytics)
- [ ] Configure uptime monitoring (UptimeRobot/Pingdom)
- [ ] Set up log aggregation (Axiom/Logtail)

### DevOps
- [ ] Add staging environment (staging.fitosys.alchemetryx.com)
- [ ] Configure preview deployments for PRs
- [ ] Set up automated database backups
- [ ] Document deployment runbook

### Testing
- [ ] Add unit tests for utility functions (lib/*)
- [ ] Add integration tests for API routes
- [ ] Add E2E tests for critical flows (login, signup, intake)
- [ ] Set up CI checks (lint, test, build)

### Documentation
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Coach user guide (PDF/Notion)
- [ ] Admin runbook (how to handle support requests)
- [ ] On-call rotation setup (if needed)

---

## 🗓️ Sprint 2 Plan (Next 2 Weeks)

### Week 1 (Mar 13-19)
**Focus:** Client Detail Enhancement + Program UI

| Day | Task | Deliverable |
|-----|------|-------------|
| Mon | Client check-in timeline | `/dashboard/clients/[id]` shows 7-week history |
| Tue | Payment history + AI insights | Full client profile complete |
| Wed | Program list page | `/dashboard/programs` with search/filter |
| Thu | Program create/edit form | Coach can create programs |
| Fri | Program detail + enrolled clients | Full program CRUD complete |
| Sat | Buffer/Polish | Bug fixes, edge cases |
| Sun | Rest | — |

### Week 2 (Mar 20-26)
**Focus:** Billing + Settings

| Day | Task | Deliverable |
|-----|------|-------------|
| Mon | Billing dashboard | `/dashboard/settings/billing` |
| Tue | Usage meter + plan upgrade | Coach can upgrade plan |
| Wed | Invoice table + download | Invoice history visible |
| Thu | Profile settings | Coach can edit profile |
| Fri | Notification preferences | Email/WhatsApp toggles |
| Sat | Buffer/Polish | Bug fixes, edge cases |
| Sun | Rest | — |

---

## 🎯 Success Metrics (End of Sprint 2)

| Metric | Current | Target |
|--------|---------|--------|
| P0 Tasks Complete | 5/5 | 8/8 |
| Time to Create Program | N/A | <2 min |
| Client Profile Completeness | 40% | 100% |
| Billing Self-Service | 0% | 100% |
| Coach Support Tickets | Baseline | -30% |

---

## 🚀 Long-Term Vision (Post-MVP)

### Phase 2: Growth (Months 2-3)
- Multi-language support (Hindi, Spanish)
- Advanced AI insights (predictive churn scoring)
- Group coaching features (batch messaging)
- Mobile app (React Native)
- Integration with wearables (Fitbit, Apple Health)

### Phase 3: Scale (Months 4-6)
- White-label option for large studios
- API for third-party integrations
- Advanced reporting (custom dashboards)
- Team accounts (multiple coaches under one studio)
- Automated video call scheduling (Calendly-style)

---

## 📞 Immediate Action Items

1. **Deploy verification** — Confirm Vercel build succeeded at https://fitosys.alchemetryx.com
2. **Test rate limiting** — Attempt 11 rapid logins to verify lockout
3. **Test password validation** — Try weak passwords on signup
4. **Review error codes** — Verify client UI shows appropriate messages per error code
5. **Plan Sprint 2 kickoff** — Prioritize P0 tasks based on user feedback

---

**Document Owner:** Ashok Verma  
**Next Review:** 2026-03-19 (End of Week 1)
