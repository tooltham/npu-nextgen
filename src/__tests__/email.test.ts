import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock env
beforeAll(() => {
  vi.stubEnv("RESEND_API_KEY", "re_123");
  vi.stubEnv("ADMIN_NOTIFY_EMAIL", "admin@example.com");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
  vi.stubEnv("NEXT_PUBLIC_COURSE_NAME", "Smart Farming");
});

// Correct mock for Resend class
vi.mock("resend", () => {
  return {
    Resend: class {
      emails = {
        send: vi
          .fn()
          .mockResolvedValue({ data: { id: "email-id" }, error: null }),
      };
    },
  };
});

import {
  sendApplicantConfirmation,
  sendAdminNotification,
  sendRejectionEmail,
} from "../lib/email";

describe("Email Service", () => {
  const mockApplication = {
    id: "app-123",
    email: "applicant@example.com",
    firstNameTh: "สมชาย",
    lastNameTh: "ใจดี",
    nationalId: "1101700207030",
  };

  it("should call resend to send applicant confirmation", async () => {
    const result = await sendApplicantConfirmation(mockApplication);
    expect(result).toHaveProperty("id", "email-id");
  });

  it("should call resend to send admin notification", async () => {
    const result = await sendAdminNotification(mockApplication);
    expect(result).toHaveProperty("id", "email-id");
  });

  it("should call resend to send applicant rejection notification", async () => {
    const result = await sendRejectionEmail(mockApplication);
    expect(result).toHaveProperty("id", "email-id");
  });
});
