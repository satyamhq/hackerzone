-- 0004_fulltext_search_and_saved_searches.sql: Add Full-Text Search column/index to jobs and create saved_searches table

-- 1. Add FTS Column and GIN Index on jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS fts tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(array_to_string(skills_required, ' '), '')), 'B')
) STORED;

CREATE INDEX IF NOT EXISTS idx_jobs_fts ON public.jobs USING GIN(fts);

-- 2. Create Saved Searches Table for Student Alerts
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on saved_searches
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read write own saved searches"
  ON public.saved_searches FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
