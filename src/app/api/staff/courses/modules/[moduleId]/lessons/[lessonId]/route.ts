import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyStaff } from "@/lib/auth-guards";
import { z } from "zod";

const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
  type: z.enum(["VIDEO", "TEXT", "QUIZ"]).optional(),
  videoUrl: z.string().url().optional().nullable(),
  documentUrl: z.string().url().optional().nullable(),
  content: z.string().optional().nullable(),
  isPreview: z.boolean().optional(),
  dripDays: z.number().int().min(0).optional(),
});

type Params = { params: Promise<{ moduleId: string; lessonId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const authResult = await verifyStaff();
  if (!authResult.success) return authResult.response;

  const { moduleId, lessonId } = await params;
  const body = await request.json();
  const parsed = updateLessonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await prisma.lesson.findFirst({
    where: { id: lessonId, moduleId },
  });
  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Lesson not found" },
      { status: 404 },
    );
  }

  const updated = await prisma.lesson.update({
    where: { id: lessonId },
    data: parsed.data,
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const authResult = await verifyStaff();
  if (!authResult.success) return authResult.response;

  const { moduleId, lessonId } = await params;

  const existing = await prisma.lesson.findFirst({
    where: { id: lessonId, moduleId },
  });
  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Lesson not found" },
      { status: 404 },
    );
  }

  await prisma.lesson.delete({ where: { id: lessonId } });

  return NextResponse.json({ success: true, data: { id: lessonId } });
}
