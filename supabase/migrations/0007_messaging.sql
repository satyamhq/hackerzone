-- 0007_messaging.sql: Direct and context-based messaging between students, recruiters, and mentors

CREATE TABLE public.message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids UUID[] NOT NULL,
  subject TEXT,
  context_type TEXT,
  context_id UUID,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_threads_participants ON public.message_threads USING GIN(participant_ids);
CREATE INDEX idx_message_threads_last_msg ON public.message_threads(last_message_at DESC);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_thread_id ON public.messages(thread_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at ASC);

-- Enable RLS
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Message threads policies: strictly scoped to participants and admins
CREATE POLICY "message_threads_select_policy" ON public.message_threads
  FOR SELECT USING (
    auth.uid() = ANY(participant_ids)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "message_threads_insert_policy" ON public.message_threads
  FOR INSERT WITH CHECK (
    auth.uid() = ANY(participant_ids)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "message_threads_update_policy" ON public.message_threads
  FOR UPDATE USING (
    auth.uid() = ANY(participant_ids)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Messages policies
CREATE POLICY "messages_select_policy" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.message_threads mt
      WHERE mt.id = messages.thread_id AND auth.uid() = ANY(mt.participant_ids)
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "messages_insert_policy" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.message_threads mt
      WHERE mt.id = messages.thread_id AND auth.uid() = ANY(mt.participant_ids)
    )
  );

CREATE POLICY "messages_update_policy" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.message_threads mt
      WHERE mt.id = messages.thread_id AND auth.uid() = ANY(mt.participant_ids)
    )
  );
