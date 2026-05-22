import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    const {
      title,
      type,
      videoUrl,
      documentUrl,
      content,
      isPreview,
      dripDays,
      order,
      moduleId,
    } = data;

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(documentUrl !== undefined && { documentUrl }),
        ...(content !== undefined && { content }),
        ...(isPreview !== undefined && { isPreview }),
        ...(dripDays !== undefined && { dripDays }),
        ...(order !== undefined && { order }),
        ...(moduleId !== undefined && { moduleId }),
      },
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error("PUT lesson error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE lesson error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
