# Hackerzone — Master Build Prompt Set (11 Phases)

**Stack:** Next.js 14 (App Router, TypeScript) · Supabase (Postgres, Auth, Storage, Realtime) · Tailwind + shadcn/ui · Vercel

**How to use this file:** Paste each phase's prompt into Claude Code **one at a time, in order**. Do not skip ahead — later phases assume earlier tables/routes exist. After each phase, run the verification checklist before moving on. Keep this file in your repo root as `BUILD_PLAN.md` so Claude Code can reference prior phases.

Every phase prompt already embeds the project's `CLAUDE.md` rules (think before coding, simplicity first, surgical changes, goal-driven execution, no hallucinated data — everything must live in Supabase). Do not remove those lines when pasting.

---

## Phase 0 — Before You Start (one-time setup, not a Claude Code prompt)

Do this yourself first:

1. Create a Supabase project. Note the project URL and anon/publishable key.
2. Create a GitHub repo (empty).
3. Locally: `npx create-next-app@latest hackerzone --typescript --tailwind --app`
4. `cd hackerzone && npx skills add supabase/agent-skills` (optional but recommended — gives Claude Code accurate Supabase patterns).
5. Create `CLAUDE.md` in the repo root with the guidelines you already have (think before coding, simplicity first, surgical changes, goal-driven execution, "every data must be in Supabase — no hallucinated/mock data").
6. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, never exposed to client
   ```
7. `git init && git add . && git commit -m "init"` then push.

Now open Claude Code in this repo and begin Phase 1.

---

## PHASE 1 — Foundation, Design System & Project Structure

```
Read CLAUDE.md and follow it strictly for this entire task.

GOAL: Set up the foundational Next.js + Supabase project structure and design
system for "Hackerzone" — a three-sided job marketplace connecting job
seekers, employers, and educational institutions in India.

Do NOT build any feature pages yet. This phase is scaffolding only.

TASKS:
1. Install dependencies: @supabase/supabase-js @supabase/ssr, shadcn/ui
   (init with the "modern-minimal" style — neutral base color, rounded-md
   radius), lucide-react, zod, react-hook-form.
2. Create the Supabase client helpers exactly as in this pattern (server
   client, browser client, middleware client with session refresh) — ask me
   for confirmation if my existing utils/supabase files differ from this
   pattern before overwriting anything:
   - utils/supabase/server.ts
   - utils/supabase/client.ts
   - utils/supabase/middleware.ts
   - middleware.ts (root) wiring the above
3. Set up the folder structure:
   /app
     /(marketing)          -> public landing pages
     /(auth)                -> sign-in, sign-up, role-selection
     /(student)              -> student dashboard routes
     /(employer)             -> employer dashboard routes
     /(institution)           -> institution/career-center routes
     /(admin)                -> internal admin routes
     /api                    -> route handlers
   /components
     /ui                     -> shadcn primitives
     /shared                 -> cross-role components (navbar, footer, etc.)
   /lib
     /supabase                -> queries grouped by domain (jobs.ts, users.ts...)
     /validators               -> zod schemas
   /types                     -> shared TypeScript types
4. Define a design token set in globals.css / tailwind.config: primary color,
   neutral scale, font (use a clean sans-serif, e.g. Inter), spacing scale.
   Do not use default shadcn indigo — pick a distinct brand color and state
   your choice.
