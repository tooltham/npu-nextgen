# NPU NextGen: Comprehensive Development Plan (ECC & Pulsar Standard)

## 1. Project Objective

Develop a production-grade online application system for Nakhon Phanom University's "Smart Integrated Farm Manager" Non-Degree course. The system focuses on UX, security (PDPA), and operational efficiency for admins.

## 2. Technical Stack & Standards

- **Runtime:** Next.js 15 (App Router) + TypeScript.
- **Styling:** Tailwind CSS v4 + shadcn/ui.
- **Data:** PostgreSQL + Prisma ORM + Supabase.
- **Security:** AES-256-GCM for sensitive data, NextAuth.js v5, Zod validation.
- **Standards:** ECC Engineering Baseline (Strict TDD, Pre-commit checks) & Pulsar Framework (SSD-optimized images, Multi-stage builds).

## 3. Implementation Phases

### Phase 1: Foundation & Engineering Baseline (Surgical Setup)

- **1.1 Next.js Init:** Initialize Next.js 15 with `src/`, `App Router`, and `Tailwind CSS v4`.
- **1.2 Folder Architecture:** Implement the exact structure from Blueprint Section 12:
  - `src/app/`, `src/components/(landing|apply|admin|ui)`, `src/lib/`, `src/prisma/`, `src/schemas/`, `src/context/`, `src/emails/`.
- **1.3 Pulsar Scaffolding:**
  - Copy `blueprint.md` and `docker.md` to Root.
  - Create `.env.example` with all variables (Section 14).
- **1.4 Security Core:**
  - `lib/env.ts` + `schemas/envSchema.ts`: Implement fail-fast Zod-based env validation.
  - `lib/encrypt.ts`: Implement AES-256-GCM encryption/decryption for `nationalId`.
  - `lib/id-validator.ts`: Implement Thai National ID checksum logic.
- **1.5 Database Foundation:**
  - `prisma/schema.prisma`: Implement the full data model (Application, Consent, AdminUser, ExportLog) with all Enums.
  - `lib/db.ts`: Prisma client singleton.
- **1.6 Verification:** Setup Vitest and write initial tests for Security Core (encryption & ID validation). Run `pre-commit run --all-files`.

### Phase 2: Landing Page & Multi-Step Form (UX & PDPA)

- **2.1 Landing Page:** Build all sections (`Hero`, `CourseDetails`, `Eligibility`, `Outcomes`, `Partners`, `FAQ`) as high-fidelity shadcn components.
- **2.2 Form Core:** Setup `FormContext` for multi-step state management with `sessionStorage` persistence.
- **2.3 Step 1 (PDPA):** Implement scroll-lock consent component with audit trail logging.
- **2.4 Step 2-4:** Build form fields with real-time Zod validation and conditional logic (e.g., `agriExperienceYears` warning).
- **2.5 Submission Logic:** Implement `POST /api/applications` with atomic transaction for Application + Consent.

### Phase 3: Admin Dashboard & Automation

- **3.1 Admin Auth:** Setup NextAuth.js v5 with Credentials Provider.
- **3.2 Admin UI:** Build the Dashboard with stats cards and the paginated Application Table.
- **3.3 Email System:** Integrate Resend for dual-notification (Applicant & Admin) using React Email templates.
- **3.4 Export System:** Implement CSV (streamed) and PDF (`@react-pdf/renderer`) export with audit logging.

### Phase 4: Quality, Security & Deployment

- **4.1 Optimization:** Lighthouse audit for Performance (LCP < 2.5s) and Accessibility (Score > 90).
- **4.2 Security Hardening:** Configure security headers in `next.config.ts`, implement Upstash rate limiting.
- **4.3 Deployment:** Deploy to Vercel/Supabase and perform production smoke tests.

## 4. Verification Strategy

- **Continuous:** Git hooks will run linting and formatting on every commit.
- **Unit/Integration:** All critical business logic (encryption, validation, transactions) must have > 80% test coverage.
- **Manual:** Final UAT check against the Blueprint's Success Metrics.
