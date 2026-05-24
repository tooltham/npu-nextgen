import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// Helper to check and issue certificate if student passed all modules
async function checkAndIssueCertificate(userId: string): Promise<boolean> {
  const totalModules = await prisma.courseModule.count();
  const passedSubmissions = await prisma.submission.count({
    where: {
      userId,
      status: "PASS",
    },
  });

  if (totalModules > 0 && passedSubmissions >= totalModules) {
    const existingCert = await prisma.certificate.findUnique({
      where: { userId },
    });

    if (!existingCert) {
      await prisma.certificate.create({
        data: {
          userId,
          certUrl: `/certs/certificate-${userId}.pdf`,
        },
      });
      return true;
    }
  }
  return false;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role;
    if (!session || (userRole !== "ADMIN" && userRole !== "STAFF")) {
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
    const graderId = (session.user as { id?: string; role?: string }).id;

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: numScore,
        feedback: feedback || null,
        status: status,
        gradedById: graderId === "dev-admin-id" ? null : graderId,
        gradedAt: new Date(),
      },
    });

    let isCertificateIssued = false;
    if (status === "PASS") {
      isCertificateIssued = await checkAndIssueCertificate(
        updatedSubmission.userId,
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSubmission,
      isCertificateIssued,
    });
  } catch (error) {
    console.error("Failed to grade submission:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