5. Build a placeholder landing page at app/(marketing)/page.tsx with just a
   hero section, nav, and footer shell (no real copy yet — use short
   descriptive placeholders, we'll write real copy in Phase 9).
6. Confirm the app builds and runs with `npm run dev` and `npm run build`
   with zero errors.

VERIFY:
- `npm run build` passes with no TypeScript errors.
- Folder structure matches the spec above.
- No feature logic, no database calls yet beyond the client helpers.

State your plan first, then implement, then report the verification results.
```

**Checklist:** app builds · folder structure exists · design tokens set · no mock data anywhere.

---

## PHASE 2 — Database Schema (Supabase / Postgres)

```
Read CLAUDE.md and follow it strictly. Every entity in this app must be
backed by a real Supabase table — never invent client-side mock data.

GOAL: Design and create the full Postgres schema in Supabase for Hackerzone,
plus Row Level Security (RLS) policies. Use Supabase migrations (SQL files
in /supabase/migrations), not the dashboard, so the schema is version
controlled.

CORE TABLES (create all of these with appropriate columns, foreign keys,
enums, and timestamps):

- profiles (extends auth.users: id, role enum['student','employer',
  'institution_admin','admin'], full_name, avatar_url, phone, created_at)
- students (user_id FK, headline, bio, resume_url, graduation_year,
  location, skills text[], links jsonb)
- institutions (id, name, domain, verified boolean, logo_url, city, state)
- institution_admins (user_id FK, institution_id FK)
- companies (id, name, logo_url, website, industry, size_range, description,
  verified boolean)
- employer_members (user_id FK, company_id FK, role enum['owner','recruiter'])
- jobs (id, company_id FK, posted_by FK, title, description, job_type
  enum['full_time','internship','part_time','freelance','gig'],
  location, is_remote boolean, min_salary, max_salary, skills_required
  text[], status enum['draft','open','closed'], visibility scope if needed
  for institution-only postings, created_at)
- applications (id, job_id FK, student_id FK, status
  enum['submitted','under_review','shortlisted','rejected','hired'],
  resume_url, cover_letter, applied_at)
- events (id, institution_id FK nullable, company_id FK nullable, title,
  description, event_type enum['career_fair','workshop','info_session'],
  starts_at, ends_at, is_virtual boolean, location)
- event_registrations (event_id FK, user_id FK, registered_at)
- messages (id, thread_id, sender_id FK, recipient_id FK, body, read_at,
  created_at)
- message_threads (id, subject, participant_ids uuid[])
- skills (id, name, category) — canonical skill list for matching/tagging
- courses (id, title, description, provider, skill_ids uuid[], url) —
  for the upskilling/fellowship module
- course_enrollments (course_id FK, student_id FK, status, completed_at)
- employer_plans (company_id FK, plan enum['basic','pro','enterprise'],
  message_quota int, renews_at)
- notifications (id, user_id FK, type, payload jsonb, read boolean,
  created_at)

REQUIREMENTS:
1. Every table gets RLS enabled. Write explicit policies:
   - Students can read/write only their own profile & applications.
   - Employers can read/write only their own company's jobs & applicants
     to their jobs.
   - Institution admins can read aggregate data for students affiliated
     with their institution (by email domain match) but not private
     student data outside consented scope.
   - Public/anon can read published job listings and public company profiles.
2. Add indexes on foreign keys and on columns used for search/filtering
   (jobs.status, jobs.job_type, jobs.location, applications.status).
3. Add a Postgres trigger to auto-insert a `profiles` row when a new
   auth.users row is created, defaulting role from signup metadata.
4. Write the migration files under /supabase/migrations with clear
   sequential naming (0001_init.sql, 0002_rls.sql, etc.)
5. Provide a short SEED script (supabase/seed.sql) with a handful of
   realistic sample rows (a few companies, jobs, students, one
   institution) ONLY for local dev — clearly mark it as dev-only, never
   run in production.

Do not write any frontend code in this phase. Only schema + RLS + seed.

VERIFY:
- `supabase db reset` (or migration apply) runs clean.
- List every table and confirm RLS is ON for each.
- Confirm the auto-profile trigger works by describing a test case.

State your plan first, then implement, then report results.
```

**Checklist:** every table has RLS · trigger creates profile on signup · seed data is clearly dev-only · migrations are files, not dashboard edits.

---

## PHASE 3 — Authentication & Role-Based Routing

```
Read CLAUDE.md. Build on Phase 1 (project structure) and Phase 2 (schema) —
do not modify the schema unless something is missing; if it's missing, tell
me before adding tables.

GOAL: Full auth flow with role selection and role-based route protection.

TASKS:
1. Sign-up flow: email + password (Supabase Auth), with a role-selection
   step (student / employer / institution admin) that writes into
   auth signup metadata, consumed by the Phase 2 trigger to set
   profiles.role.
2. For student sign-up, also collect and validate an institution email
   domain if they want auto-affiliation (optional field, not required).
3. Sign-in page, forgot-password flow, and email verification handling
   (Supabase's built-in flows — use their hosted templates or build
   custom callback routes under /app/(auth)/callback).
4. Session handling via the middleware from Phase 1 — confirm cookies
   refresh correctly on protected routes.
5. Route protection: 
   - /(student)/* requires role='student'
   - /(employer)/* requires role in ('employer') AND active
     employer_members row
   - /(institution)/* requires role='institution_admin'
   - /(admin)/* requires role='admin'
   Redirect unauthorized users to sign-in with a return URL.
6. Build a minimal top navbar (from /components/shared) that changes
   links based on the logged-in user's role, with sign-out.
7. Build simple "post-signup" onboarding stubs (empty pages ok) for each
   role that the user lands on right after first sign-up — we'll flesh
   these out in later phases.

VERIFY:
- Manually test (describe the steps) sign-up as each of the three roles
  and confirm correct redirect + correct profiles.role in the DB.
- Confirm a student cannot access /(employer)/* routes (should redirect).
- `npm run build` still passes.

State your plan first, implement, then report verification results.
```

**Checklist:** 3 roles can sign up · route guards work both ways · no role can see another role's dashboard shell.

---

## PHASE 4 — Student Profile & Dashboard

```
Read CLAUDE.md. Build on Phases 1–3.

GOAL: Full student-facing profile creation and dashboard, backed entirely
by the `students`, `applications`, `course_enrollments` tables — no mock
data.

TASKS:
1. Profile editor at /(student)/profile: headline, bio, skills (multi-
   select against the `skills` table, allow adding new skill if not
   found), resume upload (Supabase Storage bucket `resumes`, private,
   signed URLs), graduation year, location, external links.
2. Profile completeness indicator (simple % based on filled fields).
3. Dashboard home at /(student)/dashboard showing:
   - Recommended jobs (basic matching: overlap between student.skills
     and jobs.skills_required — real query, not fake data; refine
     matching algorithm in Phase 6).
   - Application status summary (counts by status from `applications`).
   - Upcoming registered events (join events + event_registrations).
4. "My Applications" page listing all applications with current status,
   sortable by date/status.
5. Public student profile view (read-only) at /(student)/[id] respecting
   RLS (only visible to employers who received an application from that
   student, or if student marks profile public — add a `is_public`
   boolean column via a small migration if not already present, and
   note this schema addition to me explicitly).

VERIFY:
- Create a test student, fill profile, upload a resume, confirm the
  signed URL works and the file is private (not publicly listable).
- Confirm recommended jobs query returns real rows from `jobs`, joining
  correctly on skills overlap.
- `npm run build` passes.

State your plan, flag the schema addition if any, implement, then verify.
```

**Checklist:** resume storage is private with signed URLs · recommendations come from a real query · no hardcoded job/company names anywhere in components.

---

## PHASE 5 — Employer Dashboard & Job Posting

```
Read CLAUDE.md. Build on Phases 1–4.

GOAL: Employer-facing company setup, job posting, and applicant review —
fully wired to Supabase.

TASKS:
1. Company setup flow at /(employer)/company/setup: create or join an
   existing company (search by name/domain), writes to `companies` and
   `employer_members`.
2. Job posting form at /(employer)/jobs/new: title, description, type,
   location/remote, salary range, required skills (multi-select from
   `skills` table), status (draft/open). Validate with zod.
3. Job management list at /(employer)/jobs: edit, close, view applicant
   count per job (real count from `applications`).
4. Applicant review page at /(employer)/jobs/[id]/applicants: list
   applicants with resume link (signed URL), status dropdown to move
   through submitted -> under_review -> shortlisted -> rejected/hired,
   writes back to `applications.status` and inserts a row into
   `notifications` for the student.
5. Enforce the plan-based messaging quota from `employer_plans` (Basic
   free tier gets a limited number of outbound messages/month per the
   pricing tiers you've already defined — implement the counter and
   block sending once the quota is hit, with an upgrade prompt).
6. Simple employer dashboard home showing: open jobs count, total
   applicants this month, quota remaining.

VERIFY:
- Post a job as a test employer, confirm it's queryable from the
  student "recommended jobs" query built in Phase 4 (i.e., posting on
  one side shows up on the other — this is the core marketplace loop).
- Confirm applicant status changes persist and trigger a notification row.
- Confirm quota enforcement actually blocks sends past the limit.
- `npm run build` passes.

State your plan, implement, then verify — specifically re-verify the
employer-post -> student-sees-it loop end to end.
```

**Checklist:** posting a job makes it appear for matching students · quota logic is real and enforced · no placeholder applicant data.

---

## PHASE 6 — Job Search, Filters & Matching Engine

```
Read CLAUDE.md. Build on Phases 1–5.

GOAL: A real search/filter/matching system for job listings, used by both
the public marketing job board and the logged-in student dashboard.

TASKS:
1. Public job search page at /(marketing)/jobs: search by keyword
   (title/description via Postgres full-text search — add a `tsvector`
   column + GIN index via migration), filters for job_type, location,
   remote, skill tags. Paginate results (server-side, not client-side
   slicing of a full fetch).
2. Improve the matching algorithm from Phase 4: weight by skill overlap
   count, recency of posting, and (if logged in) location proximity/
   remote preference. Keep it a straightforward scored SQL query or a
   scored function in /lib/supabase/jobs.ts — no external ML service,
   this should be explainable and debuggable.
3. Saved searches / job alerts: students can save a filter combination;
   store in a new `saved_searches` table (flag this schema addition).
4. "Similar jobs" component on a job detail page using the same skill-
   overlap logic.
5. Job detail page at /jobs/[id] (public) with an "Apply" CTA that
   routes to sign-in if not authenticated, or opens the application
   modal (cover letter + resume selection from their stored resume) if
   authenticated as a student.

VERIFY:
- Confirm full-text search returns correct results for a few test
  queries (describe them).
- Confirm filters combine correctly (AND logic across filter types).
- Confirm applying end-to-end creates a row in `applications` and is
  visible in Phase 5's applicant review page.
- `npm run build` passes.

State your plan, flag any schema addition, implement, then verify.
```

**Checklist:** search uses Postgres full-text search, not `ilike '%...%'` scans · matching is a transparent scored query · apply flow is one continuous loop across student and employer sides.

---

## PHASE 7 — Institution / Career Center Portal

```
Read CLAUDE.md. Build on Phases 1–6.

GOAL: Institution-admin-facing portal for career centers to see their
affiliated students' outcomes and manage employer relationships.

TASKS:
1. Institution onboarding at /(institution)/setup: verify institution
   domain, admin claims the institution record (or requests a new one —
   route new institution requests to an `admin`-reviewed pending state
   using the `verified` boolean on `institutions`).
2. Institution dashboard at /(institution)/dashboard:
   - Count of affiliated students (by email domain match on `profiles`/
     `students`), aggregate placement stats (count of applications by
     status across their students) — real aggregate SQL, not invented
     percentages.
   - List of employers who have posted jobs visible to their students.
3. Student roster page (read-only aggregate + opt-in visible profiles
   only, respecting the `is_public` flag from Phase 4 / RLS).
4. Institution-hosted events: create/manage events (career fairs,
   workshops) using the `events` table, visible to their affiliated
   students on the student dashboard event list from Phase 4.
5. Basic reporting export: CSV export of aggregate stats (server route
   handler generating CSV from the same aggregate query, not client-
   side fabrication).

VERIFY:
- Confirm institution admin sees only their own affiliated students'
  aggregate data, not other institutions' (RLS test).
- Create a test event as an institution and confirm it appears on an
  affiliated student's dashboard (Phase 4 loop).
- CSV export downloads and contains real query results.
- `npm run build` passes.

State your plan, implement, then verify the cross-role visibility rules
specifically.
```

**Checklist:** institution data is scoped correctly by RLS · events created here surface on the student side · CSV export is real data.

---

## PHASE 8 — Messaging & Notifications

```
Read CLAUDE.md. Build on Phases 1–7.

GOAL: In-app messaging between employers and students (respecting quota),
plus a notification center for all roles, using Supabase Realtime.

TASKS:
1. Message thread UI: inbox list at /(shared or per-role)/messages,
   thread view with real-time updates via Supabase Realtime subscription
   on the `messages` table filtered by thread_id.
2. Starting a thread: employer can message a student who has applied to
   one of their jobs (enforce this constraint at the query/RLS level,
   not just UI) — deduct from `employer_plans` quota on send.
3. Notification bell component (shared navbar) showing unread count
   from `notifications`, dropdown list, mark-as-read on open, and
   realtime subscription for new notifications.
4. Notification triggers already partially wired in Phase 5 (application
   status change) — extend to also fire on: new message received, event
   registration confirmation, job match alert (from saved searches in
   Phase 6, run as a scheduled Supabase Edge Function or cron — describe
   the cron setup, implement as a Supabase Edge Function under
   /supabase/functions/job-alerts).
5. Email notifications (optional but recommended): use Supabase's
   built-in email or a transactional provider — stub this behind an
   env flag if no provider key is available yet, and clearly tell me
   what env var is needed rather than inventing a fake integration.

VERIFY:
- Send a message as an employer to an applicant, confirm realtime
  delivery to the student's inbox in another test session.
- Confirm quota deducts correctly and blocks at zero.
- Confirm notification bell updates in realtime for a new message.
- `npm run build` passes.

State your plan, implement, then verify realtime specifically (describe
the two-session test).
```

**Checklist:** messaging is quota-enforced at the data layer · realtime actually works · no invented "sent" state without a DB row.

---

## PHASE 9 — Public Marketing Site & Real Copy

```
Read CLAUDE.md. Build on Phase 1's placeholder marketing shell.

GOAL: Replace placeholder copy with real, original Hackerzone marketing
pages. Do not copy text from any competitor site — write original copy
based on Hackerzone's actual positioning: a three-sided career network
for the Indian AI economy connecting students, institutions, and
employers.

TASKS:
1. Homepage: hero, "for students" / "for employers" / "for institutions"
   sections, how-it-works, stats section pulling REAL aggregate numbers
   from the database (total open jobs, total registered students, total
   partner institutions) via a server component query — not hardcoded
   numbers.
2. /for-employers page describing the three-tier pricing (Basic free /
   Pro ₹10,000/month / Enterprise contact sales) matching the
   `employer_plans` enum from Phase 2 — pull feature bullet lists from a
   config file (/lib/pricing.ts) so pricing page and the actual paywall
   logic in Phase 5 stay in sync.
3. /for-students and /for-institutions pages.
4. SEO metadata: set the meta title "Hackerzone: the career network for
   the Indian AI economy" and a meta description summarizing the
   platform, in app/(marketing)/layout.tsx using Next.js Metadata API.
5. Footer with real internal links only (no dead links to competitor
   domains) — Students, Employers, Institutions, About, Careers,
   Support, Legal (Terms/Privacy stub pages).
6. Responsive check: confirm mobile layout for homepage and pricing page.

VERIFY:
- Confirm the stats section renders real counts (test by adding a job
  and confirming the count increments after a refresh).
- Confirm pricing page bullets match `/lib/pricing.ts`, and that config
  file is also imported by the Phase 5 quota-enforcement logic (single
  source of truth — no duplicated numbers).
- `npm run build` passes, Lighthouse-basic check on homepage (describe
  any obvious performance issues).

State your plan, implement, then verify the single-source-of-truth
pricing check specifically.
```

**Checklist:** all copy is original · stats are live queries · pricing appears in exactly one config file, referenced everywhere.

---

## PHASE 10 — Admin Panel & Platform Operations

```
Read CLAUDE.md. Build on Phases 1–9.

GOAL: Internal admin panel for platform operations — moderation,
institution verification, company verification, and basic analytics.

TASKS:
1. Admin dashboard at /(admin)/dashboard: platform-wide real metrics
   (total users by role, jobs posted this week, applications this week,
   active employer plans by tier) via server-side aggregate queries.
2. Institution verification queue: list pending `institutions` (verified
   = false), approve/reject actions.
3. Company verification queue: same pattern for `companies`.
4. Job moderation: flagged/reported jobs list (add a `reports` table if
   not present — flag this schema addition) with an admin action to
   unpublish a job.
5. User management: search users by email/role, ability to deactivate
   an account (soft delete via a `deactivated_at` column — flag this
   schema addition if new).
6. Restrict all /(admin)/* routes to role='admin' only, double-checked
   at both the middleware layer (Phase 3) and RLS layer (server queries
   must fail closed if RLS is somehow bypassed).

VERIFY:
- Confirm a non-admin user gets a 403/redirect on every /(admin)/* route
  and every admin-only query fails under RLS if attempted directly.
- Approve a pending institution and confirm it now appears correctly on
  the institution's own dashboard from Phase 7.
- `npm run build` passes.

State your plan, flag schema additions, implement, then verify the
fail-closed security checks specifically.
```

**Checklist:** admin routes fail closed at both middleware and RLS · every admin metric is a real query · verification actions actually change downstream behavior.

---

## PHASE 11 — Testing, Hardening & Deployment

```
Read CLAUDE.md. This is the final phase — no new features.

GOAL: Stabilize, test, and deploy Hackerzone to production.

TASKS:
1. Write integration tests (Playwright or your preferred framework) for
   the three critical end-to-end loops:
   a. Student signs up -> completes profile -> applies to a job.
   b. Employer signs up -> posts a job -> reviews and updates an
      applicant's status -> student sees the status change.
   c. Institution admin verifies -> creates an event -> student sees it
      on their dashboard.
2. Run through every RLS policy from Phase 2 and write a short test (or
   at minimum a documented manual test) confirming cross-role data
   isolation (a student cannot query another student's private data; an
   employer cannot see another company's applicants; an institution
   admin cannot see another institution's roster).
3. Error handling audit: confirm every Supabase query has proper error
   handling (no silent failures, no console-only errors shown to users
   — use toast/inline error UI).
4. Performance pass: confirm pagination is server-side everywhere,
   confirm images use next/image, confirm no N+1 query patterns in
   dashboard aggregate pages (batch/join instead).
5. Environment & secrets check: confirm SUPABASE_SERVICE_ROLE_KEY is
   never used in any client component or exposed to the browser bundle
   — grep for it and report every usage location for my review.
6. Deployment: connect the repo to Vercel, set environment variables
   there, confirm production build succeeds, run a smoke test of the
   three critical loops above against production.
7. Write a short README covering: setup steps, environment variables
   needed, how to run migrations, how to seed dev data, how to run tests.

VERIFY:
- All three critical-loop tests pass.
- Report every file where the service role key is referenced.
- Production deployment succeeds and smoke test passes.
- README is complete enough that a new developer could set up the repo
  from scratch.

State your plan, implement, then give me the final verification report
plus the production URL.
```

**Checklist:** three critical loops are tested and green · RLS cross-role isolation verified · no service-role key leakage · production deploy is live.

---

## Notes on Using This With Claude Code

- **One phase per session is safest.** If a phase is large, ask Claude Code to break it into its own sub-steps and confirm each before continuing — this matches the "goal-driven execution" rule in your CLAUDE.md.
- **Any time a phase prompt says "flag the schema addition,"** that's intentional — new columns/tables discovered mid-build should be called out, not silently added, so you keep one canonical schema history in `/supabase/migrations`.
- **Re-run `npm run build` after every phase**, not just at the end — catching a broken phase early is much cheaper than debugging phase 9 for a phase 3 mistake.
- **Real data discipline:** every phase explicitly bans mock/hardcoded data per your CLAUDE.md instruction. If Claude Code ever proposes a hardcoded array of "sample jobs" in a component instead of a Supabase query, that's a sign to stop and correct it before continuing.