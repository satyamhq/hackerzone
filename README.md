# Hackerzone — Job Marketplace for India's AI Economy

A modern, full-stack three-sided career marketplace connecting **Students**, **Employers**, and **Educational Institutions** across India.

**Stack:** Next.js 14 (App Router, TypeScript) · Supabase (Postgres, Auth, Storage, Realtime) · Tailwind CSS · Vercel

---

## 🚀 Key Features

- **Three-Sided Role Architecture**:
  - **Student Candidates**: Skill-overlap job matching engine, private PDF resume storage with signed URLs, application tracking, and fellowship courses.
  - **Employers & Recruiters**: Company team management, Zod-validated job posting, applicant pipeline review with real-time status transitions, student notifications, and plan-based message quota enforcement.
  - **Institutions & Career Centers**: Domain-matched placement statistics, real aggregate outcome metrics, campus event scheduling, opt-in student rosters, and server-side CSV report exports.
  - **Platform Operations Admin**: Real-time analytics, institution & company verification queues, job moderation, and soft-delete user account deactivation.
- **Postgres Full-Text Search (FTS)**: GIN-indexed keyword search across job titles, descriptions, and required skills.
- **Supabase Realtime**: WebSocket-powered live in-app messaging and navigation bar notification bell.
- **Row Level Security (RLS)**: 100% database table security coverage with strict cross-role isolation.

---

## 🛠️ Project Setup & Installation

### 1. Prerequisites
- Node.js 18+ (Node v24 recommended)
- Supabase Project URL & API Keys

### 2. Install Dependencies
```bash
git clone https://github.com/satyamhq/hackerzone.git
cd hackerzone
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key # Server-only, never exposed to client
```

### 4. Database Migrations & Local Seed
Run the version-controlled SQL migrations in sequence under `supabase/migrations/`:
1. `0001_init_schema.sql` (Creates enums, 17 tables, indexes, and `handle_new_user` signup trigger)
2. `0002_rls_policies.sql` (Enables RLS across all 17 tables and defines security policies)
3. `0003_add_student_is_public.sql` (Adds `is_public` profile searchability flag)
4. `0004_fulltext_search_and_saved_searches.sql` (Adds GIN-indexed `fts tsvector` column & `saved_searches` table)
5. `0005_admin_moderation_and_reports.sql` (Adds `job_reports` table and `deactivated_at` column)

To seed initial development data (local dev only):
```bash
npx supabase db reset # or execute supabase/seed.sql in Supabase SQL Editor
```

---

## 🏃 Running locally

```bash
# Start Next.js Development Server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build

```bash
# Verify TypeScript & Next.js production compilation
npm run build
```

---

## 🔐 Security & Service Role Key Audit

- `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-only environments (`.env.local` and Deno Edge Function `supabase/functions/job-alerts/index.ts`).
- Zero client components (`"use client"`) or browser bundles import or expose the service role key.