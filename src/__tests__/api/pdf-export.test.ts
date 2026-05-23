import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock env variables before import
beforeAll(() => {
  vi.stubEnv(
    "ENCRYPTION_KEY",
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  );
  vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
  vi.stubEnv("NEXTAUTH_SECRET", "secret123456789012345678901234567890");
});

// Mock Auth
vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  auth: vi.fn().mockResolvedValue({
    user: { email: "admin@example.com", role: "ADMIN" },
  }),
}));

// Mock Prisma
vi.mock("@/lib/db", () => ({
  default: {
    application: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: "1",
          email: "test@example.com",
          titleTh: "นาย",
          firstNameTh: "สมชาย",
          lastNameTh: "ใจดี",
          nationalId: "0123456789abcdef:0123456789abcdef:0123456789abcdef", // mocked encrypted string format
          phone: "0812345678",
          createdAt: new Date(),
        },
      ]),
    },
  },
}));

import { GET } from "../../app/api/admin/export/pdf/route";

describe("PDF Export API Diagnostic", () => {
  it("should successfully generate PDF for authenticated ADMIN", async () => {
    const req = new Request(
      "http://localhost:3000/api/admin/export/pdf?inline=true",
    );

    console.log("🚀 Starting PDF generation test...");
    const res = await GET(req);

    console.log("Response status:", res.status);

    if (res.status !== 200) {
      const body = await res.json();
      console.log("❌ Response Error details:", body);
    } else {
      console.log(
        "✅ PDF generated successfully! Content-Type:",
        res.headers.get("Content-Type"),
      );
    }

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
  });
});
