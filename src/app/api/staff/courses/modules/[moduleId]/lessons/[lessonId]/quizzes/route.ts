import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyStaff } from "@/lib/auth-guards";
import { z } from "zod";

const quizSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string()).min(2, "At least 2 options required"),
  correctIdx: z.number().int().min(0),
});

const putQuizzesSchema = z.object({
  quizzes: z.array(quizSchema),
});

type Params = { params: Promise<{ moduleId: string; lessonId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const authResult = await verifyStaff();
  if (!authResult.success) return authResult.response;

  const { moduleId, lessonId } = await params;

  // Ensure lesson belongs to module
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, moduleId },
  });

  if (!lesson) {
    return NextResponse.json(
      { success: false, error: "Lesson not found" },
      { status: 404 },
    );
  }

  const quizzes = await prisma.quiz.findMany({
    where: { lessonId },
    orderBy: { id: "asc" },
  });

  return NextResponse.json({ success: true, data: quizzes });
}

export async function PUT(request: Request, { params }: Params) {
  const authResult = await verifyStaff();
  if (!authResult.success) return authResult.response;

  const { moduleId, lessonId } = await params;

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, moduleId },
  });

  if (!lesson) {
    return NextResponse.json(
      { success: false, error: "Lesson not found" },
      { status: 404 },
    );
  }

  const body = await request.json();
  const parsed = putQuizzesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Delete existing and recreate in a transaction
  await prisma.$transaction([
    prisma.quiz.deleteMany({ where: { lessonId } }),
    prisma.quiz.createMany({
      data: parsed.data.quizzes.map((q) => ({
        lessonId,
        question: q.question,
        options: q.options,
        correctIdx: q.correctIdx,
      })),
    }),
  ]);

  const updatedQuizzes = await prisma.quiz.findMany({
    where: { lessonId },
    orderBy: { id: "asc" },
  });

  return NextResponse.json({ success: true, data: updatedQuizzes });
}
