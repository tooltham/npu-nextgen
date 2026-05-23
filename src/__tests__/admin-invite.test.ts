import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@prisma/client", () => ({
  Role: {
    ADMIN: "ADMIN",
    STAFF: "STAFF",
    STUDENT: "STUDENT",
  },
  AppStatus: {
    PENDING: "PENDING",
    REVIEWED: "REVIEWED",
    ACCEPTED: "ACCEPTED",
  },
}));

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    application: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    applicationLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(vi.stubGlobal("tx", {}))),
  },
}));

vi.mock("@/lib/email", () => ({
  sendStudentWelcomeEmail: vi.fn().mockResolvedValue({ success: true }),
}));

import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { sendStudentWelcomeEmail } from "@/lib/email";
import { POST } from "@/app/api/admin/invite/route";

describe("Admin Invite Student Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully invite student and create a user account", async () => {
    // 1. Mock admin session
    vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
      user: {
        id: "admin-1",
        email: "admin@npu.ac.th",
        role: "ADMIN",
      },
      expires: "123",
    });

    const mockApplication = {
      id: "app-123",
      email: "student@example.com",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      status: "PENDING",
    };

    // Mock prisma responses
    vi.mocked(prisma.application.findUnique).mockResolvedValue(
      mockApplication as Record<string, unknown>,
    );
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null); // No existing student user

    // Mock transaction runner
    const mockTx = {
      user: {
        create: vi.fn().mockResolvedValue({
          id: "user-student-1",
          email: "student@example.com",
          role: "STUDENT",
        }),
      },
      application: {
        update: vi.fn().mockResolvedValue({} as Record<string, unknown>),
      },
      applicationLog: {
        create: vi.fn().mockResolvedValue({} as Record<string, unknown>),
      },
    };

    vi.mocked(prisma.$transaction).mockImplementation(
      async (callback: Record<string, unknown>) => {
        return await callback(mockTx);
      },
    );

    const request = new Request("http://localhost:3000/api/admin/invite", {
      method: "POST",
      body: JSON.stringify({ applicationId: "app-123" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.message).toBe("Student invited successfully");
    expect(json.data.email).toBe("student@example.com");
    expect(json.data.role).toBe("STUDENT");

    expect(prisma.application.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "app-123" } }),
    );
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "student@example.com" },
    });

    expect(mockTx.user.create).toHaveBeenCalled();
    expect(mockTx.application.update).toHaveBeenCalled();
    expect(mockTx.applicationLog.create).toHaveBeenCalled();
    expect(sendStudentWelcomeEmail).toHaveBeenCalledWith(
      mockApplication,
      expect.any(String),
    );
  });

  it("should block non-admins from inviting", async () => {
    // Mock student session
    vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
      user: {
        id: "student-1",
        email: "student@example.com",
        role: "STUDENT",
      },
      expires: "123",
    });

    const request = new Request("http://localhost:3000/api/admin/invite", {
      method: "POST",
      body: JSON.stringify({ applicationId: "app-123" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.error).toContain("Insufficient permissions");
  });

  it("should block anonymous requests", async () => {
    // Mock no session
    vi.mocked(auth as Record<string, unknown>).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/admin/invite", {
      method: "POST",
      body: JSON.stringify({ applicationId: "app-123" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe("Unauthorized access");
  });

  it("should fail if user account already exists", async () => {
    // Mock admin session
    vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
      user: {
        id: "admin-1",
        email: "admin@npu.ac.th",
        role: "ADMIN",
      },
      expires: "123",
    });

    const mockApplication = {
      id: "app-123",
      email: "student@example.com",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
    };

    vi.mocked(prisma.application.findUnique).mockResolvedValue(
      mockApplication as Record<string, unknown>,
    );
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "existing-user-id",
      email: "student@example.com",
    } as Record<string, unknown>);

    const request = new Request("http://localhost:3000/api/admin/invite", {
      method: "POST",
      body: JSON.stringify({ applicationId: "app-123" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain("already exists");
  });
});
