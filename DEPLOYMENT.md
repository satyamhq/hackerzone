# Hackerzone — Production Deployment Guide

> **Platform:** Hackerzone (`hackerzone.in`)  
> **Tagline:** The human intelligence network powering the AI economy.  
> **Target Cloud:** Vercel (Edge & Serverless Node.js 20+) + Supabase (PostgreSQL 15+, Auth, Storage)

---

## 1. Prerequisites & System Requirements

- **Runtime:** Node.js `>= 20.x` (LTS) or `24.x`
- **Package Manager:** npm `>= 10.x`
- **Cloud Infrastructure:**
  - Vercel Enterprise or Pro account with custom domain routing
  - Supabase Cloud Project (Production tier recommended with connection pooling enabled)
  - Domain registrar with DNS management access (`hackerzone.in`)

---

## 2. Environment Variables Matrix

Before deploying to Vercel, configure these variables in **Project Settings -> Environment Variables**:

| Variable Name | Environments | Purpose / Secret Handling |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Prod, Preview, Dev | Public canonical base URL (`https://hackerzone.in`) |
| `NEXT_PUBLIC_APP_URL` | Prod, Preview, Dev | Application routing origin (`https://hackerzone.in`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Prod, Preview, Dev | Supabase project API gateway endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Prod, Preview, Dev | Public anonymous JWT for browser client-side auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Production Only | **CRITICAL SECRET**: Backend administrative access |
| `DATABASE_URL` | Production Only | **SECRET**: Connection pooler URI for migrations |
| `SENTRY_DSN` | Prod, Preview | Error monitoring ingest DSN |
| `NEXT_PUBLIC_ANALYTICS_ID` | Production Only | Product event measurement identifier |

> **Warning:** Never add `SUPABASE_SERVICE_ROLE_KEY` or `DATABASE_URL` to client-side code or prefix them with `NEXT_PUBLIC_`.

---

## 3. Local Development & Verification Workflow

```bash
# 1. Clone repository
git clone https://github.com/satyamhq/hackerzone.git
cd hackerzone

# 2. Install dependencies
npm install

# 3. Setup local environment
cp .env.example .env.local
# Edit .env.local with your development Supabase credentials

# 4. Typecheck and Lint
npm run lint
npx tsc --noEmit

# 5. Execute Integration Tests
npm test

# 6. Local Production Build Test
npm run build

# 7. Start Local Server
npm start
```

---

## 4. Vercel Project Setup & Configuration

### Build & Output Settings
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Development Command:** `npm run dev`
- **Install Command:** `npm install`
- **Root Directory:** `./`

### Security Headers (`vercel.json`)
The deployment includes strict HTTP response headers configured in both `vercel.json` and `next.config.mjs`:
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options`: `nosniff`
- `X-Frame-Options`: `DENY`
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Permissions-Policy`: `camera=(), microphone=(), geolocation=(), browsing-topics=()`
- `X-DNS-Prefetch-Control`: `on`

---

## 5. DNS & Custom Domain Configuration (`hackerzone.in`)

Configure the following DNS records with your registrar or DNS provider (e.g., Cloudflare / Route53):

| Type | Host / Name | Value / Destination | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` (Vercel Anycast IP) | 300 / Auto |
| **CNAME** | `www` | `cname.vercel-dns.com.` | 300 / Auto |
| **CNAME** | `preview` | `cname.vercel-dns.com.` | 300 / Auto |

### Email Authentication Records (Resend / AWS SES / Postmark)
| Type | Host / Name | Value |
| :--- | :--- | :--- |
| **TXT** | `@` | `v=spf1 include:sendgrid.net include:mailgun.org ~all` |
| **TXT** | `_dmarc` | `v=DMARC1; p=reject; rua=mailto:dmarc-reports@hackerzone.in` |
| **CNAME** | `s1._domainkey` | `s1.domainkey.hackerzone.in.dkim.provider.com` |

---

## 6. Production Launch Sequence (§101)

1. **Database Snapshot:** Create a full manual backup in Supabase Dashboard before migrating.
2. **Apply Migrations:** Run `supabase db push` against the production database.
3. **Trigger Vercel Production Deployment:** Push tagged release to `main` branch.
4. **Automated Build Execution:** Vercel executes linting, typechecking, and asset generation.
5. **Health Check Verification:** Probe `https://hackerzone.in/api/health` and verify HTTP 200 with all checks passing (`status: "healthy"`).
6. **Execute Automated Smoke Tests:**
   - Homepage loads cleanly (`/`)
   - Human Intelligence Directory loads (`/experts`)
   - Projects view loads (`/projects`)
   - Authentication gates function (`/login`, `/signup`)
   - Error handling surfaces (`/not-found`, `/404`)
7. **Verify Monitoring & Logs:** Confirm request IDs (`HZ-REQ-xxxxxxxx`) are being generated and logged to observability streams.

---

## 7. Emergency Rollback Sequence (§102)

If a critical incident (P0/P1) occurs post-launch:

```text
Detect Fault (Sentry / Alert)
      ↓
Assess Impact & Root Cause
      ↓
Instant Rollback in Vercel Dashboard -> Deployments -> [Previous Stable Deployment] -> Instant Rollback
      ↓
Verify Health Check (GET /api/health)
      ↓
Inspect Database Integrity & Rollback Data Mutations If Required
      ↓
File Incident Report (INCIDENTS.md)
```

> **Rule:** Never attempt an unverified "fix-forward" commit directly to production during an active P0 incident. Rollback first, reproduce locally, test thoroughly, and redeploy.
