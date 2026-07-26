-- 0005_admin_moderation_and_reports.sql: Create job_reports table and add deactivated_at column to profiles

-- 1. Create Job Reports Table
CREATE TABLE IF NOT EXISTS public.job_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on job_reports
ALTER TABLE public.job_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users insert job reports"
  ON public.job_reports FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Admins manage job reports"
  ON public.job_reports FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. Add deactivated_at column for soft delete on profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMPTZ;
