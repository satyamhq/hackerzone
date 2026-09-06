-- 0003_campuses.sql: Campuses and campus memberships

CREATE TABLE public.campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  domain TEXT UNIQUE,
  tier TEXT NOT NULL DEFAULT 'tier_1',
  city TEXT,
  state TEXT,
  logo_url TEXT,
  banner_url TEXT,
  description TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  stats JSONB DEFAULT '{"student_count": 0, "placement_rate": 0, "average_package": 0}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campuses_slug ON public.campuses(slug);
CREATE INDEX idx_campuses_tier ON public.campuses(tier);

CREATE TABLE public.campus_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID NOT NULL REFERENCES public.campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  roll_number TEXT,
  batch_year INT,
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_campus_user UNIQUE (campus_id, user_id)
);

CREATE INDEX idx_campus_members_campus_id ON public.campus_members(campus_id);
CREATE INDEX idx_campus_members_user_id ON public.campus_members(user_id);

-- Enable RLS
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_members ENABLE ROW LEVEL SECURITY;

-- Campuses policies
CREATE POLICY "campuses_select_policy" ON public.campuses
  FOR SELECT USING (true);

CREATE POLICY "campuses_admin_write_policy" ON public.campuses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.campus_members
      WHERE campus_id = campuses.id AND user_id = auth.uid() AND role = 'campus_admin' AND is_approved = true
    )
  );

-- Campus members policies
CREATE POLICY "campus_members_select_policy" ON public.campus_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.campus_members cm
      WHERE cm.campus_id = campus_members.campus_id AND cm.user_id = auth.uid() AND cm.role = 'campus_admin'
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR (
      is_approved = true
      AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = campus_members.user_id AND p.visibility = 'public')
    )
  );

CREATE POLICY "campus_members_insert_policy" ON public.campus_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "campus_members_update_policy" ON public.campus_members
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.campus_members cm
      WHERE cm.campus_id = campus_members.campus_id AND cm.user_id = auth.uid() AND cm.role = 'campus_admin'
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "campus_members_delete_policy" ON public.campus_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.campus_members cm
      WHERE cm.campus_id = campus_members.campus_id AND cm.user_id = auth.uid() AND cm.role = 'campus_admin'
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
