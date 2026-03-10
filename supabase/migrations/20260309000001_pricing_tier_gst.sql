-- 1. Modify coaches table
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'trial' CHECK (plan IN ('trial', 'starter', 'basic', 'pro', 'studio'));
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS plan_client_limit INTEGER DEFAULT 10;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS plan_started_at TIMESTAMPTZ;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS plan_billing_cycle TEXT DEFAULT 'monthly' CHECK (plan_billing_cycle IN ('monthly', 'annual'));
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS next_billing_date DATE;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS gst_number TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS billing_address TEXT;

-- 2. New table: subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('starter','basic','pro','studio')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  amount_inr DECIMAL(10,2) NOT NULL,
  gateway_payment_id TEXT,
  gateway_order_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','cancelled','past_due','paused')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  current_period_start DATE NOT NULL,
  current_period_end DATE NOT NULL,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_coach_id ON subscriptions(coach_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 3. New table: gst_invoices
CREATE TABLE IF NOT EXISTS gst_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  enrollment_id UUID REFERENCES enrollments(id),
  payment_id UUID REFERENCES payments(id) NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  seller_name TEXT NOT NULL,
  seller_gstin TEXT,
  seller_address TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_gstin TEXT,
  item_description TEXT NOT NULL,
  amount_before_tax DECIMAL(10,2) NOT NULL,
  gst_rate DECIMAL(5,2) DEFAULT 18.00,
  cgst_amount DECIMAL(10,2),
  sgst_amount DECIMAL(10,2),
  igst_amount DECIMAL(10,2),
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  pdf_url TEXT,
  sent_to_client BOOLEAN DEFAULT FALSE,
  sent_to_coach BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gst_invoices_coach_id ON gst_invoices(coach_id);
CREATE INDEX IF NOT EXISTS idx_gst_invoices_client_id ON gst_invoices(client_id);

-- 4. New table: checkin_templates
CREATE TABLE IF NOT EXISTS checkin_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  questions JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS Policies for new tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY coaches_own_subscriptions ON subscriptions
  FOR ALL USING (coach_id = auth.uid());

CREATE POLICY coaches_own_gst_invoices ON gst_invoices
  FOR ALL USING (coach_id = auth.uid());

CREATE POLICY coaches_own_checkin_templates ON checkin_templates
  FOR ALL USING (coach_id = auth.uid());
