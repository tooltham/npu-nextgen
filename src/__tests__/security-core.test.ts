import { describe, it, expect, vi, beforeEach } from "vitest";

// 1. Mock @prisma/client first to expose Role and GradeStatus Enums safely
vi.mock("@prisma/client", () => ({
  Role: {
    ADMIN: "ADMIN",
    STAFF: "STAFF",
    STUDENT: "STUDENT",
  },
  GradeStatus: {
    PENDING: "PENDING",
    PASS: "PASS",
    FAIL: "FAIL",
  },
}));

// Import after mock
import { Role } from "@prisma/client";

// 2. Mock NextAuth route auth helper
vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  auth: vi.fn(),
}));

// 3. Mock Prisma Client instance
vi.mock("@/lib/db", () => ({
  default: {
    adminUser: {
      findMany: vi.fn(),
    },
    user: {
      upsert: vi.fn(),
    },
  },
}));

import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { verifyAdmin, verifyStaff, verifyStudent } from "@/lib/auth-guards";
import { migrateAdminUsers } from "@/prisma/migration-script";

describe("Security Core & RBAC Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Server-Side Auth Guards (auth-guards.ts)", () => {
    it("should block unauthenticated sessions with 401 Unauthorized", async () => {
      // Mock no session
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue(null);

      const adminGuard = await verifyAdmin();
      expect(adminGuard.success).toBe(false);
      if (!adminGuard.success) {
        expect(adminGuard.response.status).toBe(401);
        const data = await adminGuard.response.json();
        expect(data.error).toBe("Unauthorized access");
      }
    });

    it("should block student from accessing admin route with 403 Forbidden", async () => {
      // Mock student session
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "student-1",
          email: "student@example.com",
          role: Role.STUDENT,
        },
        expires: "123",
      });

      const adminGuard = await verifyAdmin();
      expect(adminGuard.success).toBe(false);
      if (!adminGuard.success) {
        expect(adminGuard.response.status).toBe(403);
        const data = await adminGuard.response.json();
        expect(data.error).toContain("Insufficient permissions");
      }
    });

    it("should allow admin to access admin route", async () => {
      // Mock admin session
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "admin-1",
          email: "admin@npu.ac.th",
          role: Role.ADMIN,
        },
        expires: "123",
      });

      const adminGuard = await verifyAdmin();
      expect(adminGuard.success).toBe(true);
      if (adminGuard.success) {
        expect(adminGuard.user.role).toBe(Role.ADMIN);
        expect(adminGuard.user.email).toBe("admin@npu.ac.th");
      }
    });

    it("should allow staff to access staff route, but block student", async () => {
      // Mock staff session
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "staff-1",
          email: "staff@npu.ac.th",
          role: Role.STAFF,
        },
        expires: "123",
      });

      const staffGuard = await verifyStaff();
      expect(staffGuard.success).toBe(true);
      if (staffGuard.success) {
        expect(staffGuard.user.role).toBe(Role.STAFF);
      }

      // Mock student session
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "student-1",
          email: "student@example.com",
          role: Role.STUDENT,
        },
        expires: "123",
      });

      const staffGuardForStudent = await verifyStaff();
      expect(staffGuardForStudent.success).toBe(false);
    });

    it("should allow student and admin to access student route, but block staff", async () => {
      // Mock student session
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "student-1",
          email: "student@example.com",
          role: Role.STUDENT,
        },
        expires: "123",
      });

      const studentGuard = await verifyStudent();
      expect(studentGuard.success).toBe(true);

      // Mock staff session
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "staff-1",
          email: "staff@npu.ac.th",
          role: Role.STAFF,
        },
        expires: "123",
      });

      const studentGuardForStaff = await verifyStudent();
      expect(studentGuardForStaff.success).toBe(false);
    });
  });

  describe("Admin User Data Migration (migration-script.ts)", () => {
    it("should successfully migrate legacy admin users to the new User table", async () => {
      // Mock legacy database records
      const mockLegacyAdmins = [
        {
          id: "1",
          email: "admin1@npu.ac.th",
          passwordHash: "hash1",
          createdAt: new Date(),
        },
        {
          id: "2",
          email: "admin2@npu.ac.th",
          passwordHash: "hash2",
          createdAt: new Date(),
        },
      ];

      vi.mocked(prisma.adminUser.findMany).mockResolvedValue(mockLegacyAdmins);
      vi.mocked(prisma.user.upsert).mockResolvedValue(
        {} as Record<string, unknown>,
      );

      const result = await migrateAdminUsers();

      expect(result.success).toBe(true);
      expect(result.migratedCount).toBe(2);
      expect(prisma.adminUser.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.user.upsert).toHaveBeenCalledTimes(2);

      // Verify arguments passed to upsert
      expect(prisma.user.upsert).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          where: { email: "admin1@npu.ac.th" },
          create: expect.objectContaining({
            email: "admin1@npu.ac.th",
            passwordHash: "hash1",
            role: Role.ADMIN,
          }),
        }),
      );
    });

    it("should handle empty admin user table gracefully", async () => {
      vi.mocked(prisma.adminUser.findMany).mockResolvedValue([]);

      const result = await migrateAdminUsers();

      expect(result.success).toBe(true);
      expect(result.migratedCount).toBe(0);
      expect(prisma.user.upsert).not.toHaveBeenCalled();
    });
  });
});
