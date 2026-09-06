-- 0012_rls_policies.sql: Helper RPC functions, Full-text search indexes, and storage security

-- 1. Full-Text Search Indexes
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(location, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_jobs_search_vector ON public.jobs USING GIN(search_vector);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(full_name, '') || ' ' || coalesce(headline, '') || ' ' || coalesce(bio, '') || ' ' || coalesce(location, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_profiles_search_vector ON public.profiles USING GIN(search_vector);

-- 2. Leaderboard RPC
CREATE OR REPLACE FUNCTION public.get_arena_leaderboard(limit_val INT DEFAULT 50)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  headline TEXT,
  total_verified_score NUMERIC,
  skills_count BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id AS user_id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.headline,
    COALESCE(SUM(us.verified_score), 0) AS total_verified_score,
    COUNT(us.id) AS skills_count,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(us.verified_score), 0) DESC) AS rank
  FROM public.profiles p
  JOIN public.user_skills us ON us.user_id = p.id
  WHERE p.visibility = 'public'
  GROUP BY p.id, p.full_name, p.username, p.avatar_url, p.headline
  ORDER BY total_verified_score DESC
  LIMIT limit_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Campus Placement Stats RPC
CREATE OR REPLACE FUNCTION public.get_campus_stats(p_campus_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_student_count BIGINT;
  v_application_count BIGINT;
  v_placed_count BIGINT;
  v_avg_score NUMERIC;
BEGIN
  SELECT COUNT(*) INTO v_student_count
  FROM public.campus_members
  WHERE campus_id = p_campus_id AND is_approved = true;

  SELECT COUNT(*) INTO v_application_count
  FROM public.applications a
  JOIN public.campus_members cm ON cm.user_id = a.user_id
  WHERE cm.campus_id = p_campus_id;

  SELECT COUNT(*) INTO v_placed_count
  FROM public.applications a
  JOIN public.campus_members cm ON cm.user_id = a.user_id
  WHERE cm.campus_id = p_campus_id AND a.status IN ('offered', 'hired');

  SELECT COALESCE(AVG(us.verified_score), 0) INTO v_avg_score
  FROM public.user_skills us
  JOIN public.campus_members cm ON cm.user_id = us.user_id
  WHERE cm.campus_id = p_campus_id;

  RETURN jsonb_build_object(
    'student_count', v_student_count,
    'applications_count', v_application_count,
    'placed_count', v_placed_count,
    'average_verified_score', ROUND(v_avg_score, 2),
    'placement_rate', CASE WHEN v_student_count > 0 THEN ROUND((v_placed_count::numeric / v_student_count::numeric) * 100, 2) ELSE 0 END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Storage Buckets Configuration (if storage schema exists)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('company-logos', 'company-logos', true),
  ('resumes', 'resumes', false),
  ('verification-docs', 'verification-docs', false)
ON CONFLICT (id) DO NOTHING;
