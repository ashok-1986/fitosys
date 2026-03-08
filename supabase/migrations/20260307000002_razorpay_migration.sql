-- Fitosys Migration 002: Stripe → Razorpay (Gateway-Agnostic Column Names)
-- Applied with IF EXISTS guards for safety on live databases

-- ──── COACHES TABLE ────

-- Rename stripe_customer_id → gateway_customer_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coaches' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE coaches RENAME COLUMN stripe_customer_id TO gateway_customer_id;
    END IF;
END $$;

-- Rename stripe_account_id → gateway_account_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coaches' AND column_name = 'stripe_account_id') THEN
        ALTER TABLE coaches RENAME COLUMN stripe_account_id TO gateway_account_id;
    END IF;
END $$;

-- ──── CLIENTS TABLE ────

-- Rename stripe_customer_id → gateway_customer_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE clients RENAME COLUMN stripe_customer_id TO gateway_customer_id;
    END IF;
END $$;

-- ──── ENROLLMENTS TABLE ────

-- Rename stripe_payment_intent_id → gateway_payment_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollments' AND column_name = 'stripe_payment_intent_id') THEN
        ALTER TABLE enrollments RENAME COLUMN stripe_payment_intent_id TO gateway_payment_id;
    END IF;
END $$;

-- Add payment_gateway column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollments' AND column_name = 'payment_gateway') THEN
        ALTER TABLE enrollments ADD COLUMN payment_gateway TEXT DEFAULT 'razorpay';
    END IF;
END $$;

-- Make client_id nullable (needed for "pending" enrollments before payment)
ALTER TABLE enrollments ALTER COLUMN client_id DROP NOT NULL;

-- Add 'pending' and 'payment_failed' as valid status values
-- (No constraint to modify — status is a plain TEXT column)

-- ──── PAYMENTS TABLE ────

-- Rename stripe_payment_intent_id → gateway_payment_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'stripe_payment_intent_id') THEN
        ALTER TABLE payments RENAME COLUMN stripe_payment_intent_id TO gateway_payment_id;
    END IF;
END $$;

-- Rename stripe_payment_status → gateway_payment_status
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'stripe_payment_status') THEN
        ALTER TABLE payments RENAME COLUMN stripe_payment_status TO gateway_payment_status;
    END IF;
END $$;

-- Add gateway_order_id column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'gateway_order_id') THEN
        ALTER TABLE payments ADD COLUMN gateway_order_id TEXT;
    END IF;
END $$;

-- Add payment_gateway column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'payment_gateway') THEN
        ALTER TABLE payments ADD COLUMN payment_gateway TEXT DEFAULT 'razorpay';
    END IF;
END $$;

-- Remove UNIQUE and NOT NULL constraints from gateway_payment_id
-- (Razorpay webhook may insert before verify route, so we allow duplicates/nulls)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'gateway_payment_id') THEN
        ALTER TABLE payments ALTER COLUMN gateway_payment_id DROP NOT NULL;
    ELSE
        ALTER TABLE payments ADD COLUMN gateway_payment_id TEXT;
    END IF;
END $$;

-- Drop unique constraint on gateway_payment_id (was stripe_payment_intent_id)
DO $$
BEGIN
    -- Find and drop the unique constraint
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'payments'::regclass
        AND contype = 'u'
    ) THEN
        EXECUTE (
            SELECT 'ALTER TABLE payments DROP CONSTRAINT ' || conname
            FROM pg_constraint
            WHERE conrelid = 'payments'::regclass
            AND contype = 'u'
            LIMIT 1
        );
    END IF;
END $$;
