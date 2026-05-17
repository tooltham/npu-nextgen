import { z } from "zod";
import { validateThaiId } from "@/lib/id-validator";

// Step 2 Schema
export const personalInfoSchema = z.object({
  email: z.string().email("Invalid email format"),
  titleTh: z.string().min(1, "Title is required"),
  firstNameTh: z.string().min(1, "First name (Thai) is required"),
  lastNameTh: z.string().min(1, "Last name (Thai) is required"),
  firstNameEn: z
    .string()
    .min(1, "First name (English) is required")
    .regex(/^[a-zA-Z\s]+$/, "Latin characters only"),
  lastNameEn: z
    .string()
    .min(1, "Last name (English) is required")
    .regex(/^[a-zA-Z\s]+$/, "Latin characters only"),
  nationalId: z
    .string()
    .refine(validateThaiId, "Invalid Thai National ID checksum"),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Phone must be 10 digits and start with 0"),
  lineId: z.string().optional(),
});

// Step 3 Schema
export const backgroundSchema = z.object({
  education: z.enum([
    "HIGH_SCHOOL_OR_VOC",
    "DIPLOMA",
    "BACHELOR",
    "ABOVE_BACHELOR",
  ]),
  targetGroup: z.array(z.string()).min(1, "Select at least one group"),
  targetGroupOther: z.string().optional(),
  hasAgriExperience: z.boolean(),
  agriExperienceYears: z.number().min(1).optional(),
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
});

// Step 4 Schema
export const readinessSchema = z.object({
  digitalSkillLevel: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "LOW", "NONE"]),
  expectations: z.array(z.string()).min(1, "Select at least one expectation"),
  expectationsOther: z.string().optional(),
  canCommitTime: z
    .boolean()
    .refine((val) => val === true, "You must be able to commit time"),
});

// Full Application Schema
export const applicationSchema = z.object({
  personalInfo: personalInfoSchema,
  background: backgroundSchema,
  readiness: readinessSchema,
  consent: z.object({
    granted: z.literal(true, {
      errorMap: () => ({ message: "PDPA consent is required" }),
    }),
    consentVersion: z.string(),
    consentText: z.string(),
  }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
