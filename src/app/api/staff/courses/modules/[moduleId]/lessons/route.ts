import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyStaff } from "@/lib/auth-guards";
import { z } from "zod";

const createLessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  order: z.number().int().min(0),
  type: z.enum(["VIDEO", "TEXT", "QUIZ"]).default("VIDEO"),
  videoUrl: z.string().url().optional().nullable(),
  documentUrl: z.string().url().optional().nullable(),
  content: z.string().optional().nullable(),
  isPreview: z.boolean().default(false),
  dripDays: z.number().int().min(0).default(0),
});

type Params = { params: Promise<{ moduleId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const authResult = await verifyStaff();
  if (!authResult.success) return authResult.response;

  const { moduleId } = await params;

  const lessons = await prisma.lesson.findMany({
    where: { moduleId },
    orderBy: { order: "asc" },
    include: { _count: { select: { quizzes: true } } },
  });

  return NextResponse.json({ success: true, data: lessons });
}

export async function POST(request: Request, { params }: Params) {
  const authResult = await verifyStaff();
  if (!authResult.success) return authResult.response;

  const { moduleId } = await params;

  const moduleExists = await prisma.courseModule.findUnique({
    where: { id: moduleId },
  });
  if (!moduleExists) {
    return NextResponse.json(
      { success: false, error: "Module not found" },
      { status: 404 },
    );
  }

  const body = await request.json();
  const parsed = createLessonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const lesson = await prisma.lesson.create({
    data: { ...parsed.data, moduleId },
  });

  return NextResponse.json({ success: true, data: lesson });
}
