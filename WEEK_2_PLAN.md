# Week 2 Implementation Plan

**Date:** 2026-03-12  
**Focus:** Client Visibility + Coach Settings  
**Design Reference:** `fitosys-ux-ui-system.html` (Sections 6, 8, 10)

---

## ✅ Completed (Week 1)

### Revenue Flow (100%)
- [x] `/join/[slug]` — Real coach + program fetch
- [x] `/api/payments/create-order` — Full client data in notes
- [x] `/api/payments/verify` — Client + enrollment creation (already working)
- [x] `/dashboard/programs` — Full CRUD UI

---

## 🎯 Week 2 Priorities (Mar 13-19)

### P0-1: Client List Page Verification
**Priority:** P0 | **File:** `app/dashboard/clients/page.tsx`

**Current Status:** ✅ Exists  
**To Verify:**
- [ ] Loads real client data from `/api/clients`
- [ ] Search by name works
- [ ] Status filter (all/active/trial/inactive) works
- [ ] Risk score displays correctly
- [ ] Click on client → Navigates to detail page

**Action:** Test on staging with real data

---

### P0-2: Client Detail Page Enhancement
**Priority:** P0 | **File:** `app/dashboard/clients/[id]/page.tsx`

**Current Status:** ✅ Exists with UI  
**Missing Features:**
- [ ] Payment history section (calls `/api/clients/[id]/payments`)
- [ ] Full check-in history table (calls `/api/clients/[id]/checkins`)
- [ ] Manual check-in button (links to `/dashboard/checkin?clientId=[id]`)
- [ ] Export to PDF/WhatsApp (future)

**UX/UI System Reference:** Section 6 — Client Profile
- Energy bars (7-week trend) ✅ Already implemented
- Risk score badge ✅ Already implemented
- Client info section ✅ Already implemented
- Action buttons (Send Renewal, Log Check-in) ✅ Already implemented

**To Add:**
- Payment history table below client info
- Check-in history accordion
- "Message on WhatsApp" button

---

### P0-3: Weekly Pulse Page
**Priority:** P0 | **File:** `app/dashboard/pulse/page.tsx`

**Current Status:** ❌ Not built  
**UX/UI System Reference:** Section 8 — Weekly Pulse

**Required Components:**
- AI summary card (from latest `ai_summaries` record)
- 4-stat row (response rate, avg energy, check-ins sent, renewals due)
- 8-week response rate bar chart
- Client flag list (At Risk / Strong / Watch)

**Files to Create:**
- `app/dashboard/pulse/page.tsx` — Main page
- `app/api/pulse/data/route.ts` — Aggregated pulse data

**Data Needed:**
```typescript
{
  latest_summary: AiSummary | null,
  response_rate: number,      // (replied / sent) * 100
  avg_energy: number,         // Average of last 7 days
  checkins_sent: number,      // Count from last 7 days
  renewals_due: number,       // Count ending in 7 days
  clients_at_risk: Client[],  // Energy <= 4 or renewals in 3 days
  clients_strong: Client[],   // Energy >= 8 consistently
  clients_watch: Client[],    // Energy 5-7 or declining trend
}
```

---

### P1-1: Settings — Profile Tab
**Priority:** P1 | **File:** `app/dashboard/settings/page.tsx`

**Current Status:** ❌ Not built  
**UX/UI System Reference:** Section 10 — Settings

**Required Fields:**
- Full name (editable)
- Email (editable)
- WhatsApp number (editable)
- Timezone (auto-detected, read-only)
- Coaching type (multi-select: fitness/yoga/wellness/nutrition)
- Business name (for invoices)
- GST number (for invoices)
- Billing address (for invoices)

**API Endpoint:** `PUT /api/coaches/profile` (exists)

---

### P1-2: Settings — Check-in Config Tab
**Priority:** P1 | **File:** `app/dashboard/settings/page.tsx`

**Required Settings:**
- Check-in day (dropdown: Sun-Sat)
- Check-in time (time picker: 00:00-23:59)
- WhatsApp notifications (toggle on/off)
- Email notifications (toggle on/off)
- Custom check-in questions (future)

**API Endpoint:** `PUT /api/coaches/settings` (exists)

---

### P1-3: Settings — Billing Tab
**Priority:** P1 | **File:** `app/dashboard/settings/billing/page.tsx`

