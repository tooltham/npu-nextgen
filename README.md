# NPU NextGen

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

**Online Application System for Smart Integrated Farm Manager Program**

A production-grade, secure application platform for the "Smart Integrated Farm Manager" Non-Degree Certificate program. Developed by Nakhon Phanom University (NPU) as part of the "New Breed Grad" initiative (โครงการผลิตบัณฑิตพันธุ์ใหม่), the system handles complex multi-step applications with legal PDPA compliance, real-time validation, and high-security data encryption.

**Live:** [npu-nextgen.npu.ac.th](https://npu-nextgen.npu.ac.th) (Hypothetical)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Security & Compliance](#security--compliance)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Research & Development Team](#research-team)
- [License](#license)

---

## Overview

NPU NextGen is designed to bridge the gap between traditional farming and modern technology. The system serves as the primary gateway for recruiting 80 smart innovators (2 batches) into an intensive 285-hour program focusing on AI, IoT, and Digital Commerce in agriculture.

### Program Core Pillars

1. **AI-Powered Farm Planning** — Using data for precision agriculture.
2. **IoT Implementation** — Real-time control and environmental monitoring.
3. **AI-Commerce** — Modern branding and sales powered by Generative AI.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       Browser / Mobile                       │
│   Landing Page  │  Application Form  │  Admin Dashboard      │
└───────┬──────────────────┬───────────────────────┬───────────┘
        │                  │                       │ HTTPS (HSTS)
┌───────▼──────────────────▼───────────────────────▼────────────┐
│                      Next.js App (Vercel/Docker)              │
│  ┌─────────────────────────┐  ┌──────────────────────────┐    │
│  │    App Router (Pages)   │  │   API Routes (/api/*)    │    │
│  │  /          ← Landing   │  │   POST /api/applications │    │
│  │  /apply     ← Form      │  │   GET  /api/admin/apps   │    │
│  │  /apply/success         │  │   GET  /api/admin/export │    │
│  │  /admin     ← Dashboard │  │   POST /api/auth/[...]   │    │
│  └─────────────────────────┘  └──────────┬───────────────┘    │
└─────────────────────────────────────────┼─────────────────────┘
                                          │ Prisma Client
┌─────────────────────────────────────────▼──────────────────────┐
│                    PostgreSQL (Supabase)                       │
│   applications  │  consents  │  admin_users  │  export_logs    │
└────────────────────────────────────────────────────────────────┘
                                          │
              ┌───────────────────────────┴──────────────────────┐
              │                Resend Email                      │
              │ 1. Applicant Confirmation 2. Admin Notification  │
              └──────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| **Framework**  | Next.js 15 (App Router)                       |
| **Language**   | TypeScript (Strict)                           |
| **Styling**    | Tailwind CSS v4 + shadcn/ui                   |
| **Database**   | PostgreSQL (Supabase Managed)                 |
| **ORM**        | Prisma                                        |
| **Auth**       | NextAuth.js v5 (Auth.js)                      |
| **Email**      | Resend SDK + React Email                      |
| **Security**   | AES-256-GCM Encryption, Upstash Rate Limiting |
| **Validation** | Zod + React Hook Form                         |
| **Container**  | Docker (Multi-stage alpine build)             |

---

## Features

### Applicant Flow

- **High-Fidelity Landing Page** — Course details, eligibility, outcomes, and FAQ.
- **4-Step Smart Form** — Progressive disclosure with validation at every step.
- **PDPA Scroll Lock** — Legally binding consent mechanism with scroll detection.
- **State Persistence** — `sessionStorage` integration to prevent data loss on refresh.
- **Auto-Email System** — Immediate receipt confirmation with masked ID for privacy.

### Admin Dashboard

- **KPI Monitoring** — Real-time stats on applicant counts and status distribution.
- **Application Management** — Paginated table with status controls (Review/Accept/Reject).
- **Secure Data Export** — Excel-compatible CSV exports with UTF-8 BOM.
- **Audit Logs** — Logging for data access and exports.

---

## Security & Compliance

- **Zero-Secret Leak** — Strict environment validation and git-ignored secrets.
- **Data Encryption** — Thai National IDs are encrypted at rest using AES-256-GCM.
- **PDPA Ready** — Consent versioning and text snapshots stored for every applicant.
- **Rate Limiting** — Sliding window rate limit (5 req/hour/IP) via Upstash Redis.
- **Hardened Headers** — HSTS, X-Frame-Options, and Content Security Policy enabled.

---

## Project Structure

```
npu-nextgen/
├── app/                      # Next.js App Router
│   ├── (public)/             # Landing & Application Form
│   ├── (admin)/              # Protected Admin Dashboard
│   └── api/                  # Secure API Endpoints
├── components/               # React Components
│   ├── landing/              # Hero, FAQ, Course Details
│   ├── apply/                # Multi-step Form Steps
│   └── admin/                # Stats, Tables, Export Buttons
├── lib/                      # Shared Utilities
│   ├── encrypt.ts            # AES-256-GCM Logic
│   ├── email.ts              # Resend Integration
│   └── ratelimit.ts          # Upstash Config
├── prisma/                   # Database Schema & Migrations
├── emails/                   # React Email Templates
└── schemas/                  # Zod Validation Schemas
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- PostgreSQL (Local or Supabase)

### Setup

```bash
# Clone the repo
git clone https://github.com/tooltham/npu-nextgen.git
cd npu-nextgen

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your keys

# Initialize database
npx prisma generate
npx prisma db push

# Start development
npm run dev
```

---

## Deployment

### Docker Production

The system is Pulsar-compliant and ready for containerized deployment.

```bash
docker-compose up -d --build
```

### Vercel

Connect your GitHub repository to Vercel. Ensure all environment variables from `.env.example` are configured in the Vercel dashboard.

---

## Research & Development Team

**Institution:** Nakhon Phanom University
**Research Unit:** Internet of Things and Embedded Systems (IoTES) / SITC
**Contact:** apirak@npu.ac.th

| Name                    | Role                          |
| ----------------------- | ----------------------------- |
| **Dr. Apirak Tooltham** | Project Lead / Architect      |
| **Mina-Chan**           | Lead Orchestrator & Developer |

---

## License

All rights reserved. Part of the New Breed Grad Research Initiative at Nakhon Phanom University.
