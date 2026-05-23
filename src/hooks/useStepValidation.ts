"use client";

import { useState, useCallback } from "react";
import { z } from "zod";

export type ValidationErrors = Record<string, string>;

export type ValidationResult = {
  valid: boolean;
  errors: ValidationErrors;
};

/**
 * Pure validation utility — separated from React state for testability.
 * Validates `data` against a Zod schema and returns a structured result.
 * Returns only the first error message per field.
 */
export function validateWithSchema(
  schema: z.ZodTypeAny,
  data: unknown,
): ValidationResult {
  const result = schema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {} };
  }

  const errors: ValidationErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0]?.toString();
    if (field && !errors[field]) {
      let message = issue.message;

      // Custom translation map for Zod's default English messages
      if (
        message.includes("expected array") ||
        message.includes("Expected array")
      ) {
        if (field === "targetGroup") {
          message = "กรุณาเลือกกลุ่มเป้าหมายอย่างน้อย 1 กลุ่ม";
        } else if (field === "expectations") {
          message = "กรุณาเลือกความคาดหวังอย่างน้อย 1 ข้อ";
        } else {
          message = "กรุณาเลือกอย่างน้อย 1 ตัวเลือก";
        }
      } else if (
        message.includes("expected boolean") ||
        message.includes("Expected boolean")
      ) {
        if (field === "hasAgriExperience") {
          message = "กรุณาระบุว่ามีประสบการณ์การทำเกษตรหรือไม่";
        } else if (field === "canCommitTime") {
          message = "กรุณายืนยันความพร้อมเรื่องเวลาเข้าร่วมโครงการ";
        } else {
          message = "กรุณาระบุตัวเลือกนี้";
        }
      } else if (
        message.includes("expected string") ||
        message.includes("Expected string")
      ) {
        message = "กรุณากรอกข้อมูลในช่องนี้";
      } else if (message === "Required") {
        message = "กรุณาระบุข้อมูลในช่องนี้";
      }

      errors[field] = message;
    }
  }

  return { valid: false, errors };
}

/**
 * React hook for step-level form validation.
 * Each Step component holds its own error state via this hook.
 *
 * Usage:
 *   const { validate, errors, clearErrors } = useStepValidation(personalInfoSchema);
 *   const handleNext = () => { if (validate(formData)) nextStep(); };
 */
export function useStepValidation(schema: z.ZodTypeAny) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback(
    (data: unknown): boolean => {
      const result = validateWithSchema(schema, data);
      setErrors(result.errors);
      return result.valid;
    },
    [schema],
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { validate, errors, clearErrors };
}
