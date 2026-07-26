-- ==============================================================================
-- DEVELOPMENT-ONLY SEED SCRIPT FOR HACKERZONE (LOCAL DEV ONLY)
-- WARNING: DO NOT RUN THIS SCRIPT IN PRODUCTION ENVIRONMENTS.
-- ==============================================================================

-- 1. Insert Canonical Skills
INSERT INTO public.skills (id, name, category) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'React', 'Frontend'),
  ('a2222222-2222-2222-2222-222222222222', 'TypeScript', 'Frontend'),
  ('a3333333-3333-3333-3333-333333333333', 'Next.js', 'Frontend'),
  ('a4444444-4444-4444-4444-444444444444', 'Node.js', 'Backend'),
  ('a5555555-5555-5555-5555-555555555555', 'PostgreSQL', 'Database'),
  ('a6666666-6666-6666-6666-666666666666', 'Python', 'Data Science')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Sample Institution
INSERT INTO public.institutions (id, name, domain, verified, city, state) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'IIT Bombay', 'iitb.ac.in', true, 'Mumbai', 'Maharashtra'),
  ('b2222222-2222-2222-2222-222222222222', 'BITS Pilani', 'pilani.bits-pilani.ac.in', true, 'Pilani', 'Rajasthan')
ON CONFLICT (domain) DO NOTHING;

-- 3. Insert Sample Company
INSERT INTO public.companies (id, name, website, industry, size_range, description, verified) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'TechFlow India', 'https://techflow.example.com', 'Software Engineering', '50-200', 'Building next-generation cloud automation tools for modern enterprises.', true),
  ('c2222222-2222-2222-2222-222222222222', 'Innovate AI', 'https://innovateai.example.com', 'Artificial Intelligence', '10-50', 'AI-driven analytics platform empowering Indian tech startups.', true)
ON CONFLICT DO NOTHING;

-- 4. Insert Employer Plans
INSERT INTO public.employer_plans (company_id, plan, message_quota) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'pro', 250),
  ('c2222222-2222-2222-2222-222222222222', 'basic', 50)
ON CONFLICT (company_id) DO NOTHING;

-- 5. Insert Sample Courses (Fellowships / Upskilling)
INSERT INTO public.courses (id, title, description, provider, skill_ids, url) VALUES
  (
    'd1111111-1111-1111-1111-111111111111',
    'Full-Stack Next.js 14 Mastery',
    'Comprehensive fellowship course covering React, Next.js App Router, and Supabase integration.',
    'Hackerzone Academy',
    ARRAY['a1111111-1111-1111-1111-111111111111'::uuid, 'a3333333-3333-3333-3333-333333333333'::uuid],
    'https://hackerzone.dev/courses/nextjs-mastery'
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    'Advanced TypeScript & Node.js Systems',
    'Deep dive into backend microservices, async patterns, and database design.',
    'Hackerzone Academy',
    ARRAY['a2222222-2222-2222-2222-222222222222'::uuid, 'a4444444-4444-4444-4444-444444444444'::uuid],
    'https://hackerzone.dev/courses/advanced-typescript'
  )
ON CONFLICT DO NOTHING;
