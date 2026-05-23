import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

// Cache buster comment for Turbopack
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุอีเมล" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // To prevent email enumeration, always return success even if user not found
    if (!user || !user.isActive) {
      return NextResponse.json({
        success: true,
        message:
          "หากอีเมลของคุณอยู่ในระบบ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปให้แล้ว",
      });
    }

    // Generate Token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Save token to DB
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // Send Email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.name || "ผู้ใช้งาน",
      token,
    );

    if (emailResult && !emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      // Still return success to user so they don't know it failed, but maybe log it
    }

    return NextResponse.json({
      success: true,
      message: "หากอีเมลของคุณอยู่ในระบบ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปให้แล้ว",
    });
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 },
    );
  }
}
