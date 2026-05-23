import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@prisma/client", () => ({
  Role: {
    ADMIN: "ADMIN",
    STAFF: "STAFF",
    STUDENT: "STUDENT",
  },
}));

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    lessonProgress: {
      upsert: vi.fn(),
    },
    quiz: {
      findUnique: vi.fn(),
    },
    quizAttempt: {
      create: vi.fn(),
    },
    enrollment: {
      findUnique: vi.fn().mockResolvedValue({ status: "ACTIVE" }),
    },
  },
}));

import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { POST as progressPOST } from "@/app/api/portal/progress/route";
import { POST as quizSubmitPOST } from "@/app/api/portal/quiz/submit/route";

describe("LMS Portal Classroom & Assessment Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/portal/progress", () => {
    it("should successfully update lesson progress for authorized STUDENT", async () => {
      // Mock student session
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "student-123",
          email: "student@example.com",
          role: "STUDENT",
        },
        expires: "123",
      });

      const mockProgress = {
        id: "progress-id",
        userId: "student-123",
        lessonId: "lesson-999",
        isCompleted: true,
        updatedAt: new Date(),
      };

      vi.mocked(prisma.lessonProgress.upsert).mockResolvedValue(
        mockProgress as Record<string, unknown>,
      );

      const request = new Request("http://localhost:3000/api/portal/progress", {
        method: "POST",
        body: JSON.stringify({ lessonId: "lesson-999", isCompleted: true }),
      });

      const response = await progressPOST(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.lessonId).toBe("lesson-999");
      expect(json.data.isCompleted).toBe(true);

      expect(prisma.lessonProgress.upsert).toHaveBeenCalledWith({
        where: {
          userId_lessonId: {
            userId: "student-123",
            lessonId: "lesson-999",
          },
        },
        update: { isCompleted: true },
        create: {
          userId: "student-123",
          lessonId: "lesson-999",
          isCompleted: true,
        },
      });
    });

    it("should block anonymous users from updating progress", async () => {
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue(null);

      const request = new Request("http://localhost:3000/api/portal/progress", {
        method: "POST",
        body: JSON.stringify({ lessonId: "lesson-999", isCompleted: true }),
      });

      const response = await progressPOST(request);
      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toBe("Unauthorized access");
    });
  });

  describe("POST /api/portal/quiz/submit", () => {
    it("should process correct answer and save quiz attempt", async () => {
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "student-123",
          email: "student@example.com",
          role: "STUDENT",
        },
        expires: "123",
      });

      const mockQuiz = {
        id: "quiz-555",
        lessonId: "lesson-999",
        question: "1+1=?",
        options: ["1", "2", "3", "4"],
        correctIdx: 1,
      };

      const mockAttempt = {
        id: "attempt-777",
        userId: "student-123",
        quizId: "quiz-555",
        selectedIdx: 1,
        isCorrect: true,
        attemptedAt: new Date(),
      };

      vi.mocked(prisma.quiz.findUnique).mockResolvedValue(
        mockQuiz as Record<string, unknown>,
      );
      vi.mocked(prisma.quizAttempt.create).mockResolvedValue(
        mockAttempt as Record<string, unknown>,
      );

      const request = new Request(
        "http://localhost:3000/api/portal/quiz/submit",
        {
          method: "POST",
          body: JSON.stringify({ quizId: "quiz-555", selectedIdx: 1 }),
        },
      );

      const response = await quizSubmitPOST(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.isCorrect).toBe(true);
      expect(json.data.correctIdx).toBe(1);
      expect(json.data.attemptId).toBe("attempt-777");

      expect(prisma.quiz.findUnique).toHaveBeenCalledWith({
        where: { id: "quiz-555" },
      });
      expect(prisma.quizAttempt.create).toHaveBeenCalledWith({
        data: {
          userId: "student-123",
          quizId: "quiz-555",
          selectedIdx: 1,
          isCorrect: true,
        },
      });
    });

    it("should handle incorrect answers properly", async () => {
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "student-123",
          email: "student@example.com",
          role: "STUDENT",
        },
        expires: "123",
      });

      const mockQuiz = {
        id: "quiz-555",
        lessonId: "lesson-999",
        question: "1+1=?",
        options: ["1", "2", "3", "4"],
        correctIdx: 1,
      };

      const mockAttempt = {
        id: "attempt-778",
        userId: "student-123",
        quizId: "quiz-555",
        selectedIdx: 2,
        isCorrect: false,
        attemptedAt: new Date(),
      };

      vi.mocked(prisma.quiz.findUnique).mockResolvedValue(
        mockQuiz as Record<string, unknown>,
      );
      vi.mocked(prisma.quizAttempt.create).mockResolvedValue(
        mockAttempt as Record<string, unknown>,
      );

      const request = new Request(
        "http://localhost:3000/api/portal/quiz/submit",
        {
          method: "POST",
          body: JSON.stringify({ quizId: "quiz-555", selectedIdx: 2 }),
        },
      );

      const response = await quizSubmitPOST(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.isCorrect).toBe(false);
      expect(json.data.correctIdx).toBe(1);
    });

    it("should return 404 if quiz is not found", async () => {
      vi.mocked(auth as Record<string, unknown>).mockResolvedValue({
        user: {
          id: "student-123",
          email: "student@example.com",
          role: "STUDENT",
        },
        expires: "123",
      });

      vi.mocked(prisma.quiz.findUnique).mockResolvedValue(null);

      const request = new Request(
        "http://localhost:3000/api/portal/quiz/submit",
        {
          method: "POST",
          body: JSON.stringify({ quizId: "quiz-absent", selectedIdx: 0 }),
        },
      );

      const response = await quizSubmitPOST(request);
      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json.error).toBe("Quiz not found");
    });
  });
});
