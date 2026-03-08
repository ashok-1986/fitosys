-- Fitosys Migration 003: Phase 1 Core Infrastructure Completion
-- Adds: Triggers, complete RLS policies, functions, and additional indexes

-- ──── 1. AUTO-UPDATE updated_at TRIGGER ────

-- Create updated_at trigger for coaches table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coaches_updated_at
    BEFORE UPDATE ON coaches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ──── 2. COMPLETE ROW LEVEL SECURITY POLICIES ────

-- Drop incomplete policies
DROP POLICY IF EXISTS "coaches_own_record" ON coaches;
DROP POLICY IF EXISTS "coaches_own_programs" ON programs;
DROP POLICY IF EXISTS "coaches_own_clients" ON clients;
DROP POLICY IF EXISTS "coaches_own_enrollments" ON enrollments;
DROP POLICY IF EXISTS "coaches_own_checkins" ON checkins;
DROP POLICY IF EXISTS "coaches_own_summaries" ON ai_summaries;
DROP POLICY IF EXISTS "coaches_own_payments" ON payments;
DROP POLICY IF EXISTS "coaches_own_whatsapp" ON whatsapp_log;

-- Coaches table: Users can only see/update their own record
CREATE POLICY "coaches_select_own" ON coaches
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "coaches_update_own" ON coaches
    FOR UPDATE USING (id = auth.uid());

-- Programs table: Full CRUD for coaches on their own data
CREATE POLICY "programs_select_own" ON programs
    FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "programs_insert_own" ON programs
    FOR INSERT WITH CHECK (coach_id = auth.uid());

CREATE POLICY "programs_update_own" ON programs
    FOR UPDATE USING (coach_id = auth.uid());

CREATE POLICY "programs_delete_own" ON programs
    FOR DELETE USING (coach_id = auth.uid());

-- Clients table: Full CRUD
CREATE POLICY "clients_select_own" ON clients
    FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "clients_insert_own" ON clients
    FOR INSERT WITH CHECK (coach_id = auth.uid());

CREATE POLICY "clients_update_own" ON clients
    FOR UPDATE USING (coach_id = auth.uid());

CREATE POLICY "clients_delete_own" ON clients
    FOR DELETE USING (coach_id = auth.uid());

-- Enrollments table: Full CRUD
CREATE POLICY "enrollments_select_own" ON enrollments
    FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "enrollments_insert_own" ON enrollments
    FOR INSERT WITH CHECK (coach_id = auth.uid());

CREATE POLICY "enrollments_update_own" ON enrollments
    FOR UPDATE USING (coach_id = auth.uid());

CREATE POLICY "enrollments_delete_own" ON enrollments
    FOR DELETE USING (coach_id = auth.uid());

-- Checkins table: Full CRUD
CREATE POLICY "checkins_select_own" ON checkins
    FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "checkins_insert_own" ON checkins
    FOR INSERT WITH CHECK (coach_id = auth.uid());

CREATE POLICY "checkins_update_own" ON checkins
    FOR UPDATE USING (coach_id = auth.uid());

CREATE POLICY "checkins_delete_own" ON checkins
    FOR DELETE USING (coach_id = auth.uid());

-- AI Summaries table: Full CRUD
CREATE POLICY "ai_summaries_select_own" ON ai_summaries
    FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "ai_summaries_insert_own" ON ai_summaries
    FOR INSERT WITH CHECK (coach_id = auth.uid());

CREATE POLICY "ai_summaries_update_own" ON ai_summaries
    FOR UPDATE USING (coach_id = auth.uid());

CREATE POLICY "ai_summaries_delete_own" ON ai_summaries
    FOR DELETE USING (coach_id = auth.uid());

-- Payments table: Full CRUD
CREATE POLICY "payments_select_own" ON payments
    FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "payments_insert_own" ON payments
    FOR INSERT WITH CHECK (coach_id = auth.uid());

CREATE POLICY "payments_update_own" ON payments
    FOR UPDATE USING (coach_id = auth.uid());

CREATE POLICY "payments_delete_own" ON payments
    FOR DELETE USING (coach_id = auth.uid());

-- WhatsApp Log table: Select only (logs are immutable)
CREATE POLICY "whatsapp_log_select_own" ON whatsapp_log
    FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "whatsapp_log_insert_own" ON whatsapp_log
    FOR INSERT WITH CHECK (coach_id = auth.uid());

