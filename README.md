# NPU NextGen — Smart Farm Manager System

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" /><br />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Lightweight-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/PDPA-Compliant-success?style=for-the-badge&logo=security" alt="PDPA" />
</p>

---

## Overview

**ระบบสมัครและจัดการหลักสูตรฝึกอบรมระยะสั้นระดับโปรดักชัน (Production-Grade Short Course & LMS)**
โครงการผลิตบัณฑิตพันธุ์ใหม่ **"นักจัดการฟาร์มเกษตรแบบผสมผสานอัจฉริยะ"** พัฒนาขึ้นโดย **มหาวิทยาลัยนครพนม (Nakhon Phanom University - NPU)** ร่วมกับหน่วยวิจัย **Internet of Things and Embedded Systems (IoTES) / SITC**

ระบบนี้ออกแบบมาเพื่อรองรับกระบวนการลงทะเบียนที่มีความปลอดภัยสูงสุดตามกฎหมาย **PDPA** มีระบบกรอกข้อมูลอัจฉริยะ 4 ขั้นตอน (4-Step Smart Form), ระบบตรวจสอบสิทธิแบบ RBAC (Role-Based Access Control) สำหรับ Admin/Staff, แดชบอร์ดวิเคราะห์ข้อมูลผู้สมัคร (Learning Analytics) และระบบส่งออกรายงานใบสมัครพร้อมการพิมพ์ตัวอย่างเป็นเอกสาร PDF ในรูปแบบไร้รอยต่อ