**Required Features:**
- Current plan display (Starter/Basic/Pro/Studio)
- Usage meter (clients enrolled / plan limit)
- Next billing date
- Upgrade button (links to Razorpay payment page)
- Invoice history table
- Download invoice PDF

**API Endpoints Needed:**
- `GET /api/coaches/billing` — Current plan + usage
- `GET /api/invoices` — Invoice list
- `GET /api/invoices/[id]/pdf` — Download PDF

---

## 📋 Implementation Order

### Day 1 (Mar 13): Client Detail Enhancements
**Morning:**
1. Add payment history section to `/dashboard/clients/[id]/page.tsx`
2. Add check-in history accordion
3. Test with real data

**Afternoon:**
4. Verify `/dashboard/clients` list page works
5. Fix any data loading issues
6. Add "Message on WhatsApp" button

**Deliverable:** Complete client profile view

---

### Day 2 (Mar 14): Weekly Pulse Page
**Morning:**
1. Create `app/api/pulse/data/route.ts`
2. Aggregate all pulse metrics
3. Handle empty states (no AI summary yet)

**Afternoon:**
4. Build `app/dashboard/pulse/page.tsx`
5. Implement 4-stat row
6. Implement 8-week bar chart
7. Implement client flag list

**Deliverable:** Monday morning AI summary view

---

### Day 3 (Mar 15): Settings Pages
**Morning:**
1. Build settings shell with tabs (Profile/Check-in/Billing)
2. Profile form with save functionality
3. Check-in config form

**Afternoon:**
4. Billing tab with usage meter
5. Invoice history table
6. Test all forms

**Deliverable:** Complete settings section

---

### Day 4 (Mar 16): Integration Testing
**Full Day:**
- Test complete user journey:
  - Coach signs up → Creates program → Shares link
  - Client enrolls → Pays → Appears in client list
  - Coach views client profile → Sees payment history
  - Monday 7AM → AI summary appears in Pulse
  - Coach updates settings → Changes persist

---

### Day 5 (Mar 17): Bug Fixes + Polish
**Morning:**
- Fix any bugs from Day 4 testing
- Add loading states
- Add error handling

**Afternoon:**
- Mobile responsive check (TR-26 to TR-30)
- Accessibility check (TR-36 to TR-39)
- Performance check (TR-21: LCP < 2.5s)

---

## 📊 Success Criteria

| Feature | Status | Acceptance Test |
|---------|--------|-----------------|
| Client list loads | ⚠️ To verify | Shows all active clients |
| Client detail complete | ⚠️ To add | Payment history visible |
| Weekly Pulse page | ❌ Not built | AI summary + chart visible |
| Settings tabs | ❌ Not built | Can update profile + config |
| Mobile responsive | ❌ Not tested | Works on Galaxy A54 (412px) |

---

## 🔧 API Endpoints Status

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/clients` | ✅ Exists | List with search/filter |
| `GET /api/clients/[id]` | ✅ Exists | Single client profile |
| `GET /api/clients/[id]/payments` | ✅ Exists | Payment history |
| `GET /api/clients/[id]/checkins` | ✅ Exists | Check-in history |
| `GET /api/pulse/data` | ❌ To create | Aggregated pulse metrics |
| `GET /api/coaches/billing` | ⚠️ Verify | Plan + usage data |
| `GET /api/invoices` | ⚠️ Verify | Invoice list |

---

## 📱 Mobile Responsive Checklist (TR-26 to TR-30)

**Breakpoints:**
- Desktop: 1025px+
- Tablet: 769px-1024px
- Mobile: ≤768px

**Tests:**
- [ ] Client list collapses to single column on mobile
- [ ] Client detail stacks vertically
- [ ] Settings tabs become scrollable
- [ ] Touch targets ≥ 44×44px (TR-28)
- [ ] No horizontal scroll at 375px (TR-30)

---

## 🎨 Brand Compliance Checklist

**From Brand Identity v2:**
- [ ] Red #E8001D (not #F20000) for CTAs
- [ ] Barlow Condensed for all headings
- [ ] Urbanist for all body text
- [ ] Noise overlay on backgrounds
- [ ] Red glow accents on cards

---

**Document Owner:** Ashok Verma  
**Next Review:** 2026-03-19 (End of Week 2)  
**Related:** `NEXT_STEPS.md`, `REVENUE_FLOW_SUMMARY.md`