-- ──── 3. DATABASE FUNCTIONS ────

-- Function to generate unique coach slug
CREATE OR REPLACE FUNCTION generate_unique_slug(full_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    unique_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Create base slug from name
    base_slug := LOWER(REGEXP_REPLACE(full_name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := REGEXP_REPLACE(base_slug, '^-+|-+$', '');
    
    -- Try without counter first
    unique_slug := base_slug;
    
    -- Check if exists, add counter if needed
    WHILE EXISTS (SELECT 1 FROM coaches WHERE slug = unique_slug) LOOP
        counter := counter + 1;
        unique_slug := base_slug || '-' || counter::TEXT;
    END LOOP;
    
    RETURN unique_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate week number for a client enrollment
CREATE OR REPLACE FUNCTION calculate_enrollment_week(
    p_enrollment_id UUID,
    p_check_date DATE DEFAULT CURRENT_DATE
)
RETURNS INTEGER AS $$
DECLARE
    v_start_date DATE;
    v_week_number INTEGER;
BEGIN
    SELECT start_date INTO v_start_date
    FROM enrollments
    WHERE id = p_enrollment_id;
    
    IF v_start_date IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Calculate weeks since start date (Week 1 = first week)
    v_week_number := FLOOR((p_check_date - v_start_date) / 7)::INTEGER + 1;
    
    RETURN GREATEST(v_week_number, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get active enrollments count for a program
CREATE OR REPLACE FUNCTION get_program_active_enrollments(p_program_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM enrollments
    WHERE program_id = p_program_id
      AND status IN ('active', 'trial');
    
    RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ──── 4. ADDITIONAL INDEXES ────

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_programs_coach_active ON programs(coach_id, is_active);
CREATE INDEX IF NOT EXISTS idx_enrollments_client_status ON enrollments(client_id, status);
CREATE INDEX IF NOT EXISTS idx_enrollments_dates ON enrollments(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_checkins_client_date ON checkins(client_id, check_date);
CREATE INDEX IF NOT EXISTS idx_checkins_enrollment ON checkins(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_ai_summaries_coach_generated ON ai_summaries(coach_id, generated_at);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment ON payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_log_client ON whatsapp_log(client_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_log_sent_at ON whatsapp_log(sent_at);

-- Text search indexes (for future full-text search features)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_clients_full_name_trgm ON clients USING gin (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_programs_name_trgm ON programs USING gin (name gin_trgm_ops);

-- ──── 5. CASCADE DELETE FIXES ────

-- Add cascade delete to checkins when enrollment is deleted
ALTER TABLE checkins
    DROP CONSTRAINT IF EXISTS checkins_enrollment_id_fkey,
    ADD CONSTRAINT checkins_enrollment_id_fkey 
        FOREIGN KEY (enrollment_id) 
        REFERENCES enrollments(id) 
        ON DELETE CASCADE;

-- Cascade delete for WhatsApp logs when client is deleted
ALTER TABLE whatsapp_log
    DROP CONSTRAINT IF EXISTS whatsapp_log_client_id_fkey,
    ADD CONSTRAINT whatsapp_log_client_id_fkey 
        FOREIGN KEY (client_id) 
        REFERENCES clients(id) 
        ON DELETE CASCADE;

-- ──── 6. DATA VALIDATION CONSTRAINTS ────

-- Ensure check-in day is valid (0-6)
ALTER TABLE coaches
    ADD CONSTRAINT coaches_checkin_day_valid 
    CHECK (checkin_day >= 0 AND checkin_day <= 6);

-- Ensure check-in time is in HH:MM format
ALTER TABLE coaches
    ADD CONSTRAINT coaches_checkin_time_format 
    CHECK (checkin_time ~ '^([01]?[0-9]|2[0-3]):[0-5][0-9]$');

-- Ensure energy score is within valid range
ALTER TABLE checkins
    ADD CONSTRAINT checkins_energy_score_range 
    CHECK (energy_score IS NULL OR (energy_score >= 1 AND energy_score <= 10));

-- Ensure enrollment end_date is after start_date
ALTER TABLE enrollments
    ADD CONSTRAINT enrollments_date_range_valid 
    CHECK (end_date >= start_date);

-- Ensure price is non-negative
ALTER TABLE programs
    ADD CONSTRAINT programs_price_positive 
    CHECK (price >= 0);

-- ──── 7. HELPER VIEWS FOR COMMON QUERIES ────

-- View for active clients with their current enrollment
CREATE OR REPLACE VIEW active_clients_view AS
SELECT 
    c.id AS client_id,
    c.full_name AS client_name,
    c.email,
    c.whatsapp_number,
    c.coach_id,
    e.id AS enrollment_id,
    e.program_id,
    e.start_date,
    e.end_date,
    e.status AS enrollment_status,
    p.name AS program_name,
    (e.end_date - CURRENT_DATE) AS days_until_expiry
FROM clients c
INNER JOIN enrollments e ON c.id = e.client_id AND e.status = 'active'
INNER JOIN programs p ON e.program_id = p.id;

-- View for upcoming renewals (next 14 days)
CREATE OR REPLACE VIEW upcoming_renewals_view AS
SELECT 
    e.id AS enrollment_id,
    c.full_name AS client_name,
    c.email,
    c.whatsapp_number,
    p.name AS program_name,
    e.end_date,
    (e.end_date - CURRENT_DATE) AS days_until_expiry,
    e.amount_paid,
    e.currency,
    coach.full_name AS coach_name
FROM enrollments e
INNER JOIN clients c ON e.client_id = c.id
INNER JOIN programs p ON e.program_id = p.id
INNER JOIN coaches coach ON e.coach_id = coach.id
WHERE e.status = 'active'
  AND e.end_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '14 days');

-- View for weekly check-in response rates
CREATE OR REPLACE VIEW weekly_response_rates_view AS
SELECT 
    DATE_TRUNC('week', check_date) AS week_start,
    COUNT(DISTINCT client_id) AS total_clients,
    COUNT(DISTINCT CASE WHEN responded_at IS NOT NULL THEN client_id END) AS responded_clients,
    ROUND(
        COUNT(DISTINCT CASE WHEN responded_at IS NOT NULL THEN client_id END)::NUMERIC / 
        NULLIF(COUNT(DISTINCT client_id), 0) * 100, 
        2
    ) AS response_rate_percent
FROM checkins
GROUP BY DATE_TRUNC('week', check_date)
ORDER BY week_start DESC;

-- ──── 8. COMMENT DOCUMENTATION ────

COMMENT ON TABLE coaches IS 'Coach accounts - one per authenticated user';
COMMENT ON TABLE programs IS 'Fitness programs offered by coaches';
COMMENT ON TABLE clients IS 'Clients enrolled under a specific coach';
COMMENT ON TABLE enrollments IS 'Active and past client program enrollments';
COMMENT ON TABLE checkins IS 'Weekly client check-in submissions';
COMMENT ON TABLE ai_summaries IS 'AI-generated weekly coaching summaries';
COMMENT ON TABLE payments IS 'Payment transaction records';
COMMENT ON TABLE whatsapp_log IS 'WhatsApp message audit log';

COMMENT ON COLUMN coaches.checkin_day IS 'Day of week for check-ins: 0=Sunday, 1=Monday...6=Saturday';
COMMENT ON COLUMN coaches.slug IS 'Unique public identifier for intake forms';
COMMENT ON COLUMN enrollments.status IS 'Status: active | expired | renewed | cancelled | pending | payment_failed';
COMMENT ON COLUMN checkins.energy_score IS 'Client energy level 1-10';

-- ──── GRANT PERMISSIONS ────

-- Grant execute permissions on functions to authenticated users
GRANT EXECUTE ON FUNCTION generate_unique_slug TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_enrollment_week TO authenticated;
GRANT EXECUTE ON FUNCTION get_program_active_enrollments TO authenticated;

-- Grant select permissions on views to authenticated users
GRANT SELECT ON active_clients_view TO authenticated;
GRANT SELECT ON upcoming_renewals_view TO authenticated;
GRANT SELECT ON weekly_response_rates_view TO authenticated;

-- Notify completion
DO $$
BEGIN
    RAISE NOTICE 'Migration 003: Phase 1 Core Infrastructure completed successfully!';
    RAISE NOTICE 'Added: Triggers, Complete RLS, Functions, Indexes, Constraints, Views';
END $$;
