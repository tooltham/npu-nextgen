import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { applicationSchema } from "@/schemas/applicationSchema";
import { encrypt } from "@/lib/encrypt";
import { sanitizeThaiId } from "@/lib/id-validator";
import { ratelimit, shouldBypassRateLimit } from "@/lib/ratelimit";
import { sendApplicantConfirmation, sendAdminNotification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    if (!shouldBypassRateLimit() && ratelimit) {
      const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many requests. Please try again later.",
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          },
        );
      }
    }

    const body = await req.json();

    // 2. Server-side validation with Zod
    const result = applicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    const { personalInfo, background, readiness, consent } = result.data;

    // 3. Sanitize and Encrypt sensitive data
    const sanitizedId = sanitizeThaiId(personalInfo.nationalId);
    const encryptedId = encrypt(sanitizedId);

    // 4. Atomic Transaction: Application + Consent
    const application = await prisma.$transaction(async (tx) => {
      // Check for duplicate email
      const existing = await tx.application.findUnique({
        where: { email: personalInfo.email },
      });

      if (existing) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      return await tx.application.create({
        data: {
          ...personalInfo,
          nationalId: encryptedId,
          ...background,
          ...readiness,
          ipAddress: req.headers.get("x-forwarded-for") || "unknown",
          userAgent: req.headers.get("user-agent"),
          consent: {
            create: {
              granted: Boolean(consent.granted),
              consentText: consent.consentText,
              consentVersion: consent.consentVersion,
              ipAddress: req.headers.get("x-forwarded-for") || "unknown",
            },
          },
        },
      });
    });

    // 5. Async Email Notification (Non-blocking)
    // We use Promise.allSettled to ensure failure in one doesn't crash the response
    Promise.allSettled([
      sendApplicantConfirmation({
        ...application,
        nationalId: personalInfo.nationalId,
      }),
      sendAdminNotification(application),
    ]).catch((err) => console.error("Email notification failed:", err));

    return NextResponse.json(
      { success: true, id: application.id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Submission error:", error);

    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json(
        {
          success: false,
          error:
            "อีเมลนี้ได้ถูกใช้สมัครไปแล้ว กรุณาใช้อีเมลอื่น หรือติดต่อผู้ดูแลระบบ",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
