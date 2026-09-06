-- 0009_resources.sql: Learning hub and career resource guides

CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  difficulty TEXT NOT NULL DEFAULT 'intermediate',
  estimated_read_time_min INT NOT NULL DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  external_link TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resources_slug ON public.resources(slug);
CREATE INDEX idx_resources_category ON public.resources(category);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Resources policies
CREATE POLICY "resources_select_policy" ON public.resources
  FOR SELECT USING (
    is_published = true
    OR author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "resources_admin_write_policy" ON public.resources
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR author_id = auth.uid()
  );
