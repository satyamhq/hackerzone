# Hackerzone — Production Security Architecture & Compliance

> **Confidential & Operational Security Policy**  
> **Target:** Hackerzone Production (`hackerzone.in`)

---

## 1. Threat Model & Security Posture

Hackerzone operates as a two-sided human intelligence network connecting verified technical experts with enterprise AI teams. Our security architecture is built on the principle of **Zero Trust** with strict multi-tenant isolation, defense-in-depth HTTP headers, and server-side authorization gates.

---

## 2. Authentication & Session Security (§20)

- **Authentication Provider:** Supabase Auth (backed by PostgreSQL row-level security and cryptographically signed JWTs).
- **Session Transmission:** Sessions are stored in HTTP-only, `Secure`, `SameSite=Lax` cookies managed via `@supabase/ssr`.
- **Password Security:** Passwords hashed with bcrypt (cost factor 10+), never logged or stored in plaintext.
- **Account Enumeration Prevention (§92):** Password reset and signup endpoints return constant-time generic responses:
  > *"If an account exists with this email, verification instructions have been dispatched."*
- **Session Revocation:** Logout invalidates both server cookies and active Supabase auth sessions.

---

## 3. Authorization Hierarchy (§21, §22, §23)

Frontend route protection alone is **never** treated as a security boundary. Every backend route handler and Server Action enforces:

```text
Incoming Request
      ↓
[1] Authentication Check (Valid Supabase User Session)
      ↓
[2] Tenant / Organization Membership (Matches requested org_id)
      ↓
[3] RBAC Verification (Role: Admin / Employer / Student / Member)
      ↓
[4] Resource Ownership (Record user_id == session.user.id OR org_id == session.org_id)
      ↓
Execute Database Mutation with Row Level Security (RLS)
```

### Multi-Tenant Isolation
- Enterprise resources (`projects`, `tasks`, `evaluations`, `billing`, `documents`) are strictly partitioned by `organization_id` / `company_id`.
- Tenant A cannot read, query, or mutate Tenant B's data under any condition. All Supabase queries utilize PostgreSQL RLS policies ensuring database-level enforcement even if application code misbehaves.

### Admin Security
- Admin capabilities (`/admin/*`) require server-side database verification where `role === 'admin'`.
- Client-side headers or tokens with `isAdmin=true` are strictly rejected.

---

## 4. Input Validation & XSS Defense (§15, §25)

- **Schema Validation:** All incoming API payloads, query params, and form inputs are validated using `zod` schemas.
- **Untrusted Content:** All user-generated text (expert profiles, project prompts, evaluation feedback, Markdown submissions) is treated as untrusted and rendered using sanitized React bindings. Arbitrary HTML injection via `dangerouslySetInnerHTML` is prohibited.

---

## 5. Storage & File Upload Security (§24, §84)

- **Bucket Isolation:** Sensitive documents (resumes, ID verification documents, proprietary evaluation datasets) are stored in **Private Supabase Storage Buckets**.
- **Access Model:** Public bucket URLs are disabled. Files are only accessible via short-lived cryptographically signed URLs (default TTL: 3600 seconds) generated after verifying resource ownership.
- **Validation Constraints:**
  - File types restricted to approved MIME types (`application/pdf`, `image/png`, `image/jpeg`).
  - Max upload size: 10 MB.
  - File paths prefixed with sanitized user IDs (`{userId}/resume_{timestamp}.pdf`) to eliminate path traversal vulnerabilities.

---

## 6. HTTP Defense-in-Depth Headers (§38)

Configured at both the Vercel edge (`vercel.json`) and Next.js layer (`next.config.mjs`):

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
X-DNS-Prefetch-Control: on
```

---

## 7. Audit Logging & Diagnostic Tracing (§12, §55, §93)

- **Correlation Request IDs:** Every incoming request receives or generates an immutable `HZ-REQ-xxxxxxxx` correlation identifier.
- **Audit Trails:** Critical events (logins, role changes, payouts, project creations, verification status updates) are recorded with structured metadata:
  ```json
  {
    "timestamp": "2026-09-09T18:00:00.000Z",
    "requestId": "HZ-REQ-89AF12",
    "userId": "usr_998124",
    "action": "EXPERT_VERIFICATION_SUBMITTED",
    "ip": "hashed_client_ip",
    "status": "SUCCESS"
  }
  ```
- **Secret Redaction:** Logs, error reporting tools, and client error boundaries automatically strip authorization headers, cookies, passwords, and connection strings.

---

## 8. Pre-Launch Security Checklist (§100)

- [x] No plaintext credentials or secrets committed to repository.
- [x] `.env.local` and `.env.production` ignored in `.gitignore`.
- [x] All database mutations protected by Row Level Security (RLS).
- [x] Storage buckets for resumes and proprietary datasets set to Private.
- [x] Signed URLs enforce short expiration TTLs.
- [x] Route handlers validate input using Zod.
- [x] Admin routes enforce server-side role validation.
- [x] Request IDs implemented on all error and health endpoints.
- [x] Security headers enforced in `vercel.json` and `next.config.mjs`.
- [x] Diagnostic mode and stack traces suppressed in production builds.
