# Fitosys Database Migration Script

**Purpose:** Consolidated SQL script for production database setup  
**Date:** 2026-03-13  
**Target:** Supabase PostgreSQL

---

## Instructions

**Option 1: Via Supabase CLI (Recommended)**
```bash
# Navigate to project directory
cd supabase

# Apply all migrations in order
supabase db push
```

**Option 2: Via Supabase Dashboard**
1. Go to Supabase Dashboard → SQL Editor
2. Copy entire script below
3. Paste into SQL Editor
4. Click "Run"
5. Verify all tables created successfully

**Option 3: Via psql**
```bash
psql -h db.xxxxx.supabase.co -U postgres -d postgres -f migration.sql
```

---

## Complete Migration Script

```sql
-- ================================================================
-- FITOSYS PRODUCTION DATABASE MIGRATION
-- Generated: 2026-03-13
-- Version: 1.0
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- 1. COACHES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS coaches (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT UNIQUE NOT NULL,
  full_name         TEXT NOT NULL,
  whatsapp_number   TEXT NOT NULL,
  country_code      TEXT NOT NULL DEFAULT 'IN',
  timezone          TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  coaching_type     TEXT[] DEFAULT '{}',
  gateway_customer_id TEXT,
  plan              TEXT DEFAULT 'trial' CHECK (plan IN ('trial', 'starter', 'basic', 'pro', 'studio')),
  plan_client_limit INTEGER DEFAULT 10,
  plan_started_at   TIMESTAMPTZ,
  plan_billing_cycle TEXT DEFAULT 'monthly' CHECK (plan_billing_cycle IN ('monthly', 'annual')),
  next_billing_date DATE,
  gst_number        TEXT,
  business_name     TEXT,
  billing_address   TEXT,
  checkin_day       INTEGER DEFAULT 0,
  checkin_time      TEXT DEFAULT '19:00',
  slug              TEXT UNIQUE NOT NULL,
  status            TEXT DEFAULT 'active',
  deletion_requested_at TIMESTAMPTZ,
  deletion_scheduled_for TIMESTAMPTZ,
  deletion_cancelled_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coaches_slug ON coaches(slug);
CREATE INDEX IF NOT EXISTS idx_coaches_email ON coaches(email);
CREATE INDEX IF NOT EXISTS idx_coaches_status ON coaches(status);
CREATE INDEX IF NOT EXISTS idx_coaches_deletion_scheduled 
  ON coaches(deletion_scheduled_for) 
  WHERE deletion_scheduled_for IS NOT NULL;

-- ================================================================
-- 2. PROGRAMS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS programs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id        UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  duration_weeks  INTEGER NOT NULL,
  price           DECIMAL(10,2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'INR',
  checkin_type    TEXT DEFAULT 'wellness',
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_programs_coach_id ON programs(coach_id);
CREATE INDEX IF NOT EXISTS idx_programs_is_active ON programs(is_active);

-- ================================================================
-- 3. CLIENTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS clients (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id            UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  full_name           TEXT NOT NULL,
  whatsapp_number     TEXT NOT NULL,
  email               TEXT NOT NULL,
  age                 INTEGER,
  primary_goal        TEXT,
  health_notes        TEXT,
  gateway_customer_id TEXT,
  status              TEXT DEFAULT 'active',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_coach_id ON clients(coach_id);
CREATE INDEX IF NOT EXISTS idx_clients_whatsapp ON clients(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

-- ================================================================
-- 4. ENROLLMENTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS enrollments (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id                  UUID REFERENCES coaches(id) NOT NULL,
  client_id                 UUID REFERENCES clients(id),
  program_id                UUID REFERENCES programs(id) NOT NULL,
  start_date                DATE NOT NULL,
  end_date                  DATE NOT NULL,
  amount_paid               DECIMAL(10,2) NOT NULL,
  currency                  TEXT NOT NULL DEFAULT 'INR',
  gateway_payment_id        TEXT,
  gateway_order_id          TEXT,
  payment_gateway           TEXT DEFAULT 'razorpay',
  status                    TEXT DEFAULT 'active',
  renewal_reminder_1_sent   BOOLEAN DEFAULT FALSE,
  renewal_reminder_2_sent   BOOLEAN DEFAULT FALSE,
  churn_reason              TEXT,
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enrollments_coach_id ON enrollments(coach_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_client_id ON enrollments(client_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program_id ON enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_end_date ON enrollments(end_date);

-- ================================================================
-- 5. CHECKINS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS checkins (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id            UUID REFERENCES coaches(id) NOT NULL,
  client_id           UUID REFERENCES clients(id) NOT NULL,
  enrollment_id       UUID REFERENCES enrollments(id),
  week_number         INTEGER NOT NULL,
  check_date          DATE NOT NULL,
  raw_reply           TEXT,
  sessions_completed  INTEGER,
  energy_score        INTEGER CHECK (energy_score >= 1 AND energy_score <= 10),
  weight_kg           DECIMAL(5,2),
  notes               TEXT,
  processed           BOOLEAN DEFAULT FALSE,
  responded_at        TIMESTAMPTZ,
  message_sent_at     TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkins_coach_id ON checkins(coach_id);
CREATE INDEX IF NOT EXISTS idx_checkins_client_id ON checkins(client_id);
CREATE INDEX IF NOT EXISTS idx_checkins_enrollment_id ON checkins(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_checkins_check_date ON checkins(check_date);
CREATE INDEX IF NOT EXISTS idx_checkins_processed ON checkins(processed);

-- ================================================================
-- 6. AI_SUMMARIES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS ai_summaries (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id            UUID REFERENCES coaches(id) NOT NULL,
  week_start_date     DATE NOT NULL,
  week_end_date       DATE NOT NULL,
  summary_text        TEXT NOT NULL,
  total_clients       INTEGER,
  responded_count     INTEGER,
  avg_energy_score    DECIMAL(3,1),
  generated_at        TIMESTAMPTZ DEFAULT NOW(),
  delivered_to_coach  BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_ai_summaries_coach_id ON ai_summaries(coach_id);
CREATE INDEX IF NOT EXISTS idx_ai_summaries_week ON ai_summaries(week_start_date, week_end_date);

-- ================================================================
-- 7. PAYMENTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id              UUID REFERENCES coaches(id) NOT NULL,
  client_id             UUID REFERENCES clients(id) NOT NULL,
  enrollment_id         UUID REFERENCES enrollments(id),
  amount                DECIMAL(10,2) NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'INR',
  payment_type          TEXT NOT NULL,
  gateway_payment_id    TEXT UNIQUE NOT NULL,
  gateway_order_id      TEXT,
  gateway_payment_status TEXT,
  payment_gateway       TEXT DEFAULT 'razorpay',
  paid_at               TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_coach_id ON payments(coach_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_id ON payments(gateway_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(paid_at);

-- ================================================================
-- 8. WHATSAPP_LOG TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS whatsapp_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id            UUID REFERENCES coaches(id),
  client_id           UUID REFERENCES clients(id),
  direction           TEXT NOT NULL,
  message_type        TEXT,
  message_content     TEXT,
  whatsapp_message_id TEXT,
  status              TEXT,
  sent_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_log_coach_id ON whatsapp_log(coach_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_log_client_id ON whatsapp_log(client_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_log_sent_at ON whatsapp_log(sent_at);

-- ================================================================
-- 9. SUBSCRIPTIONS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id              UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  plan                  TEXT NOT NULL CHECK (plan IN ('starter','basic','pro','studio')),
  billing_cycle         TEXT NOT NULL DEFAULT 'monthly',
  amount_inr            DECIMAL(10,2) NOT NULL,
  gateway_payment_id    TEXT,
  gateway_order_id      TEXT,
  status                TEXT DEFAULT 'active' CHECK (status IN ('active','cancelled','past_due','paused')),
  started_at            TIMESTAMPTZ DEFAULT NOW(),
  current_period_start  DATE NOT NULL,
  current_period_end    DATE NOT NULL,
  cancelled_at          TIMESTAMPTZ,
  cancel_reason         TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_coach_id ON subscriptions(coach_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period ON subscriptions(current_period_start, current_period_end);

-- ================================================================
-- 10. GST_INVOICES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS gst_invoices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id            UUID REFERENCES coaches(id) NOT NULL,
  client_id           UUID REFERENCES clients(id) NOT NULL,
  enrollment_id       UUID REFERENCES enrollments(id),
  payment_id          UUID REFERENCES payments(id) NOT NULL,
  invoice_number      TEXT UNIQUE NOT NULL,
  invoice_date        DATE NOT NULL,
  seller_name         TEXT NOT NULL,
  seller_gstin        TEXT,
  seller_address      TEXT NOT NULL,
  buyer_name          TEXT NOT NULL,
  buyer_email         TEXT NOT NULL,
  buyer_gstin         TEXT,
  item_description    TEXT NOT NULL,
  amount_before_tax   DECIMAL(10,2) NOT NULL,
  gst_rate            DECIMAL(5,2) DEFAULT 18.00,
  cgst_amount         DECIMAL(10,2),
  sgst_amount         DECIMAL(10,2),
  igst_amount         DECIMAL(10,2),
  total_amount        DECIMAL(10,2) NOT NULL,
  currency            TEXT DEFAULT 'INR',
  pdf_url             TEXT,
  sent_to_client      BOOLEAN DEFAULT FALSE,
  sent_to_coach       BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gst_invoices_coach_id ON gst_invoices(coach_id);
CREATE INDEX IF NOT EXISTS idx_gst_invoices_client_id ON gst_invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_gst_invoices_invoice_number ON gst_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_gst_invoices_invoice_date ON gst_invoices(invoice_date);

-- ================================================================
-- 11. CHECKIN_TEMPLATES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS checkin_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id    UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  program_id  UUID REFERENCES programs(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  questions   JSONB NOT NULL,
  is_default  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkin_templates_coach_id ON checkin_templates(coach_id);
CREATE INDEX IF NOT EXISTS idx_checkin_templates_program_id ON checkin_templates(program_id);

-- ================================================================
-- 12. DELETION_AUDIT_LOG TABLE (Optional - for compliance tracking)
-- ================================================================
CREATE TABLE IF NOT EXISTS deletion_audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id        UUID,
  email           TEXT,
  deleted_at      TIMESTAMPTZ DEFAULT NOW(),
  reason          TEXT
);

CREATE INDEX IF NOT EXISTS idx_deletion_audit_coach_id ON deletion_audit_log(coach_id);
CREATE INDEX IF NOT EXISTS idx_deletion_audit_deleted_at ON deletion_audit_log(deleted_at);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_templates ENABLE ROW LEVEL SECURITY;

-- Coaches: Users can only access their own record
DROP POLICY IF EXISTS coaches_own_record ON coaches;
CREATE POLICY coaches_own_record ON coaches
  FOR ALL USING (id = auth.uid());

-- Programs: Users can only access their own programs
DROP POLICY IF EXISTS coaches_own_programs ON programs;
CREATE POLICY coaches_own_programs ON programs
  FOR ALL USING (coach_id = auth.uid());

-- Clients: Users can only access their own clients
DROP POLICY IF EXISTS coaches_own_clients ON clients;
CREATE POLICY coaches_own_clients ON clients
  FOR ALL USING (coach_id = auth.uid());

-- Enrollments: Users can only access their own enrollments
DROP POLICY IF EXISTS coaches_own_enrollments ON enrollments;
CREATE POLICY coaches_own_enrollments ON enrollments
  FOR ALL USING (coach_id = auth.uid());

-- Checkins: Users can only access their own checkins
DROP POLICY IF EXISTS coaches_own_checkins ON checkins;
CREATE POLICY coaches_own_checkins ON checkins
  FOR ALL USING (coach_id = auth.uid());

-- AI Summaries: Users can only access their own summaries
DROP POLICY IF EXISTS coaches_own_summaries ON ai_summaries;
CREATE POLICY coaches_own_summaries ON ai_summaries
  FOR ALL USING (coach_id = auth.uid());

-- Payments: Users can only access their own payments
DROP POLICY IF EXISTS coaches_own_payments ON payments;
CREATE POLICY coaches_own_payments ON payments
  FOR ALL USING (coach_id = auth.uid());

-- WhatsApp Log: Users can only access their own logs
DROP POLICY IF EXISTS coaches_own_logs ON whatsapp_log;
CREATE POLICY coaches_own_logs ON whatsapp_log
  FOR ALL USING (coach_id = auth.uid());

-- Subscriptions: Users can only access their own subscriptions
DROP POLICY IF EXISTS coaches_own_subscriptions ON subscriptions;
CREATE POLICY coaches_own_subscriptions ON subscriptions
  FOR ALL USING (coach_id = auth.uid());

-- GST Invoices: Users can only access their own invoices
DROP POLICY IF EXISTS coaches_own_invoices ON gst_invoices;
CREATE POLICY coaches_own_invoices ON gst_invoices
  FOR ALL USING (coach_id = auth.uid());

-- Checkin Templates: Users can only access their own templates
DROP POLICY IF EXISTS coaches_own_templates ON checkin_templates;
CREATE POLICY coaches_own_templates ON checkin_templates
  FOR ALL USING (coach_id = auth.uid());

-- Public access for program lookup (intake form)
DROP POLICY IF EXISTS programs_public_view ON programs;
CREATE POLICY programs_public_view ON programs
  FOR SELECT USING (is_active = TRUE);

-- ================================================================
-- DATABASE FUNCTIONS
-- ================================================================

-- Function: Schedule account deletion (30-day grace period)
CREATE OR REPLACE FUNCTION schedule_account_deletion(coach_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE coaches
    SET 
        deletion_requested_at = NOW(),
        deletion_scheduled_for = NOW() + INTERVAL '30 days',
        deletion_cancelled_at = NULL,
        status = 'pending_deletion'
    WHERE id = coach_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Cancel deletion request
CREATE OR REPLACE FUNCTION cancel_account_deletion(coach_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    result BOOLEAN;
BEGIN
    UPDATE coaches
    SET 
        deletion_cancelled_at = NOW(),
        deletion_scheduled_for = NULL,
        status = 'active'
    WHERE id = coach_uuid 
    AND (deletion_scheduled_for IS NULL OR deletion_scheduled_for > NOW())
    RETURNING TRUE INTO result;
    
    RETURN COALESCE(result, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Process expired deletions (cron job)
CREATE OR REPLACE FUNCTION process_expired_deletions()
RETURNS TABLE(deleted_coach_id UUID, deleted_email TEXT) AS $$
BEGIN
    RETURN QUERY
    UPDATE coaches
    SET 
        status = 'deleted',
        updated_at = NOW()
    WHERE 
        deletion_scheduled_for IS NOT NULL 
        AND deletion_scheduled_for <= NOW()
        AND status = 'pending_deletion'
    RETURNING id, email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Generate unique slug for coach
CREATE OR REPLACE FUNCTION generate_unique_slug(full_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Generate base slug from name
    base_slug := LOWER(REGEXP_REPLACE(full_name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := REGEXP_REPLACE(base_slug, '^-+|-+$', '', 'g');
    
    -- Check if slug exists
    SELECT slug INTO final_slug FROM coaches WHERE slug = base_slug;
    
    -- If exists, append counter
    WHILE final_slug IS NOT NULL LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
        SELECT slug INTO final_slug FROM coaches WHERE slug = final_slug;
    END LOOP;
    
    RETURN base_slug || CASE WHEN counter > 0 THEN '-' || counter::TEXT ELSE '' END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Auto-generate slug before coach insert
CREATE OR REPLACE FUNCTION before_coach_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_unique_slug(NEW.full_name);
    END IF;
    NEW.created_at := NOW();
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_coaches_before_insert ON coaches;
CREATE TRIGGER trg_coaches_before_insert
    BEFORE INSERT ON coaches
    FOR EACH ROW
    EXECUTE FUNCTION before_coach_insert();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_coaches_updated_at ON coaches;
CREATE TRIGGER trg_coaches_updated_at
    BEFORE UPDATE ON coaches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Run these after migration to verify success:

-- 1. Check all tables exist
-- SELECT COUNT(*) FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
-- Expected: 12

-- 2. Check RLS is enabled
-- SELECT COUNT(*) FROM pg_tables 
-- WHERE schemaname = 'public' AND rowsecurity = true;
-- Expected: 11

-- 3. Check functions exist
-- SELECT COUNT(*) FROM pg_proc 
-- WHERE proname IN ('schedule_account_deletion', 'cancel_account_deletion', 'process_expired_deletions', 'generate_unique_slug');
-- Expected: 4

-- 4. Check triggers exist
-- SELECT COUNT(*) FROM pg_trigger 
-- WHERE tgname IN ('trg_coaches_before_insert', 'trg_coaches_updated_at');
-- Expected: 2

-- ================================================================
-- END OF MIGRATION
-- ================================================================
```

