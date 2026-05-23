import { z } from "zod";
import { validateThaiId } from "@/lib/id-validator";

// Step 2 Schema
export const personalInfoSchema = z.object({
  email: z.string({ message: "กรุณากรอกอีเมล" }).email("รูปแบบอีเมลไม่ถูกต้อง"),
  titleTh: z
    .string({ message: "กรุณาเลือกคำนำหน้านาม" })
    .min(1, "กรุณาเลือกคำนำหน้านาม"),
  firstNameTh: z
    .string({ message: "กรุณากรอกชื่อจริง (ภาษาไทย)" })
    .min(1, "กรุณากรอกชื่อจริง (ภาษาไทย)"),
  lastNameTh: z
    .string({ message: "กรุณากรอกนามสกุล (ภาษาไทย)" })
    .min(1, "กรุณากรอกนามสกุล (ภาษาไทย)"),
  firstNameEn: z
    .string({ message: "กรุณากรอกชื่อจริง (ภาษาอังกฤษ)" })
    .min(1, "กรุณากรอกชื่อจริง (ภาษาอังกฤษ)")
    .regex(/^[a-zA-Z\s.]+$/, "กรุณากรอกเฉพาะอักษรภาษาอังกฤษและจุดเท่านั้น"),
  lastNameEn: z
    .string({ message: "กรุณากรอกนามสกุล (ภาษาอังกฤษ)" })
    .min(1, "กรุณากรอกนามสกุล (ภาษาอังกฤษ)")
    .regex(/^[a-zA-Z\s]+$/, "กรุณากรอกเฉพาะอักษรภาษาอังกฤษเท่านั้น"),
  nationalId: z
    .string({ message: "กรุณากรอกเลขประจำตัวประชาชน" })
    .refine(validateThaiId, "เลขประจำตัวประชาชนไม่ถูกต้องตามหลักเกณฑ์"),
  phone: z
    .string({ message: "กรุณากรอกเบอร์โทรศัพท์" })
    .regex(
      /^0\d{9}$/,
      "เบอร์โทรศัพท์ต้องมีความยาว 10 หลัก และเริ่มต้นด้วยเลข 0",
    ),
  lineId: z.string().optional(),
  address: z
    .string({ message: "กรุณากรอกที่อยู่ให้ครบถ้วน" })
    .min(5, "กรุณากรอกที่อยู่ให้ครบถ้วน"),
});

// Step 3 Schema
export const backgroundSchema = z.object({
  education: z.enum(
    ["HIGH_SCHOOL_OR_VOC", "DIPLOMA", "BACHELOR", "ABOVE_BACHELOR"] as const,
    {
      message: "กรุณาเลือกระดับการศึกษาสูงสุด",
    },
  ),
  targetGroup: z
    .array(z.string(), {
      message: "กรุณาเลือกกลุ่มเป้าหมายอย่างน้อย 1 กลุ่ม",
    })
    .min(1, "กรุณาเลือกกลุ่มเป้าหมายอย่างน้อย 1 กลุ่ม"),
  targetGroupOther: z.string().optional(),
  hasAgriExperience: z.boolean({
    message: "กรุณาระบุว่ามีประสบการณ์การทำเกษตรหรือไม่",
  }),
  agriExperienceYears: z.number().min(1).optional(),
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
});

// Step 4 Schema
export const readinessSchema = z.object({
  digitalSkillLevel: z.enum(
    ["EXCELLENT", "GOOD", "AVERAGE", "LOW", "NONE"] as const,
    {
      message: "กรุณาเลือกระดับทักษะด้านดิจิทัล",
    },
  ),
  expectations: z
    .array(z.string(), {
      message: "กรุณาเลือกความคาดหวังอย่างน้อย 1 ข้อ",
    })
    .min(1, "กรุณาเลือกความคาดหวังอย่างน้อย 1 ข้อ"),
  expectationsOther: z.string().optional(),
  canCommitTime: z
    .boolean({
      message: "กรุณายืนยันความพร้อมเรื่องเวลาเข้าร่วมโครงการ",
    })
    .refine(
      (val) => val === true,
      "คุณต้องยืนยันว่าสามารถสละเวลาเข้าร่วมโครงการได้",
    ),
});

// Full Application Schema
export const applicationSchema = z.object({
  personalInfo: personalInfoSchema,
  background: backgroundSchema,
  readiness: readinessSchema,
  consent: z.object({
    granted: z.literal(true, {
      message: "กรุณากดยอมรับเงื่อนไขความคุ้มครองข้อมูลส่วนบุคคล (PDPA)",
    }),
    consentVersion: z.string(),
    consentText: z.string(),
  }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
