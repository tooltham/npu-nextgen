import { describe, it, expect } from "vitest";
import { validateThaiId, sanitizeThaiId } from "../lib/id-validator";

describe("Thai ID Validator", () => {
  it("should validate a correct Thai ID", () => {
    // A known valid Thai ID (generated or real for testing purposes)
    // Note: Use a known valid checksum ID. Example: 1101700207030
    expect(validateThaiId("1101700207030")).toBe(true);
  });

  it("should invalidate an ID with wrong checksum", () => {
    expect(validateThaiId("1101700207031")).toBe(false);
  });

  it("should invalidate an ID with incorrect length", () => {
    expect(validateThaiId("110170020703")).toBe(false);
    expect(validateThaiId("11017002070300")).toBe(false);
  });

  it("should invalidate an ID with non-digit characters", () => {
    expect(validateThaiId("110170020703A")).toBe(false);
  });

  it("should sanitize ID by removing dashes", () => {
    expect(sanitizeThaiId("1-1017-00207-03-0")).toBe("1101700207030");
  });
});