---

## Post-Migration Verification

**Run these queries to verify migration success:**

```sql
-- 1. Count all tables (Expected: 12)
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- 2. Verify RLS is enabled on all tables (Expected: 11)
SELECT COUNT(*) as rls_enabled_count 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- 3. List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 4. Verify functions exist
SELECT proname as function_name 
FROM pg_proc 
WHERE proname IN (
    'schedule_account_deletion', 
    'cancel_account_deletion', 
    'process_expired_deletions', 
    'generate_unique_slug'
);

-- 5. Verify triggers exist
SELECT tgname as trigger_name 
FROM pg_trigger 
WHERE tgname IN (
    'trg_coaches_before_insert', 
    'trg_coaches_updated_at'
);

-- 6. Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## Rollback (If Needed)

**⚠️ WARNING: This will delete all data!**

```sql
-- Drop all tables (cascade will drop dependent objects)
DROP TABLE IF EXISTS deletion_audit_log CASCADE;
DROP TABLE IF EXISTS checkin_templates CASCADE;
DROP TABLE IF EXISTS gst_invoices CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS whatsapp_log CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS ai_summaries CASCADE;
DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS coaches CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS schedule_account_deletion(UUID);
DROP FUNCTION IF EXISTS cancel_account_deletion(UUID);
DROP FUNCTION IF EXISTS process_expired_deletions();
DROP FUNCTION IF EXISTS generate_unique_slug(TEXT);
DROP FUNCTION IF EXISTS before_coach_insert();
DROP FUNCTION IF EXISTS update_updated_at_column();
```

---

**Status:** ✅ **READY FOR PRODUCTION**
