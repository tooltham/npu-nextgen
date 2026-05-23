import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    enrollment: {
      findUnique: vi.fn(),
    },
  },
}));

import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import {
  verifyUserRole,
  verifyAdmin,
  verifyStaff,
  verifyStudent,
  verifyEnrollment,
} from "@/lib/auth-guards";
import { Role } from "@prisma/client";

describe("Auth Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("verifyUserRole", () => {
    it("should return 401 if not authenticated", async () => {
      (auth as any).mockResolvedValue(null);

      const result = await verifyUserRole([Role.ADMIN]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(401);
      }
    });

    it("should return 401 if user has no email", async () => {
      (auth as any).mockResolvedValue({ user: { id: "1" } });

      const result = await verifyUserRole([Role.ADMIN]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(401);
      }
    });

    it("should return 403 if role is not allowed", async () => {
      (auth as any).mockResolvedValue({
        user: { id: "1", email: "test@test.com", role: Role.STUDENT },
      });

      const result = await verifyUserRole([Role.ADMIN]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(403);
      }
    });

    it("should return success and user if role is allowed", async () => {
      (auth as any).mockResolvedValue({
        user: { id: "1", email: "test@test.com", role: Role.ADMIN },
      });

      const result = await verifyUserRole([Role.ADMIN]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.user).toEqual({
          id: "1",
          name: undefined,
          email: "test@test.com",
          role: Role.ADMIN,
        });
      }
    });
  });

  describe("Role specific guards", () => {
    it("verifyAdmin should allow only ADMIN", async () => {
      (auth as any).mockResolvedValue({
        user: { id: "1", email: "admin@test.com", role: Role.ADMIN },
      });
      const res1 = await verifyAdmin();
      expect(res1.success).toBe(true);

      (auth as any).mockResolvedValue({
        user: { id: "2", email: "staff@test.com", role: Role.STAFF },
      });
      const res2 = await verifyAdmin();
      expect(res2.success).toBe(false);
    });

    it("verifyStaff should allow STAFF and ADMIN", async () => {
      (auth as any).mockResolvedValue({
        user: { id: "1", email: "staff@test.com", role: Role.STAFF },
      });
      const res1 = await verifyStaff();
      expect(res1.success).toBe(true);

      (auth as any).mockResolvedValue({
        user: { id: "2", email: "student@test.com", role: Role.STUDENT },
      });
      const res2 = await verifyStaff();
      expect(res2.success).toBe(false);
    });

    it("verifyStudent should allow STUDENT and ADMIN", async () => {
      (auth as any).mockResolvedValue({
        user: { id: "1", email: "student@test.com", role: Role.STUDENT },
      });
      const res1 = await verifyStudent();
      expect(res1.success).toBe(true);
    });
  });

  describe("verifyEnrollment", () => {
    it("should bypass enrollment check for ADMIN", async () => {
      (auth as any).mockResolvedValue({
        user: { id: "1", email: "admin@test.com", role: Role.ADMIN },
      });

      const result = await verifyEnrollment();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.enrollment.status).toBe("ACTIVE");
      }
    });

    it("should return 403 if enrollment is missing", async () => {
      (auth as any).mockResolvedValue({
        user: {
          id: "student-1",
          email: "student@test.com",
          role: Role.STUDENT,
        },
      });
      (prisma.enrollment.findUnique as any).mockResolvedValue(null);

      const result = await verifyEnrollment();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(403);
      }
    });

    it("should return 403 if enrollment is not ACTIVE", async () => {
      (auth as any).mockResolvedValue({
        user: {
          id: "student-1",
          email: "student@test.com",
          role: Role.STUDENT,
        },
      });
      (prisma.enrollment.findUnique as any).mockResolvedValue({
        status: "SUSPENDED",
      });

      const result = await verifyEnrollment();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(403);
      }
    });

    it("should return enrollment if ACTIVE", async () => {
      (auth as any).mockResolvedValue({
        user: {
          id: "student-1",
          email: "student@test.com",
          role: Role.STUDENT,
        },
      });
      (prisma.enrollment.findUnique as any).mockResolvedValue({
        status: "ACTIVE",
        courseId: "course-1",
      });

      const result = await verifyEnrollment();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.enrollment.status).toBe("ACTIVE");
      }
    });
  });
});
