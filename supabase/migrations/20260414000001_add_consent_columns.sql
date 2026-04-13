-- Add consent timestamp columns to clients table
-- These record when each client explicitly consented to data processing,
-- health data collection, and WhatsApp communications.

ALTER TABLE clients ADD COLUMN IF NOT EXISTS consent_data_at TIMESTAMPTZ;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS consent_health_at TIMESTAMPTZ;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS consent_whatsapp_at TIMESTAMPTZ;

-- Add comments for documentation
COMMENT ON COLUMN clients.consent_data_at IS 'Timestamp when client consented to personal data processing';
COMMENT ON COLUMN clients.consent_health_at IS 'Timestamp when client consented to health data collection';
COMMENT ON COLUMN clients.consent_whatsapp_at IS 'Timestamp when client consented to WhatsApp communications';
