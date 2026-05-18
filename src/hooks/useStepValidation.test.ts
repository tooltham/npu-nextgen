import { describe, it, expect } from "vitest";
import { z } from "zod";
import { validateWithSchema } from "./useStepValidation";

// Simple test schema
const testSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
});

describe("validateWithSchema (pure validation utility)", () => {
  it("1. should return { valid: true, errors: {} } when data is valid", () => {
    const result = validateWithSchema(testSchema, {
      name: "สมชาย",
      email: "test@npu.ac.th",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("2. should return { valid: false } and populate errors when data is invalid", () => {
    const result = validateWithSchema(testSchema, {
      name: "",
      email: "not-an-email",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.name).toBe("กรุณากรอกชื่อ");
    expect(result.errors.email).toBe("รูปแบบอีเมลไม่ถูกต้อง");
  });

  it("3. each field key should map to a single string message (not an array)", () => {
    const result = validateWithSchema(testSchema, {
      name: "",
      email: "bad",
    });

    expect(typeof result.errors.name).toBe("string");
    expect(typeof result.errors.email).toBe("string");
  });

  it("4. should only report errors for invalid fields (valid fields should not appear)", () => {
    const result = validateWithSchema(testSchema, {
      name: "สมหญิง",
      email: "bad-email",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeUndefined();
    expect(result.errors.email).toBeDefined();
  });

  it("5. should handle unknown/extra fields gracefully without throwing", () => {
    expect(() =>
      validateWithSchema(testSchema, {
        name: "ทดสอบ",
        email: "ok@test.com",
        extraField: "should-be-ignored",
      }),
    ).not.toThrow();
  });
});
