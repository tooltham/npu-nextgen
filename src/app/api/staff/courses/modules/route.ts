import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyStaff } from "@/lib/auth-guards";
import { z } from "zod";

const createModuleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  order: z.number().int().min(0),
  thumbnail: z.string().url().optional(),
});

export async function GET() {
  const authResult = await verifyStaff();
  if (!authResult.success) return authResult.response;

  const modules = await prisma.courseModule.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { lessons: true } },
    },
  });

  return NextResponse.json({ success: true, data: modules });
}

export async function POST(request: Request) {
  const authResult = await verifyStaff();
  if (!authResult.success) return authResult.response;

  const body = await request.json();
  const parsed = createModuleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const module = await prisma.courseModule.create({
    data: parsed.data,
  });

  return NextResponse.json({ success: true, data: module });
}
