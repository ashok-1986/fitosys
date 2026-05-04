-- Rollback: Remove consent timestamp columns from clients table
ALTER TABLE clients DROP COLUMN IF EXISTS consent_whatsapp_at;
ALTER TABLE clients DROP COLUMN IF EXISTS consent_health_at;
ALTER TABLE clients DROP COLUMN IF EXISTS consent_data_at;
