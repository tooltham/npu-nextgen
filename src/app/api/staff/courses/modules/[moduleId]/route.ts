import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyStaff } from "@/lib/auth-guards";
import { z } from "zod";

const updateModuleSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
  thumbnail: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

type Params = { params: Promise<{ moduleId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const authResult = await verifyStaff();
  if (!authResult.success) return authResult.response;

  const { moduleId } = await params;
  const body = await request.json();
  const parsed = updateModuleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await prisma.courseModule.findUnique({
    where: { id: moduleId },
  });
  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Module not found" },
      { status: 404 },
    );
  }

  const updated = await prisma.courseModule.update({
    where: { id: moduleId },
    data: parsed.data,
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const authResult = await verifyStaff();
  if (!authResult.success) return authResult.response;

  const { moduleId } = await params;

  const existing = await prisma.courseModule.findUnique({
    where: { id: moduleId },
  });
  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Module not found" },
      { status: 404 },
    );
  }

  await prisma.courseModule.delete({ where: { id: moduleId } });

  return NextResponse.json({ success: true, data: { id: moduleId } });
}
