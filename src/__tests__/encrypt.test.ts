import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock env before importing encrypt
beforeAll(() => {
  vi.stubEnv(
    "ENCRYPTION_KEY",
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  );
  vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
  vi.stubEnv("NEXTAUTH_SECRET", "secret123456789012345678901234567890");
  vi.stubEnv("RESEND_API_KEY", "re_123");
  vi.stubEnv("ADMIN_NOTIFY_EMAIL", "admin@example.com");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
});

import { encrypt, decrypt } from "../lib/encrypt";

describe("Encryption Utility", () => {
  it("should encrypt and decrypt correctly", () => {
    const plainText = "1101700207030";
    const encrypted = encrypt(plainText);

    expect(encrypted).not.toBe(plainText);
    expect(encrypted.split(":").length).toBe(3); // iv:authTag:ciphertext

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(plainText);
  });

  it("should throw error for invalid encrypted format", () => {
    expect(() => decrypt("invalidformat")).toThrow(
      "Invalid encrypted text format",
    );
  });

  it("should fail to decrypt with wrong key (simulated by corrupted data)", () => {
    const encrypted = encrypt("test");
    const lastChar = encrypted.slice(-1);
    const corrupted = encrypted.slice(0, -1) + (lastChar === "0" ? "1" : "0");
    expect(() => decrypt(corrupted)).toThrow();
  });
});
