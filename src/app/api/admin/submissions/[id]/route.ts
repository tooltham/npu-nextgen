import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id: submissionId } = await params;
    const body = await request.json();
    const { score, feedback } = body;

    if (score === undefined || score === null || isNaN(Number(score))) {
      return NextResponse.json(
        { success: false, error: "Invalid score" },
        { status: 400 },
      );
    }

    const numScore = Number(score);
    const status = numScore >= 70 ? "PASS" : "FAIL";

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: numScore,
        feedback: feedback || null,
        status: status,
        gradedById: (session.user as any).id,
        gradedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: updatedSubmission });
  } catch (error) {
    console.error("Failed to grade submission:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
