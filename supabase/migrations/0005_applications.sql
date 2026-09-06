-- 0005_applications.sql: Job applications and pipeline tracking

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'submitted',
  resume_url TEXT,
  cover_letter TEXT,
  verified_match_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  custom_responses JSONB DEFAULT '{}'::jsonb,
  recruiter_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_job_application UNIQUE (job_id, user_id)
);

CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(status);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Applications policies
CREATE POLICY "applications_select_policy" ON public.applications
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.company_members cm ON cm.company_id = j.company_id
      WHERE j.id = applications.job_id AND cm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.campus_members cm
      WHERE cm.user_id = auth.uid() AND cm.role = 'campus_admin'
      AND EXISTS (
        SELECT 1 FROM public.campus_members student_cm
        WHERE student_cm.user_id = applications.user_id AND student_cm.campus_id = cm.campus_id
      )
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "applications_insert_policy" ON public.applications
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

CREATE POLICY "applications_update_policy" ON public.applications
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.company_members cm ON cm.company_id = j.company_id
      WHERE j.id = applications.job_id AND cm.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "applications_delete_policy" ON public.applications
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
