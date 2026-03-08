-- Fitosys Database Schema
-- PRD Section 7.1 — Complete Table Definitions

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

-- ─── ROW LEVEL SECURITY ───

ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_log ENABLE ROW LEVEL SECURITY;

-- Coaches can only see their own record
CREATE POLICY "coaches_own_record" ON coaches
  FOR ALL USING (id = auth.uid());

-- All other tables: coaches see only their own data
CREATE POLICY "coaches_own_programs" ON programs
  FOR ALL USING (coach_id = auth.uid());

CREATE POLICY "coaches_own_clients" ON clients
  FOR ALL USING (coach_id = auth.uid());

CREATE POLICY "coaches_own_enrollments" ON enrollments
  FOR ALL USING (coach_id = auth.uid());

CREATE POLICY "coaches_own_checkins" ON checkins
  FOR ALL USING (coach_id = auth.uid());

CREATE POLICY "coaches_own_summaries" ON ai_summaries
  FOR ALL USING (coach_id = auth.uid());

CREATE POLICY "coaches_own_payments" ON payments
  FOR ALL USING (coach_id = auth.uid());

CREATE POLICY "coaches_own_whatsapp" ON whatsapp_log
  FOR ALL USING (coach_id = auth.uid());

-- ─── INDEXES ───

CREATE INDEX idx_clients_coach ON clients(coach_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_enrollments_coach ON enrollments(coach_id);
CREATE INDEX idx_enrollments_end_date ON enrollments(end_date);
CREATE INDEX idx_checkins_coach_date ON checkins(coach_id, check_date);
CREATE INDEX idx_payments_coach ON payments(coach_id);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);
