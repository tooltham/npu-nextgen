import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total published lessons for percentage calculation
    const totalLessons = await prisma.lesson.count({
      where: {
        module: {
          status: "PUBLISHED",
        },
      },
    });

    const users = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        progress: {
          where: { isCompleted: true },
        },
        quizAttempts: true,
        application: {
          select: {
            firstNameTh: true,
            lastNameTh: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedUsers = users.map((user) => {
      const completedLessonsCount = user.progress.length;
      const progressPercentage =
        totalLessons > 0
          ? Math.round((completedLessonsCount / totalLessons) * 100)
          : 0;

      // Calculate avg quiz score? Or just count of attempts
      const totalQuizAttempts = user.quizAttempts.length;
      const correctQuizAttempts = user.quizAttempts.filter(
        (q) => q.isCorrect,
      ).length;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        firstName: user.application?.firstNameTh || "-",
        lastName: user.application?.lastNameTh || "-",
        phone: user.application?.phone || "-",
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        progressPercentage,
        completedLessonsCount,
        totalLessons,
        quizStats: {
          total: totalQuizAttempts,
          correct: correctQuizAttempts,
        },
      };
    });

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
