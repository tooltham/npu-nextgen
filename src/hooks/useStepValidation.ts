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
      errors[field] = issue.message;
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
