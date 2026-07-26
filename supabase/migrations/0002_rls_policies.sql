-- 0002_rls_policies.sql: Enable RLS and Define Security Policies for all Hackerzone tables

-- Enable RLS on all 17 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public read profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Students Policies
CREATE POLICY "Students read own student record or employers/admins view"
  ON public.students FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.employer_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.institution_admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Students insert own record"
  ON public.students FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Students update own record"
  ON public.students FOR UPDATE
  USING (user_id = auth.uid());

-- 3. Institutions Policies
CREATE POLICY "Public read institutions"
  ON public.institutions FOR SELECT
  USING (true);

CREATE POLICY "Institution admins update institution"
  ON public.institutions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.institution_admins
      WHERE user_id = auth.uid() AND institution_id = public.institutions.id
    )
  );

-- 4. Institution Admins Policies
CREATE POLICY "Admins read own institution admin records"
  ON public.institution_admins FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.institution_admins ia
      WHERE ia.user_id = auth.uid() AND ia.institution_id = public.institution_admins.institution_id
    )
  );

-- 5. Companies Policies
CREATE POLICY "Public read companies"
  ON public.companies FOR SELECT
  USING (true);

CREATE POLICY "Employer members insert company"
  ON public.companies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Employer members update company"
  ON public.companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.employer_members
      WHERE user_id = auth.uid() AND company_id = public.companies.id
    )
  );

-- 6. Employer Members Policies
CREATE POLICY "Members read own company members"
  ON public.employer_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.employer_members em
      WHERE em.user_id = auth.uid() AND em.company_id = public.employer_members.company_id
    )
  );

CREATE POLICY "Users insert member record"
  ON public.employer_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 7. Jobs Policies
CREATE POLICY "Public read open jobs or company member view"
  ON public.jobs FOR SELECT
  USING (
    status = 'open'
    OR posted_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.employer_members
      WHERE user_id = auth.uid() AND company_id = public.jobs.company_id
    )
  );

CREATE POLICY "Employer members insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (
    posted_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.employer_members
      WHERE user_id = auth.uid() AND company_id = public.jobs.company_id
    )
  );

CREATE POLICY "Employer members update jobs"
  ON public.jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.employer_members
      WHERE user_id = auth.uid() AND company_id = public.jobs.company_id
    )
  );

CREATE POLICY "Employer members delete jobs"
  ON public.jobs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.employer_members
      WHERE user_id = auth.uid() AND company_id = public.jobs.company_id
    )
  );

-- 8. Applications Policies
CREATE POLICY "Students and Employers read applications"
  ON public.applications FOR SELECT
  USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.employer_members em ON em.company_id = j.company_id
      WHERE j.id = public.applications.job_id AND em.user_id = auth.uid()
    )
  );

CREATE POLICY "Students insert applications"
  ON public.applications FOR INSERT
  WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

CREATE POLICY "Students and Employers update applications"
  ON public.applications FOR UPDATE
  USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.employer_members em ON em.company_id = j.company_id
      WHERE j.id = public.applications.job_id AND em.user_id = auth.uid()
    )
  );

-- 9. Events Policies
CREATE POLICY "Public read events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users insert events"
  ON public.events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Organizers update events"
  ON public.events FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 10. Event Registrations Policies
CREATE POLICY "Users read own registrations"
  ON public.event_registrations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users insert registrations"
  ON public.event_registrations FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 11. Message Threads Policies
CREATE POLICY "Participants read threads"
  ON public.message_threads FOR SELECT
  USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "Participants insert threads"
  ON public.message_threads FOR INSERT
  WITH CHECK (auth.uid() = ANY(participant_ids));

-- 12. Messages Policies
CREATE POLICY "Senders and recipients read messages"
  ON public.messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Senders insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- 13. Skills Policies
CREATE POLICY "Public read skills"
  ON public.skills FOR SELECT
  USING (true);

-- 14. Courses Policies
CREATE POLICY "Public read courses"
  ON public.courses FOR SELECT
  USING (true);

-- 15. Course Enrollments Policies
CREATE POLICY "Students read own enrollments"
  ON public.course_enrollments FOR SELECT
  USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

CREATE POLICY "Students insert enrollments"
  ON public.course_enrollments FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- 16. Employer Plans Policies
CREATE POLICY "Company members read plan"
  ON public.employer_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employer_members
      WHERE user_id = auth.uid() AND company_id = public.employer_plans.company_id
    )
  );

-- 17. Notifications Policies
CREATE POLICY "Users read own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());
