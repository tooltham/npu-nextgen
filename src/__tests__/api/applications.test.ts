import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock env before importing route
beforeAll(() => {
  vi.stubEnv(
    "ENCRYPTION_KEY",
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  );
  vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
  vi.stubEnv("NODE_ENV", "test");
});

// Mock Prisma
vi.mock("@/lib/db", () => ({
  default: {
    $transaction: vi.fn((callback) =>
      callback({
        application: {
          findUnique: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockResolvedValue({ id: "test-id" }),
        },
      }),
    ),
  },
}));

import { POST } from "@/app/api/applications/route";

describe("POST /api/applications API", () => {
  it("should return 400 for invalid data", async () => {
    const req = new Request("http://localhost/api/applications", {
      method: "POST",
      body: JSON.stringify({ invalid: "data" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Validation failed");
  });

  it("should return 201 for valid data", async () => {
    const validData = {
      personalInfo: {
        email: "test@example.com",
        titleTh: "นาย",
        firstNameTh: "สมชาย",
        lastNameTh: "ใจดี",
        firstNameEn: "Somchai",
        lastNameEn: "Jaidee",
        nationalId: "1101700207030", // Valid checksum
        phone: "0812345678",
      },
      background: {
        education: "BACHELOR",
        targetGroup: ["FARMER"],
        hasAgriExperience: true,
        agriExperienceYears: 5,
      },
      readiness: {
        digitalSkillLevel: "GOOD",
        expectations: ["AI_IOT_FARM"],
        canCommitTime: true,
      },
      consent: {
        granted: true,
        consentVersion: "v1.0",
        consentText: "PDPA Consent Text",
      },
    };

    const req = new Request("http://localhost/api/applications", {
      method: "POST",
      body: JSON.stringify(validData),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.id).toBe("test-id");
  });
});
