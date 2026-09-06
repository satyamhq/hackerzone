-- 0006_events_and_rsvps.sql: Events (hackathons, career fairs, workshops) and RSVPs

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'hackathon',
  host_type TEXT NOT NULL DEFAULT 'platform',
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location_type TEXT NOT NULL DEFAULT 'virtual',
  location TEXT,
  virtual_meeting_url TEXT,
  banner_url TEXT,
  capacity INT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_events_company_id ON public.events(company_id);
CREATE INDEX idx_events_campus_id ON public.events(campus_id);

CREATE TABLE public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_event_rsvp UNIQUE (event_id, user_id)
);

CREATE INDEX idx_event_rsvps_event_id ON public.event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user_id ON public.event_rsvps(user_id);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "events_select_policy" ON public.events
  FOR SELECT USING (
    is_published = true
    OR organizer_id = auth.uid()
    OR (company_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.company_members cm WHERE cm.company_id = events.company_id AND cm.user_id = auth.uid()
    ))
    OR (campus_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.campus_members cm WHERE cm.campus_id = events.campus_id AND cm.user_id = auth.uid() AND cm.role = 'campus_admin'
    ))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "events_insert_policy" ON public.events
  FOR INSERT WITH CHECK (
    organizer_id = auth.uid()
    OR (company_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.company_members cm WHERE cm.company_id = events.company_id AND cm.user_id = auth.uid()
    ))
    OR (campus_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.campus_members cm WHERE cm.campus_id = events.campus_id AND cm.user_id = auth.uid() AND cm.role = 'campus_admin'
    ))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "events_update_policy" ON public.events
  FOR UPDATE USING (
    organizer_id = auth.uid()
    OR (company_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.company_members cm WHERE cm.company_id = events.company_id AND cm.user_id = auth.uid()
    ))
    OR (campus_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.campus_members cm WHERE cm.campus_id = events.campus_id AND cm.user_id = auth.uid() AND cm.role = 'campus_admin'
    ))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "events_delete_policy" ON public.events
  FOR DELETE USING (
    organizer_id = auth.uid()
    OR (company_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.company_members cm WHERE cm.company_id = events.company_id AND cm.user_id = auth.uid()
    ))
    OR (campus_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.campus_members cm WHERE cm.campus_id = events.campus_id AND cm.user_id = auth.uid() AND cm.role = 'campus_admin'
    ))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Event RSVPs policies
CREATE POLICY "event_rsvps_select_policy" ON public.event_rsvps
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.events e WHERE e.id = event_rsvps.event_id AND e.organizer_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "event_rsvps_insert_policy" ON public.event_rsvps
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

CREATE POLICY "event_rsvps_update_policy" ON public.event_rsvps
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "event_rsvps_delete_policy" ON public.event_rsvps
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
