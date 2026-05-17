import { Resend } from "resend";
import { ApplicantConfirmationEmail } from "@/emails/ApplicantConfirmation";
import { AdminNotificationEmail } from "@/emails/AdminNotification";
import * as React from "react";
import { env } from "./env";

// Factory function to get Resend instance safely
const getResend = () => {
  const apiKey =
    env.RESEND_API_KEY || (process.env.NODE_ENV === "test" ? "re_123" : "");
  if (!apiKey && process.env.NODE_ENV !== "test") {
    return null;
  }
  return new Resend(apiKey);
};

const resend = getResend();

const maskNationalId = (id: string) => {
  if (!id || id.length < 13) return "X-XXXX-XXXXX-XX-X";
  return `${id[0]}-XXXX-XXXXX-${id.slice(10, 12)}-${id[12]}`;
};

export const sendApplicantConfirmation = async (application: any) => {
  if (!resend) return { success: false, error: "Email service not configured" };

  const maskedId = maskNationalId(application.nationalId);
  return await resend.emails.send({
    from: `NPU NextGen <${env.RESEND_FROM || "onboarding@resend.dev"}>`,
    to: [application.email],
    subject: `[ยืนยัน] รับใบสมัครของคุณแล้ว — หลักสูตรนักจัดการฟาร์มเกษตรอัจฉริยะ`,
    react: React.createElement(ApplicantConfirmationEmail, {
      name: `${application.firstNameTh} ${application.lastNameTh}`,
      applicationId: application.id,
      course:
        env.NEXT_PUBLIC_COURSE_NAME || "นักจัดการฟาร์มเกษตรแบบผสมผสานอัจฉริยะ",
      nationalId: maskedId,
    }),
  });
};

export const sendAdminNotification = async (application: any) => {
  if (!resend) return { success: false, error: "Email service not configured" };

  return await resend.emails.send({
    from: `NPU System <${env.RESEND_FROM || "system@resend.dev"}>`,
    to: [env.ADMIN_NOTIFY_EMAIL],
    subject: `[ใบสมัครใหม่] ${application.firstNameTh} ${application.lastNameTh} — NPU NextGen`,
    react: React.createElement(AdminNotificationEmail, {
      applicantName: `${application.firstNameTh} ${application.lastNameTh}`,
      applicationId: application.id,
    }),
  });
};
