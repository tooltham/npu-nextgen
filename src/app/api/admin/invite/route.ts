import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAdmin } from "@/lib/auth-guards";
import bcrypt from "bcryptjs";
import { sendStudentWelcomeEmail } from "@/lib/email";

// Helper to generate a random 10-char password containing upper, lower, numbers, and some special symbols
function generateTempPassword(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export async function POST(request: Request) {
  // 1. Verify admin role
  const guard = await verifyAdmin();
  if (!guard.success) {
    return guard.response;
  }

  try {
    const { applicationId } = await request.json();
    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "Missing applicationId" },
        { status: 400 },
      );
    }

    // 2. Fetch the application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 },
      );
    }

    // Check if a Student account already exists for this email
    const existingUser = await prisma.user.findUnique({
      where: { email: application.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User account with this email already exists",
        },
        { status: 400 },
      );
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 3. Database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create student User account and Enrollment
      const newUser = await tx.user.create({
        data: {
          email: application.email,
          name: `${application.firstNameTh} ${application.lastNameTh}`,
          passwordHash: hashedPassword,
          role: "STUDENT",
          applicationId: application.id,
          isActive: true,
          mustChangePassword: true,
          enrollment: {
            create: {
              status: "ACTIVE",
            },
          },
        },
      });

      // Update Application status
      await tx.application.update({
        where: { id: applicationId },
        data: {
          status: "ACCEPTED",
          isAcceptanceEmailSent: true,
        },
      });

      // Add log
      await tx.applicationLog.create({
        data: {
          applicationId,
          adminEmail: guard.user.email,
          action: "STATUS_CHANGE",
          details: `อนุมัติเข้าเรียนและลงทะเบียนบัญชีนักศึกษาใหม่ (เชิญเข้าสู่ระบบ)`,
        },
      });

      return newUser;
    });

    // 4. Send email notification (outside transaction to avoid blocking DB connection)
    try {
      await sendStudentWelcomeEmail(application, tempPassword);
    } catch (emailErr) {
      console.error("Failed to send student welcome email:", emailErr);
      // We don't throw here to ensure DB transaction remains committed
    }

    return NextResponse.json({
      success: true,
      message: "Student invited successfully",
      data: {
        userId: result.id,
        email: result.email,
        role: result.role,
      },
    });
  } catch (error: unknown) {
    console.error("Invite error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          (error instanceof Error ? error.message : String(error)) ||
          "Internal server error",
      },
      { status: 500 },
    );
  }
}
