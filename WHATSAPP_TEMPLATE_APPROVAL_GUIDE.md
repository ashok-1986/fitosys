# WhatsApp Template Approval Guide

**Date:** 2026-03-13  
**Status:** P0 Critical — Required for Production Launch

---

## Overview

Fitosys uses WhatsApp Business API (Meta Cloud API) to send automated messages to clients. All template messages **must be approved by Meta** before they can be used in production.

---

## Current Template Status

| Template Name | Category | Status | Purpose |
|---------------|----------|--------|---------|
| `fitosys_weekly_checkin` | MARKETING | ⏳ Pending | Sunday 7PM check-in |
| `fitosys_client_welcome` | UTILITY | ⏳ Pending | Welcome after payment |
| `fitosys_renewal_reminder` | MARKETING | ⏳ Pending | T-7 days renewal |
| `fitosys_second_renewal_reminder` | MARKETING | ⏳ Pending | T-3 days renewal |
| `fitosys_coach_weekly_summary` | UTILITY | ⏳ Pending | Monday AI summary to coach |
| `fitosys_new_client_notification` | UTILITY | ⏳ Pending | Coach notification |

---

## Approval Process

### Step 1: Meta Business Verification

**Required Before Template Submission**

1. Go to [Meta Business Suite](https://business.facebook.com)
2. Click **Business Settings**
3. Under **Business Info**, click **Start Verification**
4. Upload business documents:
   - Business registration certificate
   - GST certificate
   - Website URL (fitosys.alchemetryx.com)
5. Wait 2-5 business days for approval

**Status:** ⏳ **PENDING** — Needs to be completed

---

### Step 2: Phone Number Verification

**Required:** The WhatsApp number must be verified

1. Go to [Meta Developer Dashboard](https://developers.facebook.com)
2. Select your app
3. Under **WhatsApp** → **API Setup**
4. Add phone number: `+91-XXXXXXXXXX`
5. Receive OTP via SMS/call
6. Verify the number

**Status:** ✅ **COMPLETE** — Phone number registered

---

### Step 3: Template Submission

**For Each Template:**

1. Go to **WhatsApp Manager** → **Message Templates**
2. Click **Create Template**
3. Fill in:
   - **Template Name:** `fitosys_weekly_checkin`
   - **Language:** Hindi (for Indian market)
   - **Category:** MARKETING or UTILITY
   - **Message Body:** See templates below
4. Submit for review

**Review Time:** 24-48 hours per template

---

## Template Specifications

### 1. fitosys_weekly_checkin (MARKETING)

**Purpose:** Weekly client check-in (Sunday 7PM IST)

**Message Body:**
```
Hi {{1}}! This is your coach {{2}}.

How was your week? Please share:
1. Sessions completed: X/5
2. Energy level (1-10): X
3. Any challenges?

Reply with your answers. Takes 30 seconds! 🎯
```

**Variables:**
- `{{1}}` — Client first name
- `{{2}}` — Coach name

**Sample:**
```
Hi Priya! This is your coach Ananya.

How was your week? Please share:
1. Sessions completed: X/5
2. Energy level (1-10): X
3. Any challenges?

Reply with your answers. Takes 30 seconds! 🎯
```

---

### 2. fitosys_client_welcome (UTILITY)

**Purpose:** Welcome message after payment

**Message Body:**
```
Welcome to {{1}}'s coaching program, {{2}}! 🎉

Your enrollment in {{3}} is confirmed.
Start Date: {{4}}

What's next?
✓ Your coach will reach out within 24 hours
✓ Complete your first check-in this Sunday
✓ Track progress via your dashboard

Questions? Reply to this message!
```

**Variables:**
- `{{1}}` — Coach name
- `{{2}}` — Client first name
- `{{3}}` — Program name
- `{{4}}` — Start date

---

### 3. fitosys_renewal_reminder (MARKETING)

**Purpose:** Renewal reminder (T-7 days)

**Message Body:**
```
Hi {{1}}! Your {{2}} program ends in {{3}} days.

Progress summary:
✓ Sessions: {{4}}/{{5}} completed
✓ Avg energy: {{6}}/10
✓ Great progress!

Ready to continue? Renew now: {{7}}

Questions? Reply to this message.
```

**Variables:**
- `{{1}}` — Client first name
- `{{2}}` — Program name
- `{{3}}` — Days remaining
- `{{4}}` — Sessions completed
- `{{5}}` — Total sessions
- `{{6}}` — Average energy score
- `{{7}}` — Renewal payment link

---

### 4. fitosys_second_renewal_reminder (MARKETING)

**Purpose:** Final renewal reminder (T-3 days)

**Message Body:**
```
Hi {{1}}! Quick reminder — your program ends in {{2}} days.

You've completed {{3}} sessions with {{4}} average energy. Amazing work! 💪

Don't lose momentum — renew today: {{5}}

Need help? Reply to this message.
```

**Variables:**
- `{{1}}` — Client first name
- `{{2}}` — Days remaining
- `{{3}}` — Sessions completed
- `{{4}}` — Coach name
- `{{5}}` — Renewal link

---

### 5. fitosys_coach_weekly_summary (UTILITY)

**Purpose:** Monday AI summary to coach

**Message Body:**
```
📊 Weekly Summary ({{1}})

Clients checked in: {{2}}/{{3}}
Response rate: {{4}}%
Avg energy: {{5}}/10

⚠️ Needs attention:
{{6}}

✅ Strong performers:
{{7}}

Full report: {{8}}
```

**Variables:**
- `{{1}}` — Week date range
- `{{2}}` — Check-ins received
- `{{3}}` — Total clients
- `{{4}}` — Response rate percentage
- `{{5}}` — Average energy
- `{{6}}` — At-risk client names
- `{{7}}` — Strong client names
- `{{8}}` — Dashboard link

---

### 6. fitosys_new_client_notification (UTILITY)

**Purpose:** Coach notification for new client

**Message Body:**
```
🎉 New Client Alert!

{{1}} just enrolled in {{2}}.

Payment: ₹{{3}} (confirmed)
Start date: {{4}}

Next steps:
✓ Send welcome message
✓ Schedule onboarding call
✓ Prepare custom plan

View details: {{5}}
```

**Variables:**
- `{{1}}` — Client name
- `{{2}}` — Program name
- `{{3}}` — Amount
- `{{4}}` — Start date
- `{{5}}` — Client profile link

---

## Common Rejection Reasons

### ❌ Template Rejected

**Reason:** "Message appears promotional"

**Fix:** Change category from UTILITY to MARKETING

**Example:**
- ❌ "Renew now and get 10% off!" (Promotional)
- ✅ "Your program ends in 7 days. Renew: [link]" (Informational)

---

### ❌ Template Rejected

**Reason:** "Variable usage unclear"

**Fix:** Provide clearer sample values

**Example:**
- ❌ `{{1}}` → Sample: "test"
- ✅ `{{1}}` → Sample: "Priya" (Client first name)

---

### ❌ Template Rejected

**Reason:** "Call-to-action violates policy"

**Fix:** Remove aggressive CTAs

**Example:**
- ❌ "ACT NOW! Limited offer!"
- ✅ "Reply to this message for help"

---

## Opt-Out Compliance (P0 FIXED ✅)

**Meta Requirement:** All WhatsApp messages must include opt-out mechanism

**Implementation:**
- STOP keyword handler added to webhook
- Keywords detected: STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT, OPTOUT
- Client status updated to "inactive"
- Opt-out event logged in `whatsapp_log`

**File:** `app/api/webhooks/whatsapp/route.ts`

---

## Testing Checklist

### Before Submission
- [ ] Meta Business verified
- [ ] Phone number verified
- [ ] All templates follow formatting guidelines
- [ ] Sample values provided for all variables
- [ ] No promotional language in UTILITY templates
- [ ] Opt-out mechanism implemented

### After Submission
- [ ] Track approval status in Meta Business Suite
- [ ] Respond to any rejection feedback within 24 hours
- [ ] Test approved templates in sandbox
- [ ] Update production config with template IDs

---

## Timeline

| Date | Milestone | Status |
|------|-----------|--------|
| 2026-03-13 | Submit templates | ⏳ Pending |
| 2026-03-15 | First approvals expected | ⏳ Pending |
| 2026-03-17 | All templates approved | ⏳ Pending |
| 2026-03-20 | Production launch | ⏳ Pending |

---

## Contacts

**Meta Business Support:**
- [Meta Business Help Center](https://www.facebook.com/business/help)
- WhatsApp API Support: `api-support@meta.com`

**Internal:**
- Technical Lead: Ashok Verma (`verma.86ashok@gmail.com`)
- Meta Liaison: [To be assigned]

---

## Action Items

### Immediate (This Week)
1. ✅ **COMPLETE** — Add STOP keyword handler to webhook
2. ⏳ **PENDING** — Complete Meta Business Verification
3. ⏳ **PENDING** — Submit all 6 templates for approval
4. ⏳ **PENDING** — Test templates in sandbox environment

### Week 2
5. ⏳ **PENDING** — Receive template approvals
6. ⏳ **PENDING** — Update production configuration
7. ⏳ **PENDING** — Test end-to-end WhatsApp flow

---

**Document Owner:** Ashok Verma  
**Last Updated:** 2026-03-13  
**Next Review:** 2026-03-20 (Post-approval)
