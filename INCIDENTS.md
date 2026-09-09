# Hackerzone — Incident Response, SRE & Disaster Recovery Guide

> **SRE Protocol & Business Continuity Runbook**  
> **Platform:** Hackerzone (`hackerzone.in`)

---

## 1. Incident Severity Definitions (§103)

| Severity | Definition | Target Response (SLA) | Examples |
| :--- | :--- | :--- | :--- |
| **P0 — Critical** | Platform-wide outage, active security vulnerability, data corruption, or payment failure. | **Immediate (< 15 mins)** | Production site down (500s across routes), RLS bypass detected, database unreachable. |
| **P1 — High** | Major core functionality degraded with no immediate workaround. | **< 1 hour** | User login failing, task submission broken, expert onboarding blocked. |
| **P2 — Medium** | Important feature degraded, but viable workaround exists. | **< 4 hours** | Notification delivery delay, search filtering sluggish, export CSV timing out. |
| **P3 — Low** | Minor cosmetic defect or edge-case bug. | **Next business cycle** | Minor typography misalignment, non-critical copy typo. |

---

## 2. Disaster Recovery Targets & Objectives (§63)

- **Recovery Time Objective (RTO):** `< 30 minutes` for P0 platform restoration.
- **Recovery Point Objective (RPO):** `< 5 minutes` for transactional data loss (guaranteed via Supabase continuous WAL archiving and daily automated snapshots).

---

## 3. Incident Response Playbooks

### Playbook A: Production Deployment Failure / Regressions (§64, §102)
When a newly deployed build introduces critical errors:
1. **Never "fix forward" blindly** on live production during a P0/P1 incident.
2. Navigate to **Vercel Dashboard -> Project -> Deployments**.
3. Select the most recent **Stable Deployment** prior to the incident.
4. Click **Instant Rollback**. Vercel redirects edge routing within seconds.
5. Probe `https://hackerzone.in/api/health` to verify system stabilization.
6. Check database integrity. If a migration broke backwards compatibility, roll back the migration using the corresponding down script.

### Playbook B: Database Connection Exhaustion / Cold Spikes (§18)
If `/api/health` reports `database: "warn"` or logs show connection timeouts:
1. Check Supabase Dashboard -> **Database Settings -> Connection Pooling**.
2. Verify connections are routing through port `6543` (PgBouncer transaction pooler mode) rather than direct port `5432`.
3. Terminate runaway zombie queries via Supabase SQL Editor:
   ```sql
   SELECT pg_terminate_backend(pid) 
   FROM pg_stat_activity 
   WHERE state = 'idle in transaction' 
     AND state_change < current_timestamp - INTERVAL '5 minutes';
   ```

### Playbook C: Diagnosing User-Reported Faults via Request ID (§12, §69)
When a user encounters a fault, the error screen provides a reference ID (e.g. `HZ-REQ-89AF12`):
1. Copy the reference ID provided by the user.
2. In your observability dashboard (Vercel Logs / Sentry / Datadog):
   - Filter query: `json.requestId: "HZ-REQ-89AF12"`
3. Inspect the exact stack trace, route, user context, and status code without having to ask the user to reproduce or expose private data.

---

## 4. Post-Incident Review (PIR) Template

Following any P0 or P1 incident, an engineering post-mortem must be published within 48 hours:

```markdown
# Incident Post-Mortem: [Date] — [Brief Title]

## Summary
- **Severity:** P0 / P1
- **Duration:** XX minutes
- **Impacted Users:** XX%
- **Lead SRE / Responder:** [Name]

## Timeline (UTC)
- `HH:MM` - Anomaly detected via `/api/health` or Sentry alert.
- `HH:MM` - Triage initiated; severity classified as P0.
- `HH:MM` - Rollback initiated in Vercel.
- `HH:MM` - Traffic restored; health check verified green.

## Root Cause
Detailed technical description of what failed and why defensive mechanisms did not prevent it.

## Corrective Actions & Preventative Tasks
- [ ] Add integration test in `tests/critical-loops.spec.ts` covering failure case.
- [ ] Update rate limiter or input validation schema.
- [ ] Document newly discovered edge case in runbooks.
```
