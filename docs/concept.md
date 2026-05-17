# Course Application Form — Concept Specification

## Project Metadata

| Key                     | Value                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Course name (TH)        | นักจัดการฟาร์มเกษตรแบบผสมผสานอัจฉริยะ                                                |
| Course name (EN)        | Smart Integrated Farm Manager                                                        |
| Type                    | Non-Degree Certificate                                                               |
| Duration                | 16–20 weeks (120–180 days) · 285 hours total                                         |
| Theory hours            | 45 hrs                                                                               |
| Practical hours         | 240 hrs                                                                              |
| Organizer               | Nakhon Phanom University (NPU)                                                       |
| Partners                | สำนักงานเกษตรจังหวัดนครพนม, สำนักงานพาณิชย์จังหวัดนครพนม, Young Smart Farmer Network |
| Contact person          | ดร.อภิรักษ์ ทูลธรรม                                                                  |
| Phone                   | 062-441-9599                                                                         |
| Email                   | apirak@npu.ac.th                                                                     |
| Website                 | https://iotes-sitc.npu.ac.th/                                                        |
| Eligibility requirement | Must have mixed farming experience (crops and/or livestock)                          |

---

## Form Structure — Multi-Step (4 Steps)

### Step 1: Introduction & PDPA Consent

**Purpose:** Display course overview and collect legally required consent before any data is captured.

**Course summary displayed to applicant:**

- Course name, organizer, partners
- Duration: 16–20 weeks, 285 hours (theory 45 hrs + practical 240 hrs)
- Eligibility: mixed farming experience required
- Contact: ดร.อภิรักษ์ ทูลธรรม — apirak@npu.ac.th / 062-441-9599

**PDPA consent statement (shown in full, scroll-to-read):**

> มหาวิทยาลัยนครพนม จะเก็บรวบรวมข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ดังต่อไปนี้เท่านั้น: (1) คัดเลือกผู้สมัครเข้าร่วมหลักสูตร (2) รายงานผลต่อ สป.อว. (3) จัดทำประกาศนียบัตร (4) ติดต่อประสานงานในโครงการผลิตบัณฑิตพันธุ์ใหม่ฯ

**Consent field:**

| Field       | Type  | Options              | Logic                                          |
| ----------- | ----- | -------------------- | ---------------------------------------------- |
| pdpaConsent | radio | `GRANTED` / `DENIED` | `DENIED` → block form, show modal, end session |

---

### Step 2: Personal Information

**Purpose:** Collect applicant identity data. All fields validated before proceeding.

| Field       | Type   | Required | Validation                                   |
| ----------- | ------ | -------- | -------------------------------------------- |
| email       | text   | yes      | valid email format; unique in database       |
| titleTh     | select | yes      | นาย / นาง / นางสาว / อื่นๆ                   |
| firstNameTh | text   | yes      | Thai characters only                         |
| lastNameTh  | text   | yes      | Thai characters only                         |
| firstNameEn | text   | yes      | Latin characters only                        |
| lastNameEn  | text   | yes      | Latin characters only                        |
| nationalId  | text   | yes      | exactly 13 digits; Thai national ID checksum |
| phone       | text   | yes      | 10 digits; starts with 0                     |
| lineId      | text   | no       | free text                                    |

---

### Step 3: Background & Qualifications

**Purpose:** Screen applicants against TOR eligibility criteria.

**Field: education** — single select (required)

| Value                | Label                       |
| -------------------- | --------------------------- |
| `HIGH_SCHOOL_OR_VOC` | มัธยมศึกษาตอนปลาย หรือ ปวช. |
| `DIPLOMA`            | ปวส.                        |
| `BACHELOR`           | ปริญญาตรี                   |
| `ABOVE_BACHELOR`     | สูงกว่าปริญญาตรี            |

**Field: targetGroup** — multi-select (required, min 1)

