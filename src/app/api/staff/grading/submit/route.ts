import { NextResponse } from "next/server";
import { verifyStaff } from "@/lib/auth-guards";
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

export async function POST(request: Request) {
  try {
    const authResult = await verifyStaff();
    if (!authResult.success) {
      return authResult.response;
    }

    const { user } = authResult;
    const body = await request.json();
    const { submissionId, score, feedback, status } = body;

    if (!submissionId || typeof score !== "number" || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: submissionId, score, and status",
        },
        { status: 400 },
      );
    }

    if (status !== "PASS" && status !== "FAIL") {
      return NextResponse.json(
        { success: false, error: "Invalid status value. Must be PASS or FAIL" },
        { status: 400 },
      );
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        score,
        feedback,
        status,
        gradedById: user.id,
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
