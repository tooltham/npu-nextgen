# Blueprint: NPU NextGen — ระบบรับสมัครหลักสูตร Non-Degree

**Version:** 1.1
**Date:** 2026-05-17
**Owner:** ดร.อภิรักษ์ ทูลธรรม — IoTES/SITC มหาวิทยาลัยนครพนม
**Contact:** apirak@npu.ac.th | 062-441-9599
**Course Site:** https://iotes-sitc.npu.ac.th/

---

## 1. Project Overview

### ชื่อหลักสูตรและวัตถุประสงค์

ระบบรับสมัครออนไลน์สำหรับหลักสูตรประกาศนียบัตร (Non-Degree)
**"นักจัดการฟาร์มเกษตรแบบผสมผสานอัจฉริยะ"**
ดำเนินการโดย มหาวิทยาลัยนครพนม ร่วมกับ สำนักงานเกษตรจังหวัดนครพนม, สำนักงานพาณิชย์จังหวัดนครพนม และเครือข่าย Young Smart Farmer

### ขอบเขตระบบ

- **Landing Page** แสดงข้อมูลหลักสูตรอย่างครบถ้วนเพื่อสร้างความน่าเชื่อถือ ก่อนนำไปสู่ใบสมัคร
- **Application Form** รับสมัครผู้เรียนผ่านฟอร์มออนไลน์แบบ Multi-Step (4 ขั้นตอน)
- บันทึกข้อมูลผู้สมัครลงฐานข้อมูลพร้อม PDPA consent audit trail
- ส่งอีเมลยืนยันอัตโนมัติหลัง submit **ทั้งผู้สมัครและ admin**
- Dashboard สำหรับผู้ดูแลระบบ (admin) ดูและ export รายชื่อผู้สมัครเป็น **CSV และ PDF**
- ออกแบบให้ทำงานบน mobile-first

### Non-Goals (นอกขอบเขต v1.0)

- ระบบชำระเงิน
- ระบบการเรียนออนไลน์ / LMS
- Portal สำหรับผู้เรียนหลังได้รับการคัดเลือก

---

## 2. Tech Stack

| Layer        | Technology                                      | Rationale                                                         |
| ------------ | ----------------------------------------------- | ----------------------------------------------------------------- |
| Framework    | **Next.js 15** (App Router) + TypeScript        | SSR/SSG, file-based routing, API routes ในไฟล์เดียว               |
| Styling      | **Tailwind CSS v4** + **shadcn/ui**             | utility-first, accessible components, ออกแบบ professional ได้เร็ว |
| Form         | **React Hook Form** + **Zod**                   | type-safe validation, performance (uncontrolled inputs)           |
| Database     | **PostgreSQL** (via **Prisma ORM**)             | ACID-compliant, เหมาะกับข้อมูลส่วนบุคคล                           |
| Auth (Admin) | **NextAuth.js v5** (Credentials Provider)       | ป้องกัน admin dashboard, session-based                            |
| Email        | **Resend** SDK                                  | deliverability สูง, React Email template                          |
| PDF Export   | **@react-pdf/renderer**                         | generate PDF รายชื่อผู้สมัคร server-side                          |
| File Storage | **Supabase Storage** (optional: เอกสารแนบ)      | สำรองไว้สำหรับ v1.1                                               |
| Deployment   | **Vercel** (frontend + API) + **Supabase** (DB) | zero-infra, auto-scale                                            |
| CI/CD        | **GitHub Actions**                              | pre-commit + test + deploy on merge to main                       |

---

## 3. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       Browser / Mobile                        │
│   Landing Page  │  Application Form  │  Admin Dashboard       │
└───────┬──────────────────┬───────────────────────┬────────────┘
        │                  │                       │ HTTPS
