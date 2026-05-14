-- Enforce Razorpay payment idempotency at the database layer.
-- PostgreSQL unique constraints still allow multiple NULL values, so
-- webhook-created placeholder rows without a payment id remain valid.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'payments'::regclass
        AND conname = 'payments_gateway_payment_id_unique'
    ) THEN
        ALTER TABLE payments
        ADD CONSTRAINT payments_gateway_payment_id_unique
        UNIQUE (gateway_payment_id);
    END IF;
END $$;