| Value                  | Label                                             |
| ---------------------- | ------------------------------------------------- |
| `UNEMPLOYED`           | ผู้ที่ยังไม่ได้ทำงาน ต้องการเรียนเพื่อประกอบอาชีพ |
| `FARMER`               | เกษตรกร หรือ ทายาทเกษตรกร                         |
| `COMMUNITY_ENTERPRISE` | ผู้ประกอบการวิสาหกิจชุมชน หรือแรงงานในภาคการเกษตร |
| `OTHER`                | อื่นๆ (free text required)                        |

**Field: hasAgriExperience** — boolean radio (required)

| Value   | Label           | Conditional trigger                         |
| ------- | --------------- | ------------------------------------------- |
| `true`  | มีประสบการณ์    | show `agriExperienceYears` (integer, min 1) |
| `false` | ไม่มีประสบการณ์ | show warning banner (non-blocking)          |

> **Warning banner text (when `hasAgriExperience = false`):**
> "หลักสูตรนี้กำหนดให้ผู้สมัครต้องมีประสบการณ์ด้านการเกษตรแบบผสมผสาน ท่านสามารถสมัครได้แต่อาจส่งผลต่อการพิจารณาคัดเลือก"

**Additional fields:**

| Field               | Type    | Required                                    |
| ------------------- | ------- | ------------------------------------------- |
| agriExperienceYears | integer | conditional (when hasAgriExperience = true) |
| farmName            | text    | no                                          |
| farmLocation        | text    | no                                          |

---

### Step 4: Readiness & Expectations

**Purpose:** Assess applicant readiness for instructor planning and module customization.

**Field: digitalSkillLevel** — single select (required)

| Value       | Label           |
| ----------- | --------------- |
| `EXCELLENT` | ดีมาก           |
| `GOOD`      | ดี              |
| `AVERAGE`   | ปานกลาง         |
| `LOW`       | น้อย            |
| `NONE`      | ไม่มีพื้นฐานเลย |

**Field: expectations** — multi-select (required, min 1)

| Value               | Label                                              |
| ------------------- | -------------------------------------------------- |
| `AI_IOT_FARM`       | ต้องการใช้ AI และ IoT ในการวิเคราะห์และจัดการฟาร์ม |
| `DIGITAL_MARKETING` | ต้องการทักษะการสร้างแบรนด์และการตลาดดิจิทัล        |
| `REDUCE_COST`       | ต้องการนำเทคโนโลยีมาลดต้นทุนและเพิ่มมูลค่าผลผลิต   |
| `OTHER`             | อื่นๆ (free text required)                         |

**Field: canCommitTime** — boolean radio (required)

| Value   | Label                                                      |
| ------- | ---------------------------------------------------------- |
| `true`  | สามารถเข้าร่วมได้ตามเงื่อนไข (285 ชั่วโมง / 16–20 สัปดาห์) |
| `false` | ไม่แน่ใจ / ไม่สามารถเข้าร่วมได้เต็มเวลา                    |

**Review summary** — displayed before final submit:

- Show all Step 2–4 data for applicant to verify
- Each section has an "Edit" link returning to the correct step
- Submit button → `POST /api/applications`

---

## UX Requirements

| Requirement            | Specification                                                 |
| ---------------------- | ------------------------------------------------------------- |
| Progress indicator     | Sticky stepper bar at top — "Step X of 4"                     |
| State persistence      | Save form state to `sessionStorage` (survives page refresh)   |
| PDPA scroll lock       | "Next" button disabled until consent text scrolled to bottom  |
| Consent denied         | Modal message → block all further steps                       |
| Conditional warning    | Non-blocking banner when `hasAgriExperience = false`          |
| Auto email (applicant) | Confirmation email sent immediately after successful submit   |
| Auto email (admin)     | Notification email with applicant summary sent simultaneously |
| Mobile layout          | Single column by default; 2-column on md+ for name fields     |
