# NPU NextGen - Lean LMS & RBAC Implementation Blueprint

# Version: 1.0 | Updated: 2026-05-19

## 1. System Architecture & RBAC Overview

ระบบแบ่งการเข้าถึงออกเป็น 3 ระดับ (Roles) ภายใต้ NextAuth.js v5:

1. **ADMIN (`/admin/*`)**
   - ดูแลภาพรวมทั้งหมด, จัดการบัญชี Staff/Admin
   - จัดการโครงสร้างเนื้อหา (Modules, Lessons, Quizzes)
   - อนุมัติผู้สมัคร (Application -> Student User)
2. **STAFF (Restricted `/admin/*`)**
   - เข้าใช้งานผ่านหน้า Admin Dashboard เหมือน ADMIN แต่เห็นเมนูจำกัด
   - จัดการข้อมูลผู้เรียน (`/admin/users`)
   - ตรวจการบ้านและประเมินผล (`/admin/submissions`)
   - จัดการเนื้อหาหลักสูตร (`/admin/courses`)
   - ไม่มีสิทธิ์เข้าถึงเมนูแดชบอร์ดหลัก (Analytics) หรือการรับสมัคร (Applications)
3. **STUDENT (`/portal/*`)**
   - เข้าถึงบทเรียนวิดีโอ (YouTube) และดาวน์โหลดเอกสารจาก Production Server
   - ทำแบบทดสอบและดูรายงานผลการเรียน (Academic Report)
   - ดาวน์โหลดใบประกาศนียบัตรออนไลน์ (PDF E-Certificate) เมื่อเรียนจบและผ่านเกณฑ์

**Infrastructure Integrations:**

- **Video & Storage:** วิดีโอหลักสูตรฝากที่ YouTube, ไฟล์เอกสารเก็บใน Production Server
- **Authentication:** Admin/Staff บังคับใช้ Google SSO (`@npu.ac.th`), บุคคลภายนอกและ Student ใช้ Email/Password
- **Communication:** ส่งอีเมลแจ้งเตือนอัตโนมัติ (ผลตรวจงาน, ขาดการเข้าสู่ระบบ)

---

## 2. Database Schema Update (Prisma)

```prisma
// NextAuth Standard Models (OAuth Support)
model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model User {
  id            String       @id @default(cuid())
  name          String?
  email         String       @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?      // Optional: Null สำหรับผู้ใช้ Google SSO
  role          Role         @default(STUDENT)
  isActive      Boolean      @default(true)
  lastLoginAt   DateTime?    // ใช้สำหรับจับเวลาแจ้งเตือนคนหาย (Inactivity)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  accounts      Account[]

  // Student specific relations
  applicationId String?      @unique
  application   Application? @relation(fields: [applicationId], references: [id])
  progress      LessonProgress[]
  quizAttempts  QuizAttempt[]
  submissions   Submission[]
  certificate   Certificate?

  // Staff specific relations
  gradedSubmissions Submission[] @relation("StaffGrades")
}

enum Role {
  ADMIN
  STAFF
  STUDENT
}

model CourseModule {
  id          String       @id @default(cuid())
  title       String       // e.g., "AI & Smart Planning"
  description String?      @db.Text
  order       Int
  lessons     Lesson[]
}

model Lesson {
  id          String         @id @default(cuid())
  moduleId    String
  module      CourseModule   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  title       String
  videoUrl    String?
  documentUrl String?
  order       Int

  progress    LessonProgress[]
  quizzes     Quiz[]
}

model LessonProgress {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  isCompleted Boolean  @default(false)
  updatedAt   DateTime @updatedAt

  @@unique([userId, lessonId])
}

model Quiz {
  id          String   @id @default(cuid())
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  question    String   @db.Text
  options     Json     // ["A", "B", "C", "D"]
  correctIdx  Int      // 0, 1, 2, or 3

  attempts    QuizAttempt[]
}

model QuizAttempt {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizId      String
  quiz        Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  selectedIdx Int
  isCorrect   Boolean
  attemptedAt DateTime @default(now())
}

model Submission {
  id             String    @id @default(cuid())
  userId         String
  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  moduleId       String
  assignmentUrl  String
  note           String?   @db.Text
  submittedAt    DateTime  @default(now())

  score          Float?
  feedback       String?   @db.Text
  gradedById     String?
  gradedBy       User?     @relation("StaffGrades", fields: [gradedById], references: [id])
  gradedAt       DateTime?
  status         GradeStatus @default(PENDING)
}

enum GradeStatus {
  PENDING
  PASS
  FAIL
}

model Certificate {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  certUrl      String   // Path ของไฟล์ PDF บน Production Server
  issuedAt     DateTime @default(now())
}
```

