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

    const isLessonFullyCompleted = (lesson: any) => {
      if (!isLessonCompleted(lesson.id)) return false;
      if (lesson.quizzes && lesson.quizzes.length > 0) {
        return lesson.quizzes.every((q: any) => isQuizPassed(q.id));
      }
      return true;
    };

    const isModuleFullyCompleted = (module: any) => {
      const allLessonsDone = module.lessons.every((l: any) =>
        isLessonFullyCompleted(l),
      );
      if (!allLessonsDone) return false;
      const submission = submissions.find((s) => s.moduleId === module.id);
      if (!submission) return false;
      return true;
    };

    if (!isModuleFullyCompleted(prevModule)) {
      redirect("/portal?error=module_locked");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50/50 flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shadow-sm">
                <Sprout className="w-4 h-4 text-[#1B5E20]" />
              </div>
              <span className="font-extrabold text-zinc-900 tracking-tight text-lg">
                NPU NextGen{" "}
                <span className="font-medium text-zinc-400">Classroom</span>
              </span>
            </div>

            <div className="w-px h-6 bg-zinc-200 hidden md:block"></div>

            <Link href="/portal">
              <Button
                variant="ghost"
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full pl-3 pr-4 h-9 flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="font-medium text-sm">กลับไปหน้าโมดูล</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
            <span>สวัสดี, {user.name || user.email.split("@")[0]}</span>
            <span className="px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-500 text-xs font-bold uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      {/* Main Student Portal View - Passing only the current module wrapped in array */}
      <ClassroomClient
        modules={[currentModule]}
        initialProgress={progress}
        initialQuizAttempts={attempts}
        initialSubmissions={submissions as any}
      />
    </main>
  );
}
