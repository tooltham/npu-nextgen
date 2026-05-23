import { describe, it, expect } from "vitest";
import { maskNationalId } from "@/lib/email";

describe("maskNationalId", () => {
  it("masks and formats a valid Thai ID with hyphens", () => {
    const input = "3-4510-00435-56-4";
    const expected = "3-XXXX-XXXXX-56-4";
    expect(maskNationalId(input)).toBe(expected);
  });

  it("formats a raw numeric ID correctly", () => {
    const input = "345104003535645";
    const expected = "3-XXXX-XXXXX-56-4";
    expect(maskNationalId(input)).toBe(expected);
  });

  it("returns placeholder for invalid length", () => {
    expect(maskNationalId("123")).toBe("X-XXXX-XXXXX-XX-X");
  });
});
