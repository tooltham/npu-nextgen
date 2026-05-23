import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user || !(session.user as any).id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = (session.user as any).id;
  const body = await request.json();
  const { oldPassword, newPassword } = body;

  if (!oldPassword) {
    return NextResponse.json(
      { success: false, error: "กรุณาระบุรหัสผ่านปัจจุบัน" },
      { status: 400 },
    );
  }

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { success: false, error: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบบัญชีผู้ใช้ หรือบัญชีนี้ไม่ได้ใช้รหัสผ่าน",
        },
        { status: 400 },
      );
    }

    const isValidOldPassword = await bcrypt.compare(
      oldPassword,
      user.passwordHash,
    );
    if (!isValidOldPassword) {
      return NextResponse.json(
        { success: false, error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
        mustChangePassword: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to update password: ${error?.message || String(error)}`,
      },
      { status: 500 },
    );
  }
}