---

## 3. Implementation Plan (Phase by Phase)

### Phase 1: Database Migration & Multi-Provider Auth (Effort: 1.5 Days)

1. อัพเดต `schema.prisma` เพิ่มโมเดล `Account` และ `Certificate` รวมถึงปรับ `User` ให้รองรับ OAuth
2. **CRITICAL:** เขียน Script โอนย้ายข้อมูลจากตาราง `AdminUser` เดิมลงตารางใหม่
3. ติดตั้ง Google Provider ใน NextAuth v5 (กำหนดเงื่อนไขตรวจสอบโดเมน `@npu.ac.th` สำหรับ Admin/Staff)
4. เพิ่ม Middleware `src/middleware.ts` สำหรับ Route Protection ตามบทบาท

### Phase 2: Student Onboarding Flow (Effort: 0.5 Day)

1. เพิ่มปุ่ม "Approve & Invite" ในหน้า `ApplicationTable` (Admin Dashboard)
2. สร้าง API `/api/admin/invite` เพื่อสร้างบัญชี Student อัตโนมัติ พร้อมสุ่มรหัสผ่าน
3. ส่งอีเมลแจ้งเตือนผู้สมัคร (ผ่าน Resend) ให้เข้าสู่ระบบพร้อมลิงก์หน้า `/login`

### Phase 3: Content Management & Learning Portal (Effort: 2 Days)

1. **Admin:** พัฒนาฟอร์มจัดการโครงสร้างหลักสูตร (ระบบอัพโหลดไฟล์เข้า Production Server และบันทึกลิงก์ YouTube)
2. **Student Portal:** สร้างหน้า Classroom สำหรับเล่นวิดีโอ (YouTube Embed) และดาวน์โหลดเอกสาร
3. ทำระบบหน้าต่างทำแบบทดสอบอัตโนมัติ (Quizzes) พร้อมบันทึกคะแนน

### Phase 4: Grading & E-Certificate Pipeline (Effort: 2 Days)

1. **Staff Grading:** สร้างหน้า `/admin/submissions` ให้ Staff เข้าไปตรวจงานผ่าน Dashboard กลาง
2. **Notification Webhooks:** ทริกเกอร์ฟังก์ชันส่งอีเมล (Resend) แจ้งเตือนผู้เรียนทันทีที่ Staff กดยืนยันผลตรวจ
3. **E-Certificate Generator:** สร้าง Service อัตโนมัติ (เช่น ใช้ `@react-pdf/renderer` ทางฝั่ง Server) เพื่อ Generate ไฟล์ PDF ทันทีที่ผู้เรียนเก็บคะแนนและสถานะครบทั้ง 3 โมดูล พร้อมบันทึกพาร์ทลงฐานข้อมูล

### Phase 5: Inactivity Cron Jobs (Effort: 0.5 Day)

1. สร้าง API Route แบบ Cron Job (เช่น เรียกทุกเที่ยงคืน) สแกนหา `User` สาย Student ที่มี `lastLoginAt` ขาดหายไปนานเกินเกณฑ์
2. ส่งอีเมลกระตุ้นเตือน (Reminder) อัตโนมัติ

---

## 4. Security Requirements (Puy-Lab Standard)

- ตรวจสอบ `token.role` อย่างเข้มงวดทั้งในฝั่ง Server Components และ API Routes
- API ที่เกี่ยวข้องกับการตรวจงาน ต้องเช็คสิทธิ์ `ADMIN` หรือ `STAFF` เสมอ
- ไฟล์เอกสารและการบ้านผู้เรียน (Assignment URLs) ต้องเก็บในรูปแบบอ้างอิงที่ปลอดภัย ไม่เป็น Public Directory (ยกเว้นเป็นลิงก์ภายนอกที่ผู้ใช้ส่งเข้ามา)
- ป้องกัน CSRF ในทุกๆ Form ที่ทำการ Submit
