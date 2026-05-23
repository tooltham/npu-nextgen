import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string; role?: string }).id;

    // 1. Get all published modules and their lessons/quizzes
    const publishedModules = await prisma.courseModule.findMany({
      where: { status: "PUBLISHED" },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          include: { quizzes: true },
        },
      },
      orderBy: { order: "asc" },
    });

    let totalLessons = 0;
    const orderedLessons: Record<string, unknown>[] = [];

    publishedModules.forEach((mod) => {
      totalLessons += mod.lessons.length;
      mod.lessons.forEach((lesson) =>
        orderedLessons.push({ ...lesson, moduleTitle: mod.title }),
      );
    });

    // 2. Get user's progress, attempts, submissions
    const userProgress = await prisma.lessonProgress.findMany({
      where: { userId },
    });
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
    });
    const submissions = await prisma.submission.findMany({
      where: { userId },
    });

    const completedLessonIds = new Set(
      userProgress.filter((p) => p.isCompleted).map((p) => p.lessonId),
    );
    const completedCount = completedLessonIds.size;
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Evaluate Module Locking
    const isQuizPassed = (quizId: string) => {
      return quizAttempts.some((a) => a.quizId === quizId && a.isCorrect);
    };

    const isLessonFullyCompleted = (lesson: Record<string, unknown>) => {
      const lessonId = lesson.id as string;
      if (!completedLessonIds.has(lessonId)) return false;
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

    const modulesData = publishedModules.map((mod, index) => {
      let isLocked = false;
      if (index > 0) {
        const prevModule = publishedModules[index - 1];
        isLocked = !isModuleFullyCompleted(prevModule);
      }
      return {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessonCount: mod.lessons.length,
        isLocked,
        isCompleted: isModuleFullyCompleted(mod),
      };
    });

    // 3. Calculate Hours and Scores
    let theoryTotal = 0;
    let practicalTotal = 0;
    let theoryCompleted = 0;
    let practicalCompleted = 0;

    publishedModules.forEach((mod) => {
      mod.lessons.forEach((lesson) => {
        const tHours = (lesson as any).theoryHours || 0;
        const pHours = (lesson as any).practicalHours || 0;
        theoryTotal += tHours;
        practicalTotal += pHours;

        if (completedLessonIds.has(lesson.id)) {
          theoryCompleted += tHours;
          practicalCompleted += pHours;
        }
      });
    });

    // Fallback if DB not seeded yet
    if (theoryTotal === 0 && practicalTotal === 0) {
      theoryTotal = 45;
      practicalTotal = 240;
      theoryCompleted =
        totalLessons > 0 ? Math.round((completedCount / totalLessons) * 45) : 0;
      practicalCompleted =
        totalLessons > 0
          ? Math.round((completedCount / totalLessons) * 240)
          : 0;
    }

    const projectScores = publishedModules.map((mod) => {
      const sub = submissions.find((s) => s.moduleId === mod.id);
      return {
        module:
          mod.title.length > 15
            ? mod.title.substring(0, 15) + "..."
            : mod.title,
        score: sub?.score || 0,
        threshold: 70,
        fullMark: 100,
      };
    });

    // 4. Find the next lesson to resume
    let nextLesson = null;
    for (const lesson of orderedLessons) {
      if (!completedLessonIds.has((lesson as any).id)) {
        nextLesson = lesson;
        break;
      }
    }

    // 5. Evaluate Course Completion (Requires ALL submissions to be PASS)
    const isCourseCompleted =
      publishedModules.length > 0 &&
      publishedModules.every((mod) => {
        const hasPassedSubmission = submissions.some(
          (s) => s.moduleId === mod.id && s.status === "PASS",
        );
        return hasPassedSubmission;
      });

    return NextResponse.json({
      userName: session.user.name || session.user.email,
      totalModules: publishedModules.length,
      totalLessons,
      completedCount,
      progressPercentage,
      modules: modulesData,
      isCourseCompleted,
      hoursData: {
        theoryCompleted,
        theoryTotal,
        practicalCompleted,
        practicalTotal,
      },
      projectScores,
      nextLesson: nextLesson
        ? {
            id: (nextLesson as any).id,
            moduleId: (nextLesson as any).moduleId,
            title: (nextLesson as any).title,
            moduleTitle: (nextLesson as any).moduleTitle,
            type: (nextLesson as any).type,
          }
        : null,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
