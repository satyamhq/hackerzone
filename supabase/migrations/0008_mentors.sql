-- 0008_mentors.sql: AI expert mentors and 1:1 booking sessions

CREATE TABLE public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  expertise_areas TEXT[] NOT NULL DEFAULT '{}',
  current_company TEXT,
  current_title TEXT,
  years_of_experience INT NOT NULL DEFAULT 1,
  hourly_rate INT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  bio TEXT,
  availability_slots JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
  review_count INT NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mentors_user_id ON public.mentors(user_id);
CREATE INDEX idx_mentors_is_approved ON public.mentors(is_approved);

CREATE TABLE public.mentor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INT NOT NULL DEFAULT 45,
  status TEXT NOT NULL DEFAULT 'pending',
  topic TEXT NOT NULL,
  notes TEXT,
  meeting_link TEXT,
  price_paid INT NOT NULL DEFAULT 0,
  review_rating INT,
  review_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mentor_bookings_mentor_id ON public.mentor_bookings(mentor_id);
CREATE INDEX idx_mentor_bookings_mentee_id ON public.mentor_bookings(mentee_id);
CREATE INDEX idx_mentor_bookings_scheduled_at ON public.mentor_bookings(scheduled_at);

-- Enable RLS
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;

-- Mentors policies
CREATE POLICY "mentors_select_policy" ON public.mentors
  FOR SELECT USING (
    is_approved = true
    OR user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "mentors_write_policy" ON public.mentors
  FOR ALL USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Mentor bookings policies
CREATE POLICY "mentor_bookings_select_policy" ON public.mentor_bookings
  FOR SELECT USING (
    mentee_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.mentors m WHERE m.id = mentor_bookings.mentor_id AND m.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "mentor_bookings_insert_policy" ON public.mentor_bookings
  FOR INSERT WITH CHECK (
    mentee_id = auth.uid()
  );

CREATE POLICY "mentor_bookings_update_policy" ON public.mentor_bookings
  FOR UPDATE USING (
    mentee_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.mentors m WHERE m.id = mentor_bookings.mentor_id AND m.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
