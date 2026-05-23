import { redirect } from "next/navigation";
import Link from "next/link";
import { Sprout, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEnrollment } from "@/lib/auth-guards";
import prisma from "@/lib/db";
import ClassroomClient from "@/components/portal/ClassroomClient";

export const metadata = {
  title: "ห้องเรียนออนไลน์ | NPU NextGen",
  description:
    "ระบบ Smart Integrated Farm Manager Application System - Classroom Portal",
};

export default async function ClassroomPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const authResult = await verifyEnrollment();

  if (!authResult.success) {
    if (authResult.response.status === 403) {
      redirect("/portal/not-enrolled");
    }
    redirect("/admin/login");
  }

  const { user } = authResult;

  // Fetch ALL published modules to determine sequence and locking
  const modules = await prisma.courseModule.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          quizzes: true,
        },
      },
    },
  });

  const currentModuleIndex = modules.findIndex((m) => m.id === moduleId);

  if (currentModuleIndex === -1) {
    // Module not found
    redirect("/portal?error=module_not_found");
  }

  const currentModule = modules[currentModuleIndex];

  // Fetch user progress
  const progress = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
    select: {
      lessonId: true,
      isCompleted: true,
    },
  });

  // Fetch quiz attempts
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    select: {
      quizId: true,
      selectedIdx: true,
      isCorrect: true,
    },
  });

  // Fetch assignment submissions
  const submissions = await prisma.submission.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      moduleId: true,
      assignmentUrl: true,
      note: true,
      score: true,
      feedback: true,
      status: true,
    },
  });

  // --- Server-Side Module Guard ---
  if (currentModuleIndex > 0) {
    const prevModule = modules[currentModuleIndex - 1];

    const isQuizPassed = (quizId: string) => {
      return attempts.some((a) => a.quizId === quizId && a.isCorrect);
    };

    const isLessonCompleted = (lessonId: string) => {
      return progress.some((p) => p.lessonId === lessonId && p.isCompleted);
    };

    const isLessonFullyCompleted = (lesson: Record<string, unknown>) => {
      const lessonId = lesson.id as string;
      if (!isLessonCompleted(lessonId)) return false;
      const quizzes = lesson.quizzes as Record<string, unknown>[] | undefined;
      if (quizzes && quizzes.length > 0) {
        return quizzes.every((q) => isQuizPassed(q.id as string));
      }
      return true;
    };

    const isModuleFullyCompleted = (module: Record<string, unknown>) => {
      const lessons = module.lessons as Record<string, unknown>[];
      const allLessonsDone = lessons.every((l) => isLessonFullyCompleted(l));
      if (!allLessonsDone) return false;
      const submission = submissions.find(
        (s) => s.moduleId === (module.id as string),
      );
      if (!submission) return false;
      return true;
    };

    if (!isModuleFullyCompleted(prevModule)) {
      redirect("/portal?error=module_locked");
    }
  }

  // Format currentModule to safely cast options JsonValue into string[] for ClassroomClient
  const formattedModule = {
    ...currentModule,
    lessons: currentModule.lessons.map((lesson) => ({
      ...lesson,
      quizzes: lesson.quizzes.map((quiz) => ({
        ...quiz,
        options: Array.isArray(quiz.options) ? (quiz.options as string[]) : [],
      })),
    })),
  };

  return (
    <div className="flex flex-col w-full pt-6">
      {/* Main Student Portal View - Passing only the current module wrapped in array */}
      <ClassroomClient
        modules={[formattedModule]}
        initialProgress={progress}
        initialQuizAttempts={attempts}
        initialSubmissions={submissions as any}
      />
    </div>
  );
}
