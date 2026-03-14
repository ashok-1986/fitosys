-- Migration: Account Deletion Tracking (DPDP 2023 Compliance)
-- Date: 2026-03-13
-- Purpose: Add soft delete columns for 30-day grace period compliance

-- Add deletion tracking columns to coaches table
ALTER TABLE coaches 
ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deletion_scheduled_for TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deletion_cancelled_at TIMESTAMPTZ;

-- Add index for efficient cleanup queries
CREATE INDEX IF NOT EXISTS idx_coaches_deletion_scheduled 
ON coaches(deletion_scheduled_for) 
WHERE deletion_scheduled_for IS NOT NULL;

-- Add comment documenting the DPDP compliance requirement
COMMENT ON COLUMN coaches.deletion_requested_at IS 'Timestamp when coach requested account deletion (DPDP 2023 Right to Erasure)';
COMMENT ON COLUMN coaches.deletion_scheduled_for IS 'Timestamp when account will be permanently deleted (30 days after request)';
COMMENT ON COLUMN coaches.deletion_cancelled_at IS 'Timestamp when deletion request was cancelled during grace period';

-- Create function to schedule deletion (30 days from now)
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
$$ LANGUAGE plpgsql;

-- Create function to cancel deletion request
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
$$ LANGUAGE plpgsql;

-- Create function to process expired deletions (run daily via cron)
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
$$ LANGUAGE plpgsql;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION schedule_account_deletion TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_account_deletion TO authenticated;

-- Note: process_expired_deletions should only be called by service role (cron jobs)