┌───────▼──────────────────▼───────────────────────▼────────────┐
│                      Next.js App (Vercel)                      │
│  ┌─────────────────────────┐  ┌──────────────────────────┐    │
│  │    App Router (Pages)   │  │   API Routes (/api/*)    │    │
│  │  /          ← Landing   │  │   POST /api/applications  │    │
│  │  /apply     ← Form      │  │   GET  /api/admin/apps    │    │
│  │  /apply/success         │  │   GET  /api/admin/export  │    │
│  │  /admin     ← Dashboard │  │   POST /api/auth/[...]    │    │
│  │  /admin/login           │  └──────────┬───────────────┘    │
│  └─────────────────────────┘             │                     │
└─────────────────────────────────────────┼──────────────────────┘
                                          │ Prisma Client
┌─────────────────────────────────────────▼──────────────────────┐
│                    PostgreSQL (Supabase)                        │
│   applications  │  consents  │  admin_users  │  export_logs    │
└─────────────────────────────────────────────────────────────────┘
                                          │
              ┌───────────────────────────┴────────────────────┐
              │                Resend Email                     │
              │  ① Applicant confirmation  ② Admin notification │
              └─────────────────────────────────────────────────┘
```

---

## 4. Route Structure

```
── Public ──────────────────────────────────────────────────────
/                        → Landing Page
                           · Hero: ชื่อหลักสูตร + คำอธิบายสั้น + CTA
                           · ส่วนที่ 1: รายละเอียดหลักสูตร (ระยะเวลา, ชั่วโมง, หน่วยงาน)
                           · ส่วนที่ 2: คุณสมบัติผู้สมัคร
                           · ส่วนที่ 3: ผลลัพธ์ที่คาดหวัง (3 pillars)
                           · ส่วนที่ 4: พันธมิตรและโลโก้หน่วยงาน (trust signals)
                           · ส่วนที่ 5: FAQ + ช่องทางติดต่อ
                           · Footer CTA: ปุ่ม "สมัครเข้าร่วมหลักสูตร" → /apply

── Application Form ─────────────────────────────────────────────
/apply                   → Multi-step form shell (4 steps)
  ?step=1                → PDPA Consent + ข้อมูลโครงการย่อ
  ?step=2                → Personal Information
  ?step=3                → Background & Qualifications
  ?step=4                → Readiness & Expectations + Review Summary
/apply/success           → Thank-you page + timeline ขั้นตอนต่อไป

── Admin (Protected) ────────────────────────────────────────────
/admin/login             → Admin login
/admin                   → Dashboard: สถิติ + รายชื่อผู้สมัคร
/admin/applications      → Full list + filter + export (CSV / PDF)
```

---

## 5. Data Model (Prisma Schema)

```prisma
model Application {
  id                    String    @id @default(cuid())
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Step 2: Personal Information
  email                 String    @unique
  titleTh               String    // นาย / นาง / นางสาว / อื่นๆ
  firstNameTh           String
  lastNameTh            String
  firstNameEn           String
  lastNameEn            String
  nationalId            String    // encrypted at rest
  phone                 String
  lineId                String?

  // Step 3: Background & Qualifications
  education             Education
  targetGroup           String[]  // multi-select → JSON array
  targetGroupOther      String?
  hasAgriExperience     Boolean
  agriExperienceYears   Int?
  farmName              String?
  farmLocation          String?

  // Step 4: Readiness & Expectations
  digitalSkillLevel     DigitalSkill
  expectations          String[]  // multi-select → JSON array
  expectationsOther     String?
  canCommitTime         Boolean

  // Metadata
  status                AppStatus @default(PENDING)
  ipAddress             String    // สำหรับ audit
  userAgent             String?

  consent               Consent?
}

model Consent {
  id              String      @id @default(cuid())
  applicationId   String      @unique
  application     Application @relation(fields: [applicationId], references: [id])
  granted         Boolean
  consentText     String      // snapshot ข้อความ PDPA ณ เวลาที่ยินยอม
  consentVersion  String      // "v1.0" — อัปเดตเมื่อ policy เปลี่ยน
  grantedAt       DateTime    @default(now())
  ipAddress       String
}

model AdminUser {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
}

enum Education {
  HIGH_SCHOOL_OR_VOC
  DIPLOMA
  BACHELOR
  ABOVE_BACHELOR
}

enum DigitalSkill {
  EXCELLENT
  GOOD
  AVERAGE
  LOW
  NONE
}

model ExportLog {
  id          String    @id @default(cuid())
  adminEmail  String
  format      String    // "csv" | "pdf"
  rowCount    Int
  exportedAt  DateTime  @default(now())
  ipAddress   String
}

enum AppStatus {
  PENDING
  REVIEWED
  ACCEPTED
  REJECTED
}
```

> **Security note:** `nationalId` ต้องเข้ารหัสก่อน persist ด้วย AES-256-GCM (Prisma middleware หรือ field-level encryption) ห้ามเก็บ plain text ในฐานข้อมูล

---

## 6. UI/UX Design System

### Design Tokens (Tailwind config)

```
Primary:     #1B5E20  (เขียวเข้ม — เชื่อมโยงกับเกษตร, น่าเชื่อถือ)
Accent:      #F9A825  (เหลืองทอง — เน้น CTA, warm energy)
Neutral:     #F5F5F5 / #212121
Error:       #C62828
Success:     #2E7D32
Font TH:     Noto Sans Thai (Google Fonts)
Font EN:     Inter (Google Fonts)
Border radius: rounded-xl (12px) ให้ดูทันสมัยแต่ไม่เล่น
Shadow:      shadow-md บน card, shadow-sm บน input
```

### Component Library (shadcn/ui base)

**Landing Page Components:**

| Component              | Usage                                                      |
| ---------------------- | ---------------------------------------------------------- |
| `<HeroSection>`        | Full-width hero: ชื่อหลักสูตร + sub-headline + CTA button  |
| `<CourseDetails>`      | Info cards: ระยะเวลา, ชั่วโมง, รูปแบบ (ทฤษฎี+ปฏิบัติ)      |
| `<EligibilitySection>` | Checklist คุณสมบัติผู้สมัคร                                |
| `<OutcomesSection>`    | 3-column: AI/IoT, Digital Marketing, Cost Reduction        |
| `<PartnersSection>`    | Logo grid: NPU, สนง.เกษตร, สนง.พาณิชย์, Young Smart Farmer |
| `<FAQSection>`         | Accordion FAQ + contact info card                          |

**Application Form Components:**

| Component           | Usage                                           |
| ------------------- | ----------------------------------------------- |
| `<ProgressStepper>` | แสดง Step 1–4 ด้านบน sticky                     |
| `<FormCard>`        | wrapper แต่ละ step มี heading + description     |
| `<ConsentBanner>`   | กล่อง PDPA พร้อม scroll-to-read lock            |
| `<TextInput>`       | พร้อม label + error message inline              |
| `<SelectInput>`     | Dropdown คำนำหน้า / การศึกษา                    |
| `<CheckboxGroup>`   | multi-select กลุ่มเป้าหมาย / ความคาดหวัง        |
| `<RadioGroup>`      | single-select ประสบการณ์ / ระดับทักษะดิจิทัล    |
| `<AlertBanner>`     | warning เมื่อไม่มีประสบการณ์เกษตร (conditional) |
| `<SuccessPage>`     | หน้าขอบคุณ + timeline ขั้นตอนต่อไป              |

### Mobile-First Breakpoints

- Default (mobile): single column, full-width inputs
- `md:` (≥768px): 2-column layout บางส่วน (ชื่อ / นามสกุล)
- `lg:` (≥1024px): centered form card max-w-2xl

---

## 7. Multi-Step Form — Business Logic

### Step 1: Introduction & PDPA Consent

**Required actions before proceeding:**

1. ผู้สมัครต้องเลื่อนอ่าน consent text จนถึงท้าย (scroll lock)
2. ต้องติ๊ก checkbox "ยินยอม" จึงจะกดปุ่ม "ถัดไป" ได้
3. หากเลือก "ไม่ยินยอม" → แสดง modal แจ้งว่า "ไม่สามารถดำเนินการต่อได้" และ block การไปขั้นตอนถัดไป

**PDPA Consent Text (snapshot สำหรับ v1.0):**

> มหาวิทยาลัยนครพนม ในฐานะผู้ควบคุมข้อมูลส่วนบุคคล จะเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ต่อไปนี้เท่านั้น: (1) การคัดเลือกผู้สมัครเข้าร่วมหลักสูตร (2) การรายงานผลต่อสำนักงานปลัดกระทรวงการอุดมศึกษาฯ (สป.อว.) (3) การจัดทำประกาศนียบัตร และ (4) การติดต่อประสานงานที่เกี่ยวข้องกับโครงการ ท่านมีสิทธิ์ขอเข้าถึง แก้ไข ลบ หรือระงับการใช้ข้อมูลได้โดยติดต่อ apirak@npu.ac.th ข้อมูลของท่านจะถูกเก็บรักษาเป็นระยะเวลา 5 ปีนับจากวันที่ยินยอม

### Step 2: Personal Information

| Field       | Type   | Validation                                                 |
| ----------- | ------ | ---------------------------------------------------------- |
| email       | text   | required, email format, unique check via API               |
| titleTh     | select | required                                                   |
| firstNameTh | text   | required, Thai characters only                             |
| lastNameTh  | text   | required, Thai characters only                             |
| firstNameEn | text   | required, Latin characters only                            |
| lastNameEn  | text   | required, Latin characters only                            |
| nationalId  | text   | required, exactly 13 digits, Luhn-like checksum validation |
| phone       | text   | required, 10 digits, starts with 0                         |
| lineId      | text   | optional                                                   |

> **UX note:** `nationalId` ใช้ `<input type="text" inputMode="numeric" maxLength={13}>` อย่าใช้ `type="number"` (นำหน้า 0 หาย)

### Step 3: Background & Qualifications

**Conditional Logic:**

- ถ้า `hasAgriExperience === false` → แสดง `<AlertBanner>` สีส้ม:
  > "หลักสูตรนี้กำหนดให้ผู้สมัครต้องมีประสบการณ์ด้านการเกษตรแบบผสมผสาน ท่านสามารถสมัครได้แต่อาจส่งผลต่อการพิจารณาคัดเลือก"
- ถ้า `hasAgriExperience === true` → แสดง field `agriExperienceYears` (number input, min=1)

### Step 4: Readiness & Expectations + Review

- แสดง summary ข้อมูลทุก step ให้ผู้สมัครตรวจสอบก่อน submit
- ปุ่ม "แก้ไข" ใน section แต่ละส่วนพา navigate กลับไปยัง step ที่ถูกต้อง
- ปุ่ม "ยืนยันการสมัคร" → POST `/api/applications`

### State Management

ใช้ **React Context + useReducer** เก็บ form state ข้าม steps (ไม่ต้องการ global store เต็มรูปแบบ)
Persist ใน `sessionStorage` เพื่อรองรับ page refresh บน mobile

---

## 8. API Endpoints

### `POST /api/applications`

**Request body:** (validated with Zod schema)

```typescript
{
  step2: PersonalInfoSchema,
  step3: BackgroundSchema,
  step4: ReadinessSchema,
  consent: { granted: true, consentVersion: "v1.0" }
}
```

**Business logic:**

1. Validate ทุก field ด้วย Zod (server-side)
2. ตรวจสอบ email ซ้ำใน DB
3. Encrypt `nationalId` ก่อน write (AES-256-GCM)
4. บันทึก `Application` + `Consent` ใน transaction เดียว (atomic)
5. บันทึก IP address จาก `x-forwarded-for` header
6. ส่ง email **2 ฉบับพร้อมกัน** ผ่าน Resend:
   - ① ผู้สมัคร: อีเมลยืนยันการรับใบสมัคร
   - ② Admin: notification พร้อมสรุปข้อมูลผู้สมัครรายใหม่
7. Return `{ success: true, applicationId }`

**Rate limiting:** 5 requests / IP / hour (Next.js middleware + upstash/ratelimit)

### `GET /api/admin/applications`

- Protected: ต้องมี NextAuth session (role: admin)
- Query params: `?status=PENDING&page=1&limit=50`
- Return: paginated list (ไม่รวม `nationalId` — masked)

### `GET /api/admin/applications/export`

- Protected: admin only
- Query params: `?format=csv` (default) หรือ `?format=pdf`
- **CSV:** stream download, UTF-8 with BOM (Excel-compatible), ไม่รวม `nationalId`
- **PDF:** generate server-side ด้วย `@react-pdf/renderer`, มี header NPU logo + วันที่ export + ลายน้ำ "CONFIDENTIAL"
- Log ทุกครั้งที่ export ใน `ExportLog` model: admin email, format, timestamp, row count

### `POST /api/admin/applications/[id]/status`

- Protected: admin only
- Body: `{ status: "ACCEPTED" | "REJECTED" | "REVIEWED" }`
- Trigger email แจ้งผลอัตโนมัติ (v1.1)

---

## 9. Email Templates (React Email)

ทั้งสอง template ส่งพร้อมกันใน `Promise.allSettled()` — ถ้า admin email ล้มเหลวไม่กระทบ applicant email

### Template 1: Applicant Confirmation (ส่งถึงผู้สมัคร)

```
To:      <applicant email>
Subject: [ยืนยัน] รับใบสมัครของคุณแล้ว — หลักสูตรนักจัดการฟาร์มเกษตรอัจฉริยะ

เนื้อหา:
- ชื่อผู้สมัคร + เลขที่ใบสมัคร (application ID)
- สรุปข้อมูลที่กรอก (ชื่อ, อีเมล, เบอร์โทร, กลุ่มเป้าหมาย)
- ขั้นตอนถัดไป + วันที่ประกาศผลการคัดเลือก
- ช่องทางติดต่อสอบถาม (apirak@npu.ac.th | 062-441-9599)
- ข้อมูล PDPA rights (สิทธิ์เข้าถึง/แก้ไข/ลบข้อมูล)
```

### Template 2: Admin Notification (ส่งถึง admin)

```
To:      apirak@npu.ac.th (ADMIN_NOTIFY_EMAIL จาก env)
Subject: [ใบสมัครใหม่] <ชื่อผู้สมัคร> — หลักสูตรนักจัดการฟาร์มเกษตรอัจฉริยะ

เนื้อหา:
- สรุปข้อมูลผู้สมัครรายใหม่ครบทุก field (ยกเว้น nationalId)
- เลขที่ใบสมัคร + วันเวลาที่ submit
- สถานะปัจจุบัน: PENDING
- ปุ่ม "ดูใบสมัคร" → deep link ไปยัง /admin/applications/<id>
- จำนวนผู้สมัครสะสมทั้งหมด (ณ เวลานั้น)
```

---

## 10. PDPA Compliance Checklist

| รายการ                            | Implementation                                                  |
| --------------------------------- | --------------------------------------------------------------- |
| ✅ Consent before data collection | Consent step เป็น Step 1, block ถ้าไม่ยินยอม                    |
| ✅ Purpose limitation             | ระบุวัตถุประสงค์ครบถ้วนใน consent text                          |
| ✅ Data minimization              | เก็บเฉพาะ field ที่จำเป็นตาม TOR                                |
| ✅ Consent audit trail            | `Consent` model บันทึก version, timestamp, IP                   |
| ✅ Consent text snapshot          | เก็บ `consentText` ณ เวลา consent (ไม่ใช่ reference)            |
| ✅ Right to access/correct        | แจ้งช่องทางผ่านอีเมล + consent text                             |
| ✅ Data retention policy          | 5 ปี ระบุใน consent text                                        |
| ✅ Encryption of sensitive data   | `nationalId` ถูก encrypt ก่อน persist                           |
| ✅ Admin access control           | Admin dashboard ต้องผ่าน authentication                         |
| ✅ Masked display                 | `nationalId` masked เป็น `X-XXXX-XXXXX-XX-X` ใน UI              |
| ✅ Export audit log               | บันทึกทุกครั้งที่มีการ export ข้อมูล (admin, format, row count) |
| ✅ Admin notification email       | admin รับแจ้งทุกครั้งที่มีผู้สมัครใหม่ (ไม่มี nationalId)       |
| ✅ HTTPS only                     | Enforce via Vercel (HSTS header)                                |

---

## 11. Security Requirements

### Input Validation

- ทุก field validate ด้วย **Zod** ทั้ง client-side และ server-side (never trust client)
- `nationalId` ตรวจ checksum (Thai National ID algorithm) ก่อน save
- Sanitize HTML output ทุกจุด — ห้ามใช้ `dangerouslySetInnerHTML`

### Authentication (Admin)

- Password hashing: **bcrypt** (cost factor 12)
- Session: NextAuth.js JWT, `httpOnly` cookie, SameSite=Strict
- Session expiry: 8 ชั่วโมง

### Infrastructure

- Rate limiting: 5 submissions / IP / hour
- CSRF: ป้องกันโดย SameSite cookie + Next.js built-in CSRF
- Security headers (next.config.ts):
  ```
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  ```
- Env vars ต้องผ่าน fail-fast validation ที่ startup:
  ```typescript
  // lib/env.ts — ใช้ zod.parse บน process.env
  const env = EnvSchema.parse(process.env); // throw ถ้า missing
  ```

### Secrets Management

- `.env.local` ห้าม commit (`.gitignore`)
- `.env.example` เก็บ placeholder เท่านั้น

---

## 12. Project Structure

```
npu-nextgen/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              ← Landing page
│   │   ├── apply/
│   │   │   ├── page.tsx          ← Multi-step form shell
│   │   │   └── success/
│   │   │       └── page.tsx      ← Thank-you page
│   │   └── layout.tsx
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── page.tsx          ← Dashboard
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   └── layout.tsx            ← Auth guard
│   └── api/
│       ├── applications/
│       │   └── route.ts          ← POST handler (submit + send 2 emails)
│       ├── admin/
│       │   └── applications/
│       │       ├── route.ts      ← GET (list, paginated)
│       │       ├── [id]/
│       │       │   └── route.ts  ← PATCH (status update)
│       │       └── export/
│       │           └── route.ts  ← GET ?format=csv|pdf
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts
├── components/
│   ├── landing/
│   │   ├── HeroSection.tsx       ← Course title + CTA button
│   │   ├── CourseDetails.tsx     ← ระยะเวลา / ชั่วโมง / หน่วยงาน
│   │   ├── EligibilitySection.tsx← คุณสมบัติผู้สมัคร
│   │   ├── OutcomesSection.tsx   ← 3 pillars ผลลัพธ์
│   │   ├── PartnersSection.tsx   ← โลโก้หน่วยงานพันธมิตร (trust signals)
│   │   └── FAQSection.tsx        ← คำถามที่พบบ่อย + ช่องทางติดต่อ
│   ├── apply/
│   │   ├── ProgressStepper.tsx
│   │   ├── StepConsent.tsx
│   │   ├── StepPersonalInfo.tsx
│   │   ├── StepBackground.tsx
│   │   ├── StepReadiness.tsx
│   │   └── ReviewSummary.tsx
│   ├── admin/
│   │   ├── ApplicationTable.tsx
│   │   ├── ExportButtons.tsx     ← CSV + PDF export buttons
│   │   └── StatsCards.tsx        ← จำนวนผู้สมัคร / สถานะ summary
│   └── ui/                       ← shadcn/ui components
├── lib/
│   ├── env.ts                    ← Fail-fast env validation
│   ├── db.ts                     ← Prisma client singleton
│   ├── encrypt.ts                ← nationalId encryption (AES-256-GCM)
│   ├── email.ts                  ← Resend wrapper (sendApplicantConfirmation + sendAdminNotification)
│   ├── pdf.ts                    ← @react-pdf/renderer export generator
│   └── ratelimit.ts              ← Upstash rate limiter
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── emails/
│   ├── ApplicantConfirmation.tsx ← React Email: ส่งผู้สมัคร
│   └── AdminNotification.tsx     ← React Email: ส่ง admin
├── schemas/
│   ├── applicationSchema.ts      ← Zod schemas (shared)
│   └── envSchema.ts
├── context/
│   └── FormContext.tsx           ← Multi-step form state
├── public/
│   └── images/
│       └── npu-logo.svg
├── .env.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── blueprint.md
└── docker.md                     ← (see next artifact)
```

---

## 13. Development Phases

### Phase 1 — Foundation (Sprint 1, ~1 week)

- [ ] Init Next.js 15 + TypeScript + Tailwind + shadcn/ui
- [ ] Setup Prisma + PostgreSQL (local dev + Supabase staging)
- [ ] Setup NextAuth.js + admin user seed
- [ ] Fail-fast env validation (`lib/env.ts`)
- [ ] Zod schemas (applicationSchema.ts)
- [ ] Pre-commit hooks: `~/.gemini/ecc-project/ecc/init-project.sh`

### Phase 2 — Landing Page + Core Form (Sprint 2, ~2 weeks)

- [ ] Landing page: HeroSection, CourseDetails, EligibilitySection
- [ ] Landing page: OutcomesSection, PartnersSection, FAQSection
- [ ] Multi-step form shell + ProgressStepper (sticky, mobile)
- [ ] Step 1: PDPA Consent (scroll lock + checkbox + modal ถ้าปฏิเสธ)
- [ ] Step 2: Personal Information + validation (Thai/EN chars, ID checksum)
- [ ] Step 3: Background + Conditional Logic (ประสบการณ์เกษตร)
- [ ] Step 4: Readiness + Review Summary + edit links per section
- [ ] SessionStorage persistence (ป้องกัน refresh แล้วหาย)
- [ ] POST `/api/applications` with encryption + atomic transaction

### Phase 3 — Email + Admin + Export (Sprint 3, ~1.5 weeks)

- [ ] React Email: `ApplicantConfirmation.tsx`
- [ ] React Email: `AdminNotification.tsx`
- [ ] Resend integration (Promise.allSettled สำหรับ 2 emails)
- [ ] Admin dashboard: StatsCards + ApplicationTable + filter/search
- [ ] Admin: status update (PENDING → REVIEWED → ACCEPTED/REJECTED)
- [ ] Export CSV (UTF-8 BOM, Excel-safe)
- [ ] Export PDF (`@react-pdf/renderer`, NPU logo, ลายน้ำ CONFIDENTIAL)
- [ ] ExportLog audit (admin, format, timestamp, row count)
- [ ] Rate limiting (Upstash, 5 req/IP/hour)

### Phase 4 — QA + Security + Deploy (Sprint 4, ~0.5 week)

- [ ] Unit tests (Vitest): Zod schemas, encrypt/decrypt, Thai ID checksum
- [ ] Integration tests: `/api/applications` happy path + error cases
- [ ] Security headers audit (securityheaders.com)
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices)
- [ ] Deploy to Vercel + Supabase production
- [ ] Smoke test production

---

## 14. Environment Variables

```bash
# .env.example — ใส่ placeholder เท่านั้น ห้ามใส่ค่าจริง

# Database
DATABASE_URL="postgresql://USER:PASS@HOST:5432/npu_nextgen?schema=public"

# Admin Notification Email
ADMIN_NOTIFY_EMAIL="apirak@npu.ac.th"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="<generate: openssl rand -base64 32>"

# Encryption (nationalId)
ENCRYPTION_KEY="<generate: openssl rand -hex 32>"  # 256-bit AES key

# Resend Email
RESEND_API_KEY="re_XXXXXXXXXXXX"
RESEND_FROM="no-reply@npu.ac.th"

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL="https://XXXX.upstash.io"
UPSTASH_REDIS_REST_TOKEN="XXXXXXXX"

# App
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_COURSE_NAME="นักจัดการฟาร์มเกษตรแบบผสมผสานอัจฉริยะ"
```

---

## 15. Success Metrics

| Metric                             | Target                                         |
| ---------------------------------- | ---------------------------------------------- |
| Form completion rate               | ≥ 70% (ผู้เริ่ม Step 1 → Submit สำเร็จ)        |
| Page load (LCP)                    | ≤ 2.5s บน 4G mobile                            |
| Lighthouse Accessibility           | ≥ 90                                           |
| Lighthouse Performance             | ≥ 90                                           |
| Uptime                             | ≥ 99.5%                                        |
| Email delivery rate (applicant)    | ≥ 98%                                          |
| Email delivery rate (admin notify) | ≥ 95% (non-blocking — ไม่กระทบ applicant flow) |
| PDF export generation time         | ≤ 5s สำหรับ 200 records                        |
| PDPA audit completeness            | 100% (ทุก application มี consent record)       |
