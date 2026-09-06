# Hackerzone — Complete Project Reference
**Single source of truth: architecture, workflows, design system, build phases, security, deployment, and performance — everything, consolidated.**

Domain: `hackerzone.in` · Stack: Next.js (App Router) + Supabase + Google OAuth + Vercel

---

# Table of Contents

1. What Hackerzone Is
2. Stack
3. Architecture Overview
4. Handshake Workflows Studied (source of truth for UX)
5. Feature Parity Map (Handshake → Hackerzone)
6. Design System — Black & White Theme
7. SEO / Metadata
8. Database Schema
9. Full Directory Structure
10. Build Phases (1–14)
11. Security
12. Deployment
13. Performance
14. Claude Code Project Guide (CLAUDE.md content)
15. Non-Negotiables

---

# 1. What Hackerzone Is

**Hackerzone: The career network for the Indian AI economy.**
The largest expert network for learning, earning, and growing careers in the AI economy — giving everyone an accessible first step into an AI-powered career.

It combines three models:
- **HackerRank** — verified skill assessment via coding/task challenges
- **Handshake** — campus-first career network: jobs, events, messaging, career-center tooling
- **Mercor** — algorithmic matching between verified talent and roles

> Note: Handshake's own current tagline is literally *"The career network for the AI economy"* — confirming the positioning direction is sound. Hackerzone differentiates by adding a verified skill-assessment layer (HackerRank-style) and algorithmic matching (Mercor-style) on top of the Handshake community/marketplace model, and by being India-first.

---

# 2. Stack (fixed — do not deviate without explicit instruction)

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS |
| Auth | Google OAuth via Supabase Auth (Google Cloud OAuth client) |
| Database | Supabase (Postgres + RLS + Realtime + Storage) |
| Hosting | Vercel |
| Payments | Stripe or Razorpay (test mode first) |
| Errors/Monitoring | Sentry + Vercel Speed Insights |

---

# 3. Architecture Overview

Hackerzone is a single Next.js App Router application with five role-scoped route groups sitting on one Supabase Postgres database, protected by two enforcement layers (route middleware + Postgres RLS). There is no separate backend service — API routes under `app/api/*` are the only server-side compute surface besides Server Components themselves, and the one deliberately isolated exception is the Skill Arena code-execution sandbox, which runs outside the main app process entirely for security and performance reasons (see §11.4 and §13.5).

**Actors:**
- **Student** — builds a verified skill profile, applies to jobs, attends events, messages employers, books mentors
- **Recruiter / Company** — posts jobs, searches talent, manages a hiring pipeline, messages candidates, sponsors challenges
- **Campus Admin** — manages their institution's student roster, approves employer access, runs campus events, views placement analytics
- **Platform Admin** — moderates content, verifies companies/campuses, views platform-wide analytics, manages the trust & safety queue

**Core data flow:** a student earns a `verified_score` per skill by passing Skill Arena challenges → that score becomes the primary trust signal on their public profile and the primary filter/ranking input for both the job board and the AI Matching Engine → employers search/receive ranked candidates by score instead of by keyword-matched resumes → applications flow through a pipeline that both sides can see and act on → messaging, events, and mentor booking sit alongside this loop as the "everything in one place" layer, mirroring Handshake's core value proposition.

**Enforcement is layered, not single-point:** route middleware blocks navigation by role before a page renders; Postgres RLS is the actual security boundary underneath every query, enforced regardless of which route or client called it. Neither layer alone is sufficient — this is repeated explicitly in §11.2 because it's the single most important architectural invariant in the system.

---

# 4. Handshake Workflows Studied (source of truth for UX)

