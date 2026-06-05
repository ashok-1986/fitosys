-- 1. Enable the pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Add a new encrypted column to clients
ALTER TABLE clients ADD COLUMN whatsapp_number_enc TEXT;

-- 3. Migrate existing data (encrypt using env key)
UPDATE clients 
SET whatsapp_number_enc = encode(
  pgp_sym_encrypt(whatsapp_number, current_setting('app.encryption_key')),
  'base64'
)
WHERE whatsapp_number IS NOT NULL;

-- 4. Repeat steps 2 and 3 for coaches
ALTER TABLE coaches ADD COLUMN whatsapp_number_enc TEXT;

UPDATE coaches
SET whatsapp_number_enc = encode(
  pgp_sym_encrypt(whatsapp_number, current_setting('app.encryption_key')),
  'base64'
)
WHERE whatsapp_number IS NOT NULL;

-- 5. After data migration, rename columns
ALTER TABLE clients RENAME COLUMN whatsapp_number TO whatsapp_number_plaintext;
ALTER TABLE clients RENAME COLUMN whatsapp_number_enc TO whatsapp_number;

ALTER TABLE coaches RENAME COLUMN whatsapp_number TO whatsapp_number_plaintext;
ALTER TABLE coaches RENAME COLUMN whatsapp_number_enc TO whatsapp_number;

-- 6. Drop the plaintext column after confirming encryption
ALTER TABLE clients DROP COLUMN whatsapp_number_plaintext;
ALTER TABLE coaches DROP COLUMN whatsapp_number_plaintext;
