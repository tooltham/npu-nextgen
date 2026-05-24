# NPU NextGen: Project Instructions

This project follows the **Puy-Lab Global AI Framework** synthesized with the **ECC Engineering Baseline**.

## 1. Project Identity

- **Name:** NPU NextGen — Smart Integrated Farm Manager Application System
- **Owner:** Dr. Apirak Tooltham (ES/SITC, Nakhon Phanom University)
- **Goal:** A production-grade online application system for Non-Degree certificates with strict PDPA and security standards.

## 2. Technical Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5 (Credentials Provider for Admin)
- **Email:** Resend SDK + React Email
- **Security:** AES-256-GCM (ID Encryption), Upstash (Rate Limiting), Zod (Validation)
- **Deployment:** Vercel (App), Supabase (DB), Docker (Standalone)

## 3. Engineering Standards (ECC Baseline)

- **TDD First:** All core business logic must have > 80% coverage (Vitest).
- **Immutability:** Always return new copies; never mutate state in place.
- **Zero-Secret Leak:** Never commit `.env`. Always update `.env.example`.
- **Surgical Arch:** Follow the folder structure in Blueprint Section 12.
- **Pre-commit:** Run `pre-commit run --all-files` before every push.

## 4. Security Protocols

- **National ID:** Must be sanitized and encrypted using `src/lib/encrypt.ts` before persistence.
- **PDPA:** Every application must have a linked `Consent` record with a text snapshot.
- **Rate Limit:** API submissions limited to 5/hour/IP via `src/lib/ratelimit.ts`.

## 5. Development Workflow

1. **Plan:** Present a plan to Mina before execution.
2. **Implement:** Follow the surgical folder structure.
3. **Verify:** Run `npx vitest run` and `pre-commit run`.

## 6. Role & Access Control (RBAC)

- **ADMIN Role:** Full access to all dashboard routes (`/admin/*`) and API routes.
- **STAFF Role:** Restricted access. Can only access and manage:
  - Users (`/admin/users`, `/api/admin/users/*`)
  - Submissions (`/admin/submissions`, `/api/admin/submissions/*`)
  - Courses (`/admin/courses`, `/api/admin/courses/*`)
  - File Uploads (`/api/admin/upload`)
- **Routing:** STAFF login redirects to `/admin/users`. Unauthorized admin routes redirect STAFF to `/admin/users` or `/admin/login` depending on the guard.
- **SSO Auto-Provisioning:** Any login via Google SSO with an `@npu.ac.th` email domain automatically provisions a `STAFF` account.

---

_For machine-specific setup, refer to the private project memory._
