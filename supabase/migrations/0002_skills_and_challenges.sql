-- 0002_skills_and_challenges.sql: Skills, user skill ratings, challenges, and submissions

CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  verified_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  badge_tier TEXT NOT NULL DEFAULT 'none',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
);

CREATE INDEX idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON public.user_skills(skill_id);
CREATE INDEX idx_user_skills_score ON public.user_skills(verified_score DESC);

CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  challenge_type TEXT NOT NULL DEFAULT 'code',
  starter_code JSONB DEFAULT '{}'::jsonb,
  test_cases JSONB DEFAULT '[]'::jsonb,
  rubric_criteria JSONB DEFAULT '[]'::jsonb,
  time_limit_sec INT NOT NULL DEFAULT 1800,
  points INT NOT NULL DEFAULT 100,
  sponsor_name TEXT,
  sponsor_logo TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_challenges_skill_id ON public.challenges(skill_id);
CREATE INDEX idx_challenges_difficulty ON public.challenges(difficulty);

CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL DEFAULT 'code',
  code TEXT,
  language TEXT,
  artifacts JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  execution_time_ms INT,
  test_results JSONB DEFAULT '[]'::jsonb,
  evaluator_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_submissions_challenge_id ON public.submissions(challenge_id);
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Skills policies: public read, admin write
CREATE POLICY "skills_select_policy" ON public.skills
  FOR SELECT USING (true);

CREATE POLICY "skills_admin_write_policy" ON public.skills
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- User skills policies: read based on profile visibility, own write or system/admin
CREATE POLICY "user_skills_select_policy" ON public.user_skills
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = user_skills.user_id AND visibility = 'public')
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'recruiter', 'campus_admin'))
  );

CREATE POLICY "user_skills_own_write_policy" ON public.user_skills
  FOR ALL USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Challenges policies: published are public read, admin can manage
CREATE POLICY "challenges_select_policy" ON public.challenges
  FOR SELECT USING (
    is_published = true
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "challenges_admin_write_policy" ON public.challenges
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Submissions policies: user reads own submissions or challenge admins, insert own
CREATE POLICY "submissions_select_policy" ON public.submissions
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "submissions_insert_policy" ON public.submissions
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

CREATE POLICY "submissions_update_policy" ON public.submissions
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
