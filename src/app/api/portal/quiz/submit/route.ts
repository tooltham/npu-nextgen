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
    const { quizId, selectedIdx } = body;

    if (!quizId || typeof selectedIdx !== "number") {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: quizId and selectedIdx",
        },
        { status: 400 },
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 },
      );
    }

    const isCorrect = quiz.correctIdx === selectedIdx;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId,
        selectedIdx,
        isCorrect,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        correctIdx: quiz.correctIdx,
        attemptId: attempt.id,
      },
    });
  } catch (error) {
    console.error("Failed to submit quiz attempt:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