### 4.1 Student Workflow
1. Sign up with school email → auto-verified into their institution's community (or self-search college).
2. Build profile: education, skills, interests, work experience, resume/cover letter/transcript upload.
3. Privacy controls: **fully anonymous** (browse/apply only) vs. **public** (discoverable by employers in search) — GPA visibility is a separate toggle.
4. Home feed: algorithmic job/event recommendations ("like Netflix or Spotify," per Handshake's own description) based on profile completeness.
5. Job board: search/filter internships, on-campus jobs, part-time, full-time — apply in-platform.
6. Events: discover & RSVP to career fairs (virtual/in-person), employer info sessions, workshops; get deadline/reminder notifications.
7. Messaging: direct chat with employers and career-center staff.
8. Appointments: book 1:1 sessions with career advisors/coaches directly in-platform (calendar/slot-based).
9. Notifications: application deadlines, upcoming events, new matches.

### 4.2 Employer Workflow (mirrors real, current Handshake pricing)
1. Register company → verification step → build company brand page (logo, description, culture).
2. Post jobs — **free at the Basic tier** (deliberate growth lever: free job posting, monetize outreach/tools instead).
3. Search/filter the student talent pool by skills, major, school, location.
4. Message candidates proactively (message volume is the paid lever).
5. Manage applicants per job in a pipeline view.
6. Host/sponsor events and virtual career fairs.
7. **Tiered plans:**
   - **Basic — Free:** post jobs free, 10 messages/month, simple company presence, promoted-jobs available as paid add-on.
   - **Pro — $450/mo:** 200 messages/month, AI-powered applicant tools, multi-user collaboration, workflow automation, promoted-jobs add-on.
   - **Enterprise — custom pricing:** advanced messaging/promotions/event support, ATS/XML integrations, full brand page + social feed, centralized team/permissions management, full-funnel analytics, promoted jobs included.
   - **Promoted Jobs:** flexible-rate add-on to Basic/Pro, bundled into Enterprise.

### 4.3 Career Center (Campus Admin) Workflow
1. Institution partners with the platform; gets an admin console.
2. Manage/verify student & alumni rosters; issue test accounts to staff.
3. View student profiles, applications, and engagement data.
4. Approve/manage employer access to their specific student population (some schools restrict which employers can message their students).
5. Create/manage career fairs, on-campus interviews, and campus-specific events.
6. Reporting dashboard: student engagement, applications submitted, appointment volume, **post-grad outcomes** — the #1 metric career centers are evaluated on, so it gets dedicated dashboard real estate.
7. Case-study metrics to track equivalents of: increase in career-center appointments, post-grad outcome rate, applications-per-student, employer network growth.

### 4.4 Cross-Cutting Patterns Worth Replicating Exactly
- **Free-to-post, paid-to-reach-out** monetization lever.
- **Profile completeness drives recommendation quality** — explicitly surfaced to the user.
- **Anonymity/privacy as a first-class setting**, not buried.
- **Everything in one place** — jobs + events + appointments + messaging in a single login.
- **Trust & Safety Council** equivalent — dedicated moderation function from day one, given Hackerzone also handles skill-verification integrity.

---

# 5. Feature Parity Map (Handshake → Hackerzone)

| Handshake primitive | Hackerzone equivalent |
|---|---|
| Resume/profile | Verified Skill Profile — skill score as primary trust signal, resume optional |
| Job board | Filtered by **minimum verified skill score**, not keyword-only |
| Algorithmic recommendations | Scored against `verified_score` + skill-match, not just interest tags |
| Free-to-post / paid-outreach (Basic free, Pro $450/mo, Enterprise custom) | Same 3-tier model, India-priced |
| Career fairs | Hackathons + sponsored Skill Arena challenges (a company sponsors a challenge instead of a booth) |
| Career-center dashboard | Campus admin dashboard: engagement, applications, appointments, **placement outcomes** |
| Appointments | Mentor booking with AI-economy experts, not generic career coaches |
| Anonymous/public profile toggle | Same, first-class setting, not buried |
| Trust & Safety Council | Moderation queue + reports table + audit log, live from Phase 1 |
| "Handshake AI" nav item | **Skill Arena** nav item — Hackerzone's differentiated feature, same nav slot |

---

# 6. Design System — Black & White Theme

**Current, canonical theme.** Derived from the user-supplied logo (white "Hackerzone" wordmark) and landing page reference (black/charcoal gradient hero, bold condensed italic headline "LET'S FIND YOUR NEXT JOB," search-bar-as-CTA, pill nav/filters). Any earlier navy/blue direction is retired.

## 6.1 Brand Colors

| Role | Hex | Notes |
|---|---|---|
| Deep Black | `#0A0A0A` | Page base, footer |
| Charcoal Gradient | `#1A1A1A → #4A4A4A → #0A0A0A` | Radial/vertical gradient behind hero, lighter center fading to black edges |
| Pure White | `#FFFFFF` | Headlines, logo, primary buttons on dark bg, search bar fill |
| Off-white text | `#F5F5F5` | Body copy on dark backgrounds |
| Light gray text | `#A3A3A3` | Subtext, placeholder text, secondary nav links |
| Border gray | `#3F3F3F` | Pill button outlines, input borders on dark bg |
| Dark text | `#111111` | Text on white surfaces (search bar, "Sign up" button) |

Strict grayscale — no color accent on the marketing surface. Any future status/success color is reserved for internal dashboards only.

## 6.2 Typography

- **Headline/display font:** bold, condensed, italic-slanted, athletic feel — matches the wordmark. Closest practical approach: **Anton** or **Archivo Black** (Google Fonts) with a CSS italic transform (`font-style: oblique -10deg` or `transform: skewX(-8deg)`), tight letter-spacing (`-0.02em`), all-caps. Hero headline ~64–96px desktop, line-height ~0.95.
- **Body/UI font:** Inter — regular/medium weight, 15–17px body, 14–15px nav.

```css
/* Display / headline */
font-family: 'Anton', 'Archivo Black', sans-serif;
font-style: italic;
letter-spacing: -0.02em;
text-transform: uppercase;

/* Body / UI */
font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
```

## 6.3 Logo Usage

- Primary logo: white wordmark on transparent background (supplied, in use) — dark backgrounds only.
- A dark/black version for future light-background surfaces should be requested from the user rather than auto-inverted via CSS filter, to preserve hand-tuned letterforms.
- Maintain clear space roughly equal to the height of the "H"; don't crowd against nav items. Never recolor, add effects, or stretch it.

## 6.4 Navbar Structure

Sticky top nav, transparent-over-hero transitioning to solid black/blur on scroll.

**Logo** (left) → **Nav links** (center-left) → **Log in / Sign up** (right)

Nav items: Employers · Job seekers · Career centers · **Skill Arena** · Research/Resources · Log in (ghost, rounded-full) · Sign up (filled white, rounded-full)

## 6.5 Hero Section

- Full-viewport-height (or near), radial charcoal-to-black gradient, subtle vignette (lighter center glow, darkening toward edges).
- Headline: two-line, all-caps, bold condensed italic, centered — e.g. `LET'S BUILD YOUR` / `AI-POWERED CAREER`.
- Subtext: light gray, one line, stats-driven (placeholder numbers only until real data exists).
- **Search bar as the primary CTA** (not two buttons): full-width rounded-full white input, search icon left, circular black arrow-submit button inset right.
- Quick-filter pills below: rounded-full, dark fill + light border — e.g. `AI Specialists` `Full-time` `Remote` `Internship` `Skill-Verified Only`.
- No secondary dashboard-mockup graphic — gradient + typography + search bar carry the section.

## 6.6 Section Patterns

- Alternate pure black (`#0A0A0A`) and near-black (`#141414`) sections for rhythm.
- Cards: dark surface (`#161616`), 1px `#3F3F3F` border, 12–16px radius, no heavy shadows (shadows read poorly on black — use border + subtle inner highlight instead).
- Stats strip: large bold white numbers, gray label underneath.
- Pill badges: outlined by default; filled white/black text for active state.
- Code block (Skill Arena preview): near-black (`#0D0D0D`) with a lighter gray border, monospace, white/gray syntax tones.
- Footer: solid deep black, multi-column, light-gray text, white on hover.

## 6.7 UI Components

| Component | Style |
|---|---|
| Primary button | Rounded-full, white fill, black text |
| Secondary/ghost button | Rounded-full, transparent fill, white 1px border, white text |
| Search input | Rounded-full, white fill, dark placeholder, black circular submit button inset right |
| Filter pill | Rounded-full, transparent/dark fill, gray border, white text; active = white fill/black text |
| Card | Dark surface, 1px gray border, 12–16px radius |
| Icons | Line-style, white/gray monochrome — no color icons on marketing surface |

## 6.8 Layout, Motion & Accessibility

- Max content width ~1200–1280px, centered; 80–120px section padding desktop; 12-col grid; breakpoints ~768px/1024px.
- Scroll-triggered fade/slide-ins; sticky nav transparent-over-hero → solid black+blur on scroll.
- **Contrast note:** body text on black must meet WCAG AA — use `#F5F5F5`/`#E5E5E5` for body copy (not mid-gray); reserve `#A3A3A3` for genuinely secondary text only. Verify headline/subtext contrast at actual rendered sizes before launch.

## 6.9 Asset Inventory

- `hackerzone_logo.png` — white wordmark, transparent background — ✅ supplied, in use, do not re-request.
- Landing page visual reference — ✅ supplied, this section is derived from it.
- Favicon — ❌ still outstanding (TODO placeholder).
- OG image (1200x630) — ❌ still outstanding; should reuse the hero gradient treatment once designed so social shares match the live site.

---

# 7. SEO / Metadata (exact values)

```html
<title>Hackerzone: The Career Network for the Indian AI Economy</title>
<meta name="description" content="The largest expert network for learning, earning, and growing careers in the AI economy — giving everyone an accessible first step into an AI-powered career." />
<meta property="og:title" content="Hackerzone: The Career Network for the Indian AI Economy" />
<meta property="og:description" content="The largest expert network for learning, earning, and growing careers in the AI economy — giving everyone an accessible first step into an AI-powered career." />
<meta property="og:url" content="https://hackerzone.in" />
<meta property="og:site_name" content="Hackerzone" />
<meta property="og:type" content="website" />
<meta property="og:image" content="/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="https://hackerzone.in" />
<link rel="icon" href="/favicon.ico" />
```

Per-section title pattern (Next.js Metadata API, dynamic per route):
- Jobs: `AI Jobs & Internships in India | Hackerzone`
- Skill Arena: `Skill Arena — Prove Your AI Skills | Hackerzone`
- Company profile: `{Company} Careers on Hackerzone`
- Student profile: `{Name} — Verified AI Skills | Hackerzone`
- Campus page: `{College} on Hackerzone`

Add `Organization` + `JobPosting` JSON-LD structured data — `JobPosting` on every job page is required for Google for Jobs indexing.

---

# 8. Database Schema (all tables)

`profiles`, `skills`, `user_skills`, `challenges`, `submissions`, `campuses`, `campus_members`, `companies`, `company_members`, `jobs`, `applications`, `events`, `event_rsvps`, `messages`, `message_threads`, `mentors`, `mentor_bookings`, `resources`, `reports`, `audit_logs`, `subscriptions`.

**Rule:** RLS enabled + policy written in the **same migration** that creates each table — never after. See §11.2 for exact policy patterns. A table with RLS enabled but zero policies silently denies all access — fails safe, but breaks features loudly rather than leaking data, which is the correct failure mode if this rule is ever accidentally violated.

Migration files (in order):
```
0001_init_profiles.sql
0002_skills_and_challenges.sql
0003_campuses.sql
0004_companies_and_jobs.sql
0005_applications.sql
0006_events_and_rsvps.sql
0007_messaging.sql
0008_mentors.sql
0009_resources.sql
0010_trust_safety.sql       # reports, audit_logs
0011_subscriptions.sql
0012_rls_policies.sql
```
Plus `supabase/seed.sql` for skill taxonomy + demo data.

---

# 9. Full Directory Structure

```
hackerzone/
├── CLAUDE.md
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── supabase/
│   ├── migrations/            # 0001–0012, listed in §8
│   └── seed.sql
│
├── docs/
│   ├── HACKERZONE_COMPLETE.md # this file
│   └── phase-log.md           # updated after each phase ships
│
├── public/
│   ├── favicon.ico             # TODO: outstanding
│   ├── apple-touch-icon.png    # TODO: outstanding
│   ├── og-image.png            # TODO: outstanding
│   └── logo/
│       └── hackerzone-logo.png # ✅ supplied
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # homepage
│   ├── globals.css
│   │
│   ├── (marketing)/
│   │   ├── employers/
│   │   │   ├── page.tsx
│   │   │   └── pricing/page.tsx
│   │   ├── campuses/page.tsx
│   │   ├── about/page.tsx
│   │   └── legal/{privacy,terms}/page.tsx
│   │
│   ├── login/page.tsx
│   ├── onboarding/{student,recruiter,campus-admin}/page.tsx
│   │
│   ├── (student)/
│   │   ├── dashboard/page.tsx
│   │   ├── jobs/{page.tsx,[jobId]/page.tsx}
│   │   ├── applications/page.tsx
│   │   ├── arena/{page.tsx,[challengeId]/page.tsx,leaderboard/page.tsx}
│   │   ├── events/{page.tsx,[eventId]/page.tsx}
│   │   ├── mentors/{page.tsx,[mentorId]/book/page.tsx}
│   │   ├── messages/{page.tsx,[threadId]/page.tsx}
│   │   ├── learn/page.tsx
│   │   └── settings/{profile,privacy}/page.tsx
│   │
│   ├── u/[username]/page.tsx        # public verified skill profile
│   ├── companies/[slug]/page.tsx    # public company page
│   │
│   ├── (employer)/company/
│   │   ├── dashboard/page.tsx
│   │   ├── jobs/{page.tsx,new/page.tsx,[jobId]/{page.tsx,pipeline/page.tsx}}
│   │   ├── search/page.tsx
│   │   ├── events/{page.tsx,new/page.tsx}
│   │   ├── sponsorships/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── billing/page.tsx
│   │   └── team/page.tsx
│   │
│   ├── (campus-admin)/campus-admin/
│   │   ├── dashboard/page.tsx
│   │   ├── members/page.tsx
│   │   ├── events/page.tsx
│   │   ├── employers/page.tsx
│   │   └── challenges/page.tsx
│   │
│   ├── (admin)/admin/
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   ├── companies/page.tsx
│   │   ├── campuses/page.tsx
│   │   ├── challenges/page.tsx
│   │   ├── reports/page.tsx
│   │   └── audit-log/page.tsx
│   │
│   └── api/
│       ├── auth/callback/route.ts
│       ├── challenges/[id]/submit/route.ts
│       ├── jobs/[id]/apply/route.ts
│       ├── matching/recommend/route.ts
│       ├── messages/send/route.ts
│       ├── events/[id]/rsvp/route.ts
│       ├── mentors/[id]/book/route.ts
│       ├── billing/webhook/route.ts
│       └── reports/route.ts
│
├── components/
│   ├── ui/            # Button, Card, Badge, Avatar, Modal, Tabs, Toast, Tooltip, CodeBlock, StatItem
│   ├── layout/         # Navbar, Footer, DashboardShell
│   ├── marketing/      # Hero, StatsStrip, SkillCategoryGrid, TestimonialCarousel, FAQAccordion
│   ├── arena/           # ChallengeCard, CodeEditor, SubmissionRubricForm, Leaderboard
│   ├── profile/         # SkillBadge, ProofOfWorkTimeline, PrivacyToggle
│   ├── jobs/             # JobCard, JobFilterBar, ApplicationPipelineBoard
│   ├── events/           # EventCard, RSVPButton
│   ├── messaging/        # ThreadList, MessageBubble
│   └── admin/            # ReportQueueTable, AuditLogTable
│
├── lib/
│   ├── supabase/{client,server,middleware}.ts
│   ├── matching/scoreCandidate.ts
│   ├── grading/{autoGradeCode,rubricScore}.ts
│   ├── metadata.ts
│   └── constants/{skillTaxonomy,theme}.ts
│
├── types/database.types.ts
└── middleware.ts
```

---

# 10. Build Phases (feed to Claude Code one at a time, in order)

### Phase 1 — Scaffolding, Design System & `CLAUDE.md`
Generate the directory skeleton in §9. Write `CLAUDE.md` (§14). Tailwind theme + UI primitives per §6. Metadata module (`lib/metadata.ts`) per §7. Deploy placeholder to Vercel.

### Phase 2 — Supabase Schema
All 12 migration files per §8, in order, RLS + policy in the same file as each table. Seed skill taxonomy + demo data. Generate `types/database.types.ts`.

### Phase 3 — Auth & Role-Based Onboarding
Google Cloud OAuth client → Supabase Auth. `middleware.ts` protecting route groups by role. Three onboarding flows. Privacy settings page implementing the anonymous/public toggle as a first-class setting (§4.4, §11.3).

### Phase 4 — Marketing Site
Homepage using the exact hero pattern in §6.5 (gradient + headline + search-bar CTA + filter pills — not a two-button hero). Employer pricing page replicating the Basic/Pro/Enterprise tiers (§4.2), India-priced. Campus page.

### Phase 5 — Skill Arena
Challenge listing, code editor + sandboxed auto-grading (§11.4, §13.5), rubric-scored non-code challenges, leaderboards, badge tiers, sponsor branding.

### Phase 6 — Verified Skill Profile
Public `/u/[username]` page, dynamic OG image generation, endorsement mechanism, public/anonymous visibility respected.

### Phase 7 — Job Board & Applications
Student job search/filter (by minimum verified skill score, not keyword), employer kanban pipeline, `api/jobs/[id]/apply`.

### Phase 8 — Campus Layer
Campus admin console: roster approval, employer-access approval (schools can restrict which employers reach their students — replicate exactly), campus events, campus challenges.

### Phase 9 — Employer Platform & Tiered Plans
Company dashboard, talent search, multi-user team management (Pro+), billing. Enforce message-volume limits per plan (10/mo Basic, 200/mo Pro, custom Enterprise) at the API layer. Promoted-jobs add-on logic.

### Phase 10 — Messaging, Events & Mentor Booking
Realtime messaging scoped per-thread. Events + RSVP. Mentor booking (slot-based).

### Phase 11 — AI Matching Engine
`lib/matching/scoreCandidate.ts` — rule-based v1 (skill overlap + score proximity + location + campus + availability). `api/matching/recommend` powering both sides' recommendation feeds. Notification triggers on high-score matches.

### Phase 12 — Monetization
Stripe/Razorpay integration, webhook signature verification, subscription tiers gating features per §4.2/§10 Phase 9, sponsored-challenge payment flow, premium certification badge purchase flow.

### Phase 13 — Admin, Trust & Safety, Analytics, Learning Hub
Full admin console including moderation queue (`reports`) and `audit-log`. Campus admin analytics mirroring §4.3's metrics (engagement, applications, appointments, placement outcomes). Platform-wide analytics. Learning Hub resource library.

### Phase 14 — Polish & Launch
Insert favicon/OG image into `public/` TODO slots (logo already done — do not touch). Full responsive + accessibility QA. `JobPosting` JSON-LD validated on every job page. Sitemap/robots.txt, Lighthouse ≥90, Sentry, custom domain `hackerzone.in` on Vercel. Final RLS security review.

Each phase's deliverable must be confirmed working before the next begins. **Phases 2 and 3 are load-bearing** — every later phase depends on schema + auth being correct.

---

# 11. Security

## 11.1 Authentication & Session Security
- **Google OAuth only** at launch (no password storage = no password-breach surface). OAuth client configured in Google Cloud Console with exact authorized redirect URIs — no wildcard domains.
- Supabase Auth issues short-lived JWT access tokens + rotating refresh tokens. Use `@supabase/ssr` so tokens live in **HttpOnly, Secure, SameSite=Lax cookies** — never in `localStorage` (XSS-readable).
- Session validation happens server-side in `middleware.ts` on every protected route — never trust a client-side "is logged in" flag alone.
- Enforce session expiry + silent refresh; force re-auth for sensitive actions (billing changes, account deletion, company verification changes).
- Rate-limit login attempts and OAuth callback endpoint at the edge.

## 11.2 Authorization Model (Role-Based + Row-Level)
Four roles: `student`, `recruiter`, `campus_admin`, `admin`. Two layers, both required:

1. **Route-level (`middleware.ts`):** blocks navigation into role-scoped route groups before any page renders.
2. **Row-level (Postgres RLS):** the real security boundary. Every table has RLS enabled from the migration that creates it — never added later.

```sql
-- Users can only read/write their own row
create policy "own_profile" on profiles
  for all using (auth.uid() = id);

-- Public read on published-only content
create policy "public_read_published_jobs" on jobs
  for select using (status = 'published');

-- Recruiters can only manage their own company's data
create policy "company_scoped_jobs" on jobs
  for all using (
    company_id in (
      select company_id from company_members where user_id = auth.uid()
    )
  );
```

- **Never** use the Supabase `service_role` key in any client-exposed code path — server-only environment variables and server-only API routes only.

## 11.3 Data Classification & Handling

| Data type | Sensitivity | Handling |
|---|---|---|
| Resume/transcript files | High | Private Storage bucket, signed URLs, short expiry |
| Company verification docs (GST etc.) | High | Private bucket, admin-only read, deleted post-decision + retention window |
| Skill submissions (code) | Medium | Sandboxed execution only — never `eval` server-side outside the sandbox |
| Messages | Medium | RLS scoped to thread participants only |
| Public profile data | Low | Explicit opt-in (public/anonymous toggle) before any field is queryable |
| Payment data | Critical | Never touches Hackerzone's DB — Stripe/Razorpay only; store plan status + external customer ID only |

Anonymous students must be structurally unsearchable — enforce via RLS predicate on `profiles.visibility`, not just a UI filter. GPA/score visibility is a separate, more granular toggle.

## 11.4 Sandboxed Code Execution (Skill Arena)
Highest-risk surface — untrusted user code runs on your infrastructure.
- Never execute submitted code in the Next.js server process or in any container with internal network access.
- Isolated, ephemeral sandbox per submission (gVisor/Firecracker-backed container or managed code-execution API): no outbound network, CPU/memory/time limits (hard-killed on timeout), no filesystem access outside a throwaway scratch dir, no access to env vars/secrets/host filesystem.
- Treat every submission as hostile: fork bombs, infinite loops, filesystem escape, secret exfiltration attempts.
- Rate-limit submissions per user to prevent sandbox resource exhaustion.

## 11.5 Input Validation & Injection Prevention
- All API routes validate input with a schema library (Zod) server-side.
- Parameterized queries only — never string-concatenated SQL, even for admin tooling.
- Sanitize/escape user-generated HTML (bios, job descriptions, messages) via a strict allowlist renderer — never `dangerouslySetInnerHTML` on raw input.
- File uploads: validate MIME type + extension + size server-side, plus magic-number byte validation.

## 11.6 API & Rate Limiting
- Rate-limit: login/OAuth callback, messaging send, job applications, challenge submissions, search endpoints (anti-scraping).
- Webhooks verify signatures before processing; reject unsigned/malformed payloads.
- CORS locked to `hackerzone.in` and known subdomains — no wildcard origins.

## 11.7 Secrets Management
- All secrets in Vercel environment variables, scoped per environment — never committed to the repo.
- Rotate service role key and OAuth client secret on suspected exposure and on a routine schedule (e.g. every 90 days) once live.

## 11.8 Trust & Safety
- `reports` table + moderation queue live from Phase 1, not bolted on later.
- Company verification mandatory before a job posting goes live — no auto-publish for unverified companies.
- `audit_logs` — append-only, records every admin action (ban, content removal, verification override).
- Monitor: mass-messaging from new recruiter accounts, skill-score gaming (duplicate submissions, plagiarism detection), fake campus affiliation claims.

## 11.9 Dependency & Infrastructure Security
- Automated dependency scanning in CI, block merges on high/critical vulnerabilities.
- Pin dependency versions; review changelogs on major version bumps of Supabase/Next.js/auth libs.
- Vercel Deployment Protection on Preview so unfinished features aren't publicly crawlable.
- Postgres backups + point-in-time recovery enabled before launch.

## 11.10 Pre-Launch Security Checklist
- [ ] RLS enabled + policy-tested on every table (attempt cross-user reads/writes manually)
- [ ] `service_role` key never present in any client bundle (grep build output)
- [ ] All file uploads validated server-side (type, size, magic bytes)
- [ ] Code sandbox network-isolated, resource-limited, load-tested against abuse
- [ ] Webhook signature verification confirmed
- [ ] Rate limiting active on auth, messaging, applications, search
- [ ] Anonymous-profile RLS predicate verified unbypassable via direct API calls
- [ ] Secrets scanned out of git history before first public commit
- [ ] Admin actions all write to `audit_logs`
- [ ] Dependency scan clean of high/critical CVEs

---

# 12. Deployment

## 12.1 Environments

| Environment | Purpose | Branch | Supabase project |
|---|---|---|---|
| Development | Local dev | any feature branch | Local (CLI) or shared dev project |
| Preview | PR review, QA | every non-`main` PR | Shared staging project |
| Production | Live at hackerzone.in | `main` | Production project (isolated, separate keys) |

Never point Preview at the Production Supabase project. Enable Vercel Deployment Protection on Preview.

## 12.2 Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=         # server-only
STRIPE_SECRET_KEY=                  # or RAZORPAY_KEY_SECRET
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=               # https://hackerzone.in in prod
SENTRY_DSN=
```

Audit the `NEXT_PUBLIC_` prefix list before every deploy — anything so prefixed ships to the browser.

## 12.3 Supabase Setup
1. Separate projects for staging and production — full isolation, no shared "test" schema.
2. Migrations applied via Supabase CLI (`supabase db push`) as part of CI — never manually via dashboard.
3. Enable Point-in-Time Recovery on production before launch.
4. Configure Auth → URL Configuration with exact redirect URLs, no wildcards.
5. Storage buckets: `resumes` (private), `verification-docs` (private), `avatars` (public, size-limited), `company-logos` (public), matching the RLS model in §11.

## 12.4 Google Cloud OAuth Setup
1. OAuth 2.0 Client ID (Web application) in Google Cloud Console.
2. Authorized JS origins: `https://hackerzone.in`, staging URL, `http://localhost:3000` (dev).
3. Authorized redirect URI: Supabase Auth callback URL.
4. Verify the OAuth consent screen for production domain early — review has lead time, don't leave it for launch week.

## 12.5 Vercel Configuration
- Framework preset: Next.js (auto-detected). Build: `next build`.
- Node.js version pinned in `package.json` engines field.
- Custom domain `hackerzone.in`: DNS per Vercel's instructions, automatic HTTPS.
- Enable Vercel Analytics + Speed Insights.

## 12.6 CI/CD Pipeline
1. **On PR:** install/typecheck/lint/test, `npm audit` (block high/critical), Supabase migration dry-run against staging, Vercel auto-builds Preview.
2. **On merge to `main`:** full test suite, apply pending migrations to production, Vercel promotes Production, post-deploy smoke test (`/`, `/login`, `/api/health`).
3. **Rollback:** Vercel retains prior deployments for instant rollback. Write migrations backward-compatible for at least one release.

## 12.7 Database Migration Discipline
- New numbered file per schema change — never edit a shipped migration.
- Additive-first (`ADD COLUMN` nullable/defaulted) over same-release rename/drop.
- Staging first, verify, then promote the same file to production.

## 12.8 Monitoring & Alerting
- Sentry on client + server (API routes, middleware), alert on new error types/spikes.
- External uptime pinger on `/` and `/api/health`.
- Supabase dashboard: connection pool, slow queries, storage growth — review monthly pre-launch, weekly post-launch.
- Vercel dashboard: build failures, function errors, bandwidth vs. plan limits.

## 12.9 Launch-Day Checklist
- [ ] Production Supabase fully migrated and seeded
- [ ] Google OAuth consent screen verified (no "unverified app" warning)
- [ ] Custom domain live with HTTPS
- [ ] Production env vars correct (not copied from Preview)
- [ ] Sitemap.xml / robots.txt reachable and correct
- [ ] Error tracking + uptime monitoring confirmed receiving events
- [ ] Payment provider live keys confirmed, webhook reachable
- [ ] Backup/PITR active on production
- [ ] Rollback procedure tested at least once in staging

---

# 13. Performance

Target: Lighthouse ≥90 across Performance/Accessibility/Best Practices/SEO before launch; sub-200ms API p95 for core read paths at moderate scale.

## 13.1 Rendering Strategy

| Route type | Strategy | Why |
|---|---|---|
| Marketing pages | SSG + ISR | Rarely changes, fastest for SEO/first visit |
| Public job listings, company pages | ISR, short revalidate (~60s) | Crawlable (JobPosting schema) but changes often |
| Public profile pages | ISR, on-demand revalidation on update | Shareable, fast, indexable |
| Dashboard, arena, messages, applications | Dynamic, per-request, behind auth | Personalized, not cacheable/indexable |
| Admin/campus-admin consoles | Dynamic, low-traffic | Internal tooling, small user count |

Default to the least dynamic strategy that's correct for the data. Use `generateStaticParams` for predictable high-traffic public routes.

## 13.2 Data Fetching & Database Performance
- Fetch in Server Components directly — avoid client-side waterfalls.
- Index every column used in hot-path `WHERE`/`JOIN`/`ORDER BY`: `jobs.status`, `jobs.company_id`, `applications.user_id`, `applications.job_id`, `user_skills.user_id`, `submissions.user_id`, `messages.thread_id`. Composite indexes for common filter combos (e.g. `jobs(status, type, location)`).
- Postgres full-text search (`tsvector`/GIN index) over `ILIKE` scans once data volume grows.
- Paginate everything — cursor-based for infinite-scroll feeds, offset fine for small bounded admin lists.
- Avoid N+1 — batch-fetch related data via join or `in()`.

## 13.3 Caching Layers
- CDN/edge caching via Vercel for static assets + ISR pages, `revalidate` set per route type.
- `revalidatePath`/`revalidateTag` on publish/verify/update events, not just timer-based.
- Never cache personalized data (recommendations, applications) in a shared layer.
- Consider a light cache for AI Matching Engine scoring inputs (skill taxonomy, campus tiers) if computation becomes a bottleneck.

## 13.4 Images & Static Assets
- All images via `next/image`. Logos/avatars: max upload size + resize on upload.
- Favicon/OG image: correctly sized (favicon multi-size .ico, OG 1200x630) — oversized sources hurt every social-share load. Logo already supplied — verify it's served optimized, not the raw upload.
- Keep the gradient hero background as CSS `radial-gradient`, not a rasterized image — lighter and crisper at any viewport.
- Fonts via `next/font` (self-hosted Inter) — avoids render-blocking external font requests and FOUT/FOIT shift.

## 13.5 Code Execution Sandbox Performance
- Skill Arena code execution is the heaviest compute path — fully decoupled from the request/response cycle (queue-based: submit → job queued → sandbox executes async → result polled or pushed via Realtime).
- Hard timeouts (a few seconds) per submission, clear "execution timed out" result rather than hanging.
- Pool/reuse sandbox environments where supported to avoid cold-start latency.

## 13.6 Bundle Size & Client-Side Performance
- Skill Arena code editor (Monaco/CodeMirror): dynamically imported (`next/dynamic`, `ssr: false`) — not in the main bundle.
- Same for analytics charting libraries (admin/campus-admin only).
- Default to Server Components; `"use client"` only where genuinely interactive (forms, editors, realtime lists).
- Watch route-level JS chunk size over time via `next build` output, not just at launch.

## 13.7 Realtime & Messaging Performance
- Supabase Realtime subscriptions scoped per-thread, never a global firehose.
- Unsubscribe on unmount/navigation.
- Debounce typing indicators/presence if added later.

## 13.8 Third-Party Scripts
- Load via `next/script` with correct `strategy` (`afterInteractive` most, `lazyOnload` for non-critical). Never a blocking synchronous `<script>` in `<head>`.
- Audit script count periodically — each is both a perf and security surface.

## 13.9 Monitoring in Production
- Vercel Speed Insights tracking Core Web Vitals (LCP, INP, CLS), segmented by route type.
- Supabase slow-query log, investigate anything consistently >200ms.
- Track sandbox execution queue depth/latency as a first-class metric — most likely path to degrade under a viral hackathon/sponsored-challenge spike, invisible to generic web-vitals tooling.

## 13.10 Pre-Launch Performance Checklist
- [ ] Lighthouse ≥90 on homepage, job board, sample public profile (mobile + desktop)
- [ ] All list/search endpoints paginated, no unbounded queries
- [ ] Indexes confirmed on every hot-path filter/join/order column
- [ ] Code editor and analytics charts dynamically imported
- [ ] ISR revalidation set per route type; on-demand revalidation wired to publish/verify/update events
- [ ] Code sandbox fully decoupled from request/response cycle, timeout-enforced
- [ ] Images via `next/image`, logos/avatars resized on upload
- [ ] Core Web Vitals monitoring live and confirmed before go-live

---

# 14. Claude Code Project Guide (`CLAUDE.md` content)

Paste this as the literal `CLAUDE.md` file at the repo root — Claude Code reads it automatically at session start.

```markdown
# Hackerzone — Claude Code Project Guide

## What this is
Hackerzone: the career network for the Indian AI economy. Combines HackerRank-style
verified skill assessment, Handshake-style campus career network, and Mercor-style
algorithmic matching. Full spec: docs/HACKERZONE_COMPLETE.md.

## Stack
Next.js (App Router, TS) · Tailwind · Supabase (Postgres+RLS+Realtime+Storage) ·
Google OAuth · Vercel · Stripe/Razorpay

## Theme: Black & White (current — retired: any earlier navy/blue tokens)
bg: #0A0A0A | gradient: #1A1A1A → #4A4A4A → #0A0A0A | white: #FFFFFF |
body text: #F5F5F5 | secondary text: #A3A3A3 | border: #3F3F3F
Display font: Anton/Archivo Black, italic-slanted, all-caps, condensed | UI font: Inter
Full spec + hero pattern + component styles: docs/HACKERZONE_COMPLETE.md §6

## Assets already supplied
- Logo: public/logo/hackerzone-logo.png (white wordmark, transparent bg) —
  DO NOT re-request or regenerate this
- Still outstanding: favicon.ico, apple-touch-icon.png, og-image.png —
  leave marked TODO placeholders

## Read before starting any phase
docs/HACKERZONE_COMPLETE.md — the entire spec (architecture, workflows, design
system, schema, directory structure, phases, security, deployment, performance)

## Conventions
- Route groups: (marketing), (student), (employer), (campus-admin), (admin)
- All DB access through lib/supabase/{client,server}.ts — never raw fetch to Supabase REST
- Every table gets RLS + policies in the SAME migration that creates it
- service_role key is server-only, never in client-exposed code — grep build output to confirm
- Metadata for every page via lib/metadata.ts buildMetadata() helper
- Untrusted code (Skill Arena submissions) only runs in the isolated sandbox
  described in §11.4 — never inline in the app server
- Marketing homepage hero = gradient background + bold italic headline +
  search-bar-as-CTA + filter pills, per §6.5 — not a two-button hero
- Update docs/phase-log.md after completing each phase

## Do not
- Do not build features outside the current phase — flag if something seems
  missing, don't silently add it
- Do not skip RLS policies "for now"
- Do not hardcode design tokens — reference tailwind.config.ts theme extensions
- Do not introduce color accents into the marketing surface — strict grayscale
- Do not fabricate favicon/OG image assets — leave marked placeholder slots
  (logo is already done, don't touch it)
- Do not write destructive migrations without a backward-compatible path
```

---

# 15. Non-Negotiables (apply across every phase)

- RLS on every table, written alongside the table, never retrofitted
- `service_role` key never in client-exposed code
- Untrusted code submissions only ever execute in a network-isolated, resource-limited sandbox, decoupled from the main request/response cycle
- Every admin action logged to `audit_logs`
- **Black & white theme only** — no color accents introduced into the marketing surface without explicit instruction
- Favicon/OG image remain placeholder slots until supplied (logo is done — do not re-request it)
- No destructive migrations without a backward-compatible rollback path
- Every new page gets metadata via the shared `buildMetadata()` helper — no hand-rolled `<head>` tags
- Two-layer authorization (route middleware + RLS) is mandatory on every protected surface — neither layer alone is sufficient
- Each build phase's deliverable is confirmed working before the next phase begins; Phases 2 (schema) and 3 (auth) are load-bearing for everything after

---

## How to Use This Document

1. Place this file at `docs/HACKERZONE_COMPLETE.md` in the repo.
2. Paste §14's fenced block as the literal `CLAUDE.md` at the repo root — Claude Code reads it automatically.
3. Feed Claude Code the phases in §10, **one at a time, in order**, referencing §9's directory tree for exact file placement and §§11–13 for the security/deployment/performance requirements that apply to that phase's work.
4. Keep §§3–5 (architecture + Handshake workflow research) as the UX reference whenever a phase touches a product decision (privacy toggles, pricing tiers, messaging limits, dashboard metrics) — replicate the researched behavior unless §5's table calls out a specific Hackerzone deviation.
