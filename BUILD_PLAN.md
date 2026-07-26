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
