-- Add to coaches table
ALTER TABLE coaches 
ADD COLUMN deletion_requested_at TIMESTAMPTZ,
ADD COLUMN deletion_scheduled_for TIMESTAMPTZ;
