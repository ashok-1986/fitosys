-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    record_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Coaches can view their own audit logs
CREATE POLICY "Coaches can view their own audit logs"
    ON public.audit_logs
    FOR SELECT
    USING (auth.uid() = coach_id);

-- Only system/service role can insert into audit_logs (to prevent tampering)
-- If we want coaches to insert via client, we could allow insert:
CREATE POLICY "Coaches can insert their own audit logs"
    ON public.audit_logs
    FOR INSERT
    WITH CHECK (auth.uid() = coach_id);

-- NO UPDATE OR DELETE POLICIES
-- This ensures the audit log is append-only for standard users

-- Add indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_coach_id ON public.audit_logs(coach_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Grant permissions
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT ON public.audit_logs TO service_role;
