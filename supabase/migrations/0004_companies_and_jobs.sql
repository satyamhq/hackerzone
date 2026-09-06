-- 0004_companies_and_jobs.sql: Companies, company memberships, and job listings

CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  website_url TEXT,
  description TEXT,
  industry TEXT,
  company_size TEXT,
  headquarters TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_doc_url TEXT,
  tier TEXT NOT NULL DEFAULT 'basic',
  message_allowance INT NOT NULL DEFAULT 10,
  messages_sent_this_month INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_companies_slug ON public.companies(slug);
CREATE INDEX idx_companies_is_verified ON public.companies(is_verified);

CREATE TABLE public.company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'recruiter',
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_company_user UNIQUE (company_id, user_id)
);

CREATE INDEX idx_company_members_company_id ON public.company_members(company_id);
CREATE INDEX idx_company_members_user_id ON public.company_members(user_id);

CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'full_time',
  workplace_type TEXT NOT NULL DEFAULT 'remote',
  location TEXT,
  salary_min INT,
  salary_max INT,
  salary_currency TEXT NOT NULL DEFAULT 'INR',
  experience_level TEXT,
  required_skills JSONB DEFAULT '[]'::jsonb,
  min_verified_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  is_promoted BOOLEAN NOT NULL DEFAULT false,
  target_campuses JSONB DEFAULT '[]'::jsonb,
  application_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_job_type ON public.jobs(job_type);
CREATE INDEX idx_jobs_min_score ON public.jobs(min_verified_score);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "companies_select_policy" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "companies_admin_and_member_write" ON public.companies
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.company_members
      WHERE company_id = companies.id AND user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Company members policies
CREATE POLICY "company_members_select_policy" ON public.company_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.company_members cm
      WHERE cm.company_id = company_members.company_id AND cm.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "company_members_insert_policy" ON public.company_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.company_members cm
      WHERE cm.company_id = company_members.company_id AND cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "company_members_update_policy" ON public.company_members
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.company_members cm
      WHERE cm.company_id = company_members.company_id AND cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "company_members_delete_policy" ON public.company_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.company_members cm
      WHERE cm.company_id = company_members.company_id AND cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')
    )
  );

-- Jobs policies
CREATE POLICY "jobs_select_policy" ON public.jobs
  FOR SELECT USING (
    status = 'published'
    OR EXISTS (
      SELECT 1 FROM public.company_members cm
      WHERE cm.company_id = jobs.company_id AND cm.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "jobs_company_scoped_write" ON public.jobs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.company_members cm
      WHERE cm.company_id = jobs.company_id AND cm.user_id = auth.uid()
    )
  );
