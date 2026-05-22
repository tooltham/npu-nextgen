import { NextResponse } from "next/server";
import { verifyEnrollment } from "@/lib/auth-guards";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const authResult = await verifyEnrollment();
    if (!authResult.success) {
      return authResult.response;
    }

    const { user } = authResult;
    const body = await request.json();
    const { lessonId, isCompleted } = body;

    if (!lessonId || typeof isCompleted !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: lessonId and isCompleted",
        },
        { status: 400 },
      );
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId: user.id,
        lessonId,
        isCompleted,
      },
    });

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Failed to update lesson progress:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
