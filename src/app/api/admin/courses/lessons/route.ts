import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const {
      moduleId,
      title,
      type,
      videoUrl,
      documentUrl,
      content,
      isPreview,
      dripDays,
    } = data;

    if (!moduleId || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get max order in this module
    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: "desc" },
    });
    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    const newLesson = await prisma.lesson.create({
      data: {
        moduleId,
        title,
        order: nextOrder,
        type: type || "VIDEO",
        videoUrl: videoUrl || null,
        documentUrl: documentUrl || null,
        content: content || null,
        isPreview: isPreview || false,
        dripDays: dripDays || 0,
      },
    });

    return NextResponse.json(newLesson);
  } catch (error) {
    console.error("POST lesson error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
