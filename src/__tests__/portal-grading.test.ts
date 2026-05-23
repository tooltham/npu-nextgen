import { describe, it, expect, vi, beforeEach } from "vitest";

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

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    courseModule: {
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    submission: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    certificate: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    enrollment: {
      findUnique: vi.fn().mockResolvedValue({ status: "ACTIVE" }),
    },
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: "https://mock-supabase.com/file.pdf" },
        }),
      }),
    },
  },
}));

import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { POST as studentSubmitPOST } from "@/app/api/portal/submission/submit/route";
import { POST as staffGradePOST } from "@/app/api/staff/grading/submit/route";

describe("LMS Portal Grading & Certificate Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/portal/submission/submit (Student submission)", () => {
    it("should successfully create new submission for authorized student", async () => {
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "student-1",
          email: "student@example.com",
          role: "STUDENT",
        },
        expires: "999",
      });

      vi.mocked(prisma.courseModule.findUnique).mockResolvedValue({
        id: "module-1",
      } as Record<string, unknown>);
      vi.mocked(prisma.submission.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.submission.create).mockResolvedValue({
        id: "submission-1",
        userId: "student-1",
        moduleId: "module-1",
        assignmentUrl: "https://mock-supabase.com/file.pdf",
        status: "PENDING",
      } as Record<string, unknown>);

      const formData = new FormData();
      formData.append("moduleId", "module-1");
      formData.append("note", "My smart farm notes");
      const file = new File(["test content"], "test.pdf", {
        type: "application/pdf",
      });
      formData.append("file", file);

      const request = new Request(
        "http://localhost:3000/api/portal/submission/submit",
        {
          method: "POST",
          body: formData,
        },
      );

      const response = await studentSubmitPOST(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toBe("submission-1");
      expect(prisma.submission.create).toHaveBeenCalled();
    });

    it("should update and reset status to PENDING for existing submission", async () => {
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "student-1",
          email: "student@example.com",
          role: "STUDENT",
        },
        expires: "999",
      });

      vi.mocked(prisma.courseModule.findUnique).mockResolvedValue({
        id: "module-1",
      } as Record<string, unknown>);
      vi.mocked(prisma.submission.findFirst).mockResolvedValue({
        id: "submission-existing",
        status: "FAIL",
      } as Record<string, unknown>);
      vi.mocked(prisma.submission.update).mockResolvedValue({
        id: "submission-existing",
        status: "PENDING",
      } as Record<string, unknown>);

      const formData = new FormData();
      formData.append("moduleId", "module-1");
      const file = new File(["test content 2"], "updated.pdf", {
        type: "application/pdf",
      });
      formData.append("file", file);

      const request = new Request(
        "http://localhost:3000/api/portal/submission/submit",
        {
          method: "POST",
          body: formData,
        },
      );

      const response = await studentSubmitPOST(request);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.status).toBe("PENDING");
      expect(prisma.submission.update).toHaveBeenCalled();
    });

    it("should block non-student from submitting", async () => {
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: { id: "staff-1", email: "staff@example.com", role: "STAFF" },
      });

      const formData = new FormData();
      formData.append("moduleId", "module-1");
      const file = new File(["test"], "test.pdf", { type: "application/pdf" });
      formData.append("file", file);

      const request = new Request(
        "http://localhost:3000/api/portal/submission/submit",
        {
          method: "POST",
          body: formData,
        },
      );

      const response = await studentSubmitPOST(request);
      expect(response.status).toBe(403);
    });
  });

  describe("POST /api/staff/grading/submit (Staff grading)", () => {
    it("should successfully grade submission and NOT issue cert if modules not complete", async () => {
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: { id: "staff-1", email: "staff@example.com", role: "STAFF" },
      });

      vi.mocked(prisma.submission.update).mockResolvedValue({
        id: "submission-1",
        userId: "student-1",
        status: "PASS",
      } as Record<string, unknown>);

      vi.mocked(prisma.courseModule.count).mockResolvedValue(3);
      vi.mocked(prisma.submission.count).mockResolvedValue(2); // Passed 2 out of 3

      const request = new Request(
        "http://localhost:3000/api/staff/grading/submit",
        {
          method: "POST",
          body: JSON.stringify({
            submissionId: "submission-1",
            score: 85,
            feedback: "Excellent layout",
            status: "PASS",
          }),
        },
      );

      const response = await staffGradePOST(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.isCertificateIssued).toBe(false);
    });

    it("should issue certificate when student completes all course modules with PASS status", async () => {
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: { id: "staff-1", email: "staff@example.com", role: "STAFF" },
      });

      vi.mocked(prisma.submission.update).mockResolvedValue({
        id: "submission-final",
        userId: "student-1",
        status: "PASS",
      } as Record<string, unknown>);

      vi.mocked(prisma.courseModule.count).mockResolvedValue(3);
      vi.mocked(prisma.submission.count).mockResolvedValue(3); // Complete!
      vi.mocked(prisma.certificate.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.certificate.create).mockResolvedValue(
        {} as Record<string, unknown>,
      );

      const request = new Request(
        "http://localhost:3000/api/staff/grading/submit",
        {
          method: "POST",
          body: JSON.stringify({
            submissionId: "submission-final",
            score: 95,
            feedback: "Congratulations on finishing!",
            status: "PASS",
          }),
        },
      );

      const response = await staffGradePOST(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.isCertificateIssued).toBe(true);

      expect(prisma.certificate.create).toHaveBeenCalledWith({
        data: {
          userId: "student-1",
          certUrl: "/certs/certificate-student-1.pdf",
        },
      });
    });

    it("should reject student trying to grade submissions", async () => {
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "student-1",
          email: "student@example.com",
          role: "STUDENT",
        },
      });

      const request = new Request(
        "http://localhost:3000/api/staff/grading/submit",
        {
          method: "POST",
          body: JSON.stringify({
            submissionId: "sub-1",
            score: 100,
            status: "PASS",
          }),
        },
      );

      const response = await staffGradePOST(request);
      expect(response.status).toBe(403);
    });
  });
});
