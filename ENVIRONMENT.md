# Hackerzone — Environment Variable Specification & Management

> **Operational Standard:** Environment Variable Hierarchy & Secret Isolation  
> **Platform:** Hackerzone (`hackerzone.in`)

---

## 1. Environment Philosophy & Rules

1. **Principle of Least Privilege:** Client-side bundles must never contain database credentials, service role keys, webhook signing secrets, or private API keys.
2. **Explicit Public Prefix:** Only variables prefixed with `NEXT_PUBLIC_` are bundled into client JavaScript. Any variable without this prefix is strictly accessible only on the server.
3. **No Commits:** `.env`, `.env.local`, `.env.production`, and `.env.development` are strictly ignored by Git in `.gitignore`.
4. **Startup Validation:** The application uses `lib/env.ts` with `zod` to validate all required variables before initialization, preventing silent runtime failures.

---

## 2. Environment Variables Catalog

### A. Client-Side Exposed Variables (`NEXT_PUBLIC_*`)
These variables are baked into browser-facing bundles at build time.

| Variable | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://hackerzone.in` | Canonical base URL for SEO, sitemaps, OpenGraph, and OAuth callbacks. |
| `NEXT_PUBLIC_APP_URL` | **Yes** | `https://hackerzone.in` | Base URL used for dynamic internal routing and absolute navigation. |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | `https://xyzcompany.supabase.co` | Supabase API gateway endpoint for authentication and PostgREST. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | `eyJhbGciOi...` | Public anonymous JWT with client-level RLS restrictions. |
| `NEXT_PUBLIC_ANALYTICS_ID` | No | `hz-analytics-prod` | Event tracking identifier for privacy-preserving analytics. |

### B. Server-Only Secrets (Never Public)
These variables are strictly accessible in Route Handlers, Server Actions, and Server Components.

| Variable | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `SUPABASE_SERVICE_ROLE_KEY` | **Prod** | `eyJhbGciOi...` | Elevated administrative privileges for system tasks and webhooks. |
| `DATABASE_URL` | Optional | `postgresql://postgres:...@...:5432/postgres` | Direct connection pooler string for automated schema migrations. |
| `SENTRY_DSN` | Optional | `https://...` | Ingest endpoint for production exception monitoring. |

---

## 3. Environment Separation Matrix (§6)

Hackerzone supports four distinct operating environments:

```text
┌─────────────────┬───────────────────────────────┬───────────────────────────────┐
│ Environment     │ File Source                   │ Cloud Target                  │
├─────────────────┼───────────────────────────────┼───────────────────────────────┤
│ Local Dev       │ .env.local                    │ Localhost:3000                │
│ Development     │ .env.development              │ Dev Branch / Local Emulators  │
│ Preview         │ Vercel Environment Variables  │ Pull Request Preview URLs     │
│ Production      │ Vercel Environment Variables  │ https://hackerzone.in         │
└─────────────────┴───────────────────────────────┴───────────────────────────────┘
```

---

## 4. Environment Validation (`lib/env.ts`) (§7)

Environment validation is executed programmatically:

```typescript
import { validateEnv } from "@/lib/env";

const { valid, errors } = validateEnv();
if (!valid) {
  // Logs descriptive variable name error without leaking confidential values
  console.error("Configuration error detected", errors);
}
```

If a required variable is missing in production:
- The health check endpoint (`/api/health`) reports degraded status (`"environment": "warn"`).
- The server logs the specific missing variable name (e.g. `Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL`).
- **Under no circumstances does the system log or expose the value of existing secrets.**

---

## 5. Setting Up a New Developer Workspace

```bash
# 1. Clone template
cp .env.example .env.local

# 2. Fill in local Supabase credentials from your development project
# 3. Verify configuration with:
npm test
npm run build
```