> [!NOTE]
> **ระบบกำลังทำงานจริงที่:** [nextgen.npu.ac.th](https://nextgen.npu.ac.th)

---

## System Architecture & Infrastructure

ระบบได้รับการ Deploy อย่างเต็มรูปแบบภายใต้เครือข่ายของมหาวิทยาลัยนครพนม โดยนำเทคโนโลยีระดับสูงเข้ามาควบคุม Reverse Proxy และความปลอดภัยระดับไฟล์อย่างรัดกุม:

```
                  ┌───────────────────────────────────────────────────────────┐
                  │                      Browser Client                       │
                  │   Landing Page  │  Application Form  │  Admin Dashboard   │
                  └──────────────────────────────┬────────────────────────────┘
                                                 │ HTTPS / Wildcard SSL
                  ┌──────────────────────────────▼────────────────────────────┘
                  │              NPU Edge Gateway (iotes-nginx Proxy)         │
                  │   • Port 80/443 Redirect      • Certs Auto-Load (wildcard)│
                  └──────────────────────────────┬────────────────────────────┘
                                                 │ proxy_pass (production-network)
                  ┌──────────────────────────────▼────────────────────────────┘
                  │               Next.js Application (Docker Container)      │
                  │   • nextgen-website-prod      • Next.js 16 Standalone     │
                  │   • Security Headers (App)    • Session Timeout (8 Hours) │
                  └──────────────────────────────┬────────────────────────────┘
                                                 │ Prisma ORM (Driver Adapter)
                  ┌──────────────────────────────▼────────────────────────────┘
                  │                 PostgreSQL Database (iotes-db)            │
                  │   • AES-256-GCM Encryption    • PDPA Consent Versioning   │
                  └───────────────────────────────────────────────────────────┘
```

---

## Tech Stack & Lab Standards

| Layer                  | Technology                      | Key Benefits & Standards                                  |
| :--------------------- | :------------------------------ | :-------------------------------------------------------- |
| **Frontend Framework** | `Next.js 16.2.6 (Turbopack)`    | App Router, SSR, Server Component, High-speed Compile     |
| **UI & Styling**       | `React 19` + `Tailwind CSS v4`  | Modern Layouts, Responsive UI, sleek glassmorphism        |
| **Database Engine**    | `PostgreSQL (Supabase Managed)` | Production-grade relational database, HASTS-ready         |
| **ORM Framework**      | `Prisma ORM (v7.8.0)`           | Type-safe queries, driver adapter, seamless schema sync   |
| **Authentication**     | `NextAuth.js v5 (beta-31)`      | Credentials & Google SSO providers, Role check callbacks  |
| **Communication**      | `Resend SMTP` + `React Email`   | Rich transactional notification emails (Admin/Applicant)  |
| **Security Layer**     | `AES-256-GCM` + `Upstash Redis` | Encryption-at-rest for National ID, API rate-limiting     |
| **Containerization**   | `Docker (Multi-stage Alpine)`   | Multi-stage build, minimal attack surface (SSD-optimized) |

---

## System Features

### ระบบสมัครอัจฉริยะ (Applicant Journey)

- **4-Step Smart Form Progress:** การเผยแพร่แบบฟอร์มทีละขั้นตอนพร้อมการตรวจสอบความถูกต้องการบันทึกสถานะชั่วคราว (`sessionStorage`) ป้องกันข้อมูลหาย
- **PDPA Scroll-Lock Verification:** ผู้สมัครต้องเลื่อนอ่านเงื่อนไขความคุ้มครองข้อมูลส่วนบุคคลจนสิ้นสุดเพื่อปลดล็อกปุ่มยอมรับ เป็นข้อกำหนดทางกฎหมาย PDPA แท้จริง
- **Masked National ID:** การแสดงผลและส่งเมลแจ้งเตือนที่ทำการบดบังหลักบัตรประชาชนบางส่วนเพื่อป้องกันการขโมยข้อมูลอัตลักษณ์ส่วนบุคคล

### แดชบอร์ดผู้ดูแลและเจ้าหน้าที่ (Admin & Staff Ecosystem)

- **Role-Based Access Control (RBAC):**
  - **ADMIN:** มีสิทธิ์เข้าถึงทุกระบบในแดชบอร์ด รวมถึง Learning Analytics และรายการใบสมัครทั้งหมด
  - **STAFF:** เข้าถึงได้เฉพาะระบบจัดการผู้เรียน, ระบบตรวจงาน, และระบบจัดการหลักสูตร (ถูกจำกัดสิทธิ์เพื่อความปลอดภัยของข้อมูล)
- **Learning Analytics Dashboard:** สรุปจำนวนตัวเลขและสถิติผู้สมัคร (รอตรวจ/ผ่าน/ตก) พร้อมแผนภูมิวงกลมและแท่งวิเคราะห์ความสามารถทางดิจิทัลและประสบการณ์
- **Course & Lesson Builder:** ระบบจัดการโมดูลการเรียนและบทเรียน (วีดีโอ/Markdown) แบบลากวางและเผยแพร่ (Publish/Draft)
- **Grading & Submissions:** เจ้าหน้าที่ฝ่ายตรวจการบ้านสามารถตรวจผลงานที่นักศึกษาส่งเข้ามา ให้คะแนน และให้ข้อแนะนำรายข้อได้อย่างลื่นไหล
- **PDF & CSV Secure Export:** ส่งออกข้อมูลผู้สมัครในโหมด CSV (UTF-8 BOM ป้องกันฟอนต์เพี้ยน) และปุ่มดูตัวอย่างเอกสารก่อนส่งออกเป็น PDF Preview (SAMEORIGIN Protected) แบบทันที

---

## Security & Hardening Standards

1. **AES-256-GCM Data Encryption:** ข้อมูลเลขบัตรประชาชน (National ID) จะถูกเข้ารหัสอย่างหนาแน่นที่ระดับแอปพลิเคชันก่อนบันทึกสู่ฐานข้อมูล และสามารถถอดรหัสมาอ่านได้เฉพาะผู้ใช้ที่มีสิทธิ์ตามระบบเท่านั้น
2. **Session Lifetime Enforcement:** ปรับจูนระบบรักษาความปลอดภัยของ NextAuth Session ให้หมดอายุใน **8 ชั่วโมง** ( maxAge: `28,800` วินาที) สอดคล้องกับชั่วโมงการทำงานปกติ และบังคับให้ออกจากระบบอัตโนมัติเมื่อสิ้นสุดวันเพื่อความปลอดภัยสูงสุด
3. **Hardened Headers:** เสริมเกราะป้องกันความปลอดภัยของ Edge Gateway ด้วย Security Headers เต็มรูปแบบ (HSTS, nosniff, Referrer-Policy, Strict CSP)

---

## Getting Started

### ข้อกำหนดพื้นฐาน (Prerequisites)

- `Node.js 22+`
- `Docker & Docker Compose`
- `PostgreSQL Database`

### วิธีการติดตั้งแบบ Local Dev

```bash
# 1. โคลนคลังเก็บรหัส
git clone https://github.com/tooltham/npu-nextgen.git
cd npu-nextgen

# 2. ติดตั้งแพ็กเกจระบบ
npm install

# 3. เตรียมสิ่งแวดล้อม
cp .env.example .env
# เปิดและกำหนดค่าในไฟล์ .env ให้ครบถ้วน

# 4. สตาร์ท PostgreSQL Database (ผ่าน Docker Local)
docker compose -f docker-compose.dev.yml up -d

# 5. ซิงค์ตารางข้อมูลและสร้าง Client
npx prisma db push

# 6. สตาร์ทโปรแกรมโหมดพัฒนา
npm run dev
```

---

## Research & Development Team

**มหาวิทยาลัยนครพนม (Nakhon Phanom University - NPU)**
**หน่วยวิจัย Internet of Things and Embedded Systems (IoTES) / วิทยาลัยเทคโนโลยีอุตสาหกรรมศรีสงคราม (SITC)**
อีเมลติดต่อ: apirak@npu.ac.th

| ชื่อ-นามสกุล             | บทบาทหน้าที่ในโครงการ                         |
| :----------------------- | :-------------------------------------------- |
| **ดร. อภิรักษ์ ทูลธรรม** | หัวหน้าโครงการวิจัย / สถาปนิกโครงสร้างระบบ    |
| **มินะ (Mina-Chan)**     | นักพัฒนาหลักและประสานงานระบบ (Lead Dev Agent) |

---

## License

สงวนลิขสิทธิ์ทั้งหมด © 2026 ส่วนหนึ่งของโครงการวิจัยความเชี่ยวชาญเทคโนโลยีอัจฉริยะและการผลิตบัณฑิตพันธุ์ใหม่ มหาวิทยาลัยนครพนม
