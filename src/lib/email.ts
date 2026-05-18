import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { ApplicantConfirmationEmail } from "@/emails/ApplicantConfirmation";
import { AdminNotificationEmail } from "@/emails/AdminNotification";
import * as React from "react";
import { env } from "./env";

// Factory function to get Nodemailer transporter
const getTransporter = () => {
  const user = env.SMTP_USER || process.env.SMTP_USER;
  const pass = env.SMTP_PASS || process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("SMTP credentials missing. Email service not configured.");
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST || "smtp.gmail.com",
    port: Number(env.SMTP_PORT) || 465,
    secure: env.SMTP_SECURE === "true" || env.SMTP_SECURE === true || true, // true for 465, false for other ports
    auth: {
      user: user,
      pass: pass,
    },
  });
};

const transporter = getTransporter();

const maskNationalId = (id: string) => {
  if (!id || id.length < 13) return "X-XXXX-XXXXX-XX-X";
  return `${id[0]}-XXXX-XXXXX-${id.slice(10, 12)}-${id[12]}`;
};

export const sendApplicantConfirmation = async (application: any) => {
  if (!transporter)
    return { success: false, error: "Email service not configured" };

  const maskedId = maskNationalId(application.nationalId);
  const emailHtml = await render(
    React.createElement(ApplicantConfirmationEmail, {
      name: `${application.firstNameTh} ${application.lastNameTh}`,
      applicationId: application.id,
      course:
        env.NEXT_PUBLIC_COURSE_NAME || "นักจัดการฟาร์มเกษตรแบบผสมผสานอัจฉริยะ",
      nationalId: maskedId,
    }),
  );

  try {
    const info = await transporter.sendMail({
      from: `"NPU NextGen" <${env.SMTP_USER}>`,
      to: application.email,
      subject: `[ยืนยัน] รับใบสมัครของคุณแล้ว — หลักสูตรนักจัดการฟาร์มเกษตรอัจฉริยะ`,
      html: emailHtml,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Failed to send applicant confirmation email:", error);
    return { success: false, error: error.message };
  }
};

export const sendAdminNotification = async (application: any) => {
  if (!transporter)
    return { success: false, error: "Email service not configured" };

  const emailHtml = await render(
    React.createElement(AdminNotificationEmail, {
      applicantName: `${application.firstNameTh} ${application.lastNameTh}`,
      applicationId: application.id,
    }),
  );

  try {
    const info = await transporter.sendMail({
      from: `"NPU System" <${env.SMTP_USER}>`,
      to: env.ADMIN_NOTIFY_EMAIL || "apirak@npu.ac.th",
      subject: `[ใบสมัครใหม่] ${application.firstNameTh} ${application.lastNameTh} — NPU NextGen`,
      html: emailHtml,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Failed to send admin notification email:", error);
    return { success: false, error: error.message };
  }
};

export const sendApprovalEmail = async (application: any) => {
  if (!transporter)
    return { success: false, error: "Email service not configured" };

  try {
    const info = await transporter.sendMail({
      from: `"NPU NextGen" <${env.SMTP_USER}>`,
      to: application.email,
      subject: `[แจ้งผลการคัดเลือก] ขอแสดงความยินดี คุณผ่านการพิจารณาหลักสูตร NPU NextGen`,
      html: `<p>เรียน คุณ${application.firstNameTh} ${application.lastNameTh},</p><p>ขอแสดงความยินดี คุณผ่านการคัดเลือก...</p>`,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Failed to send approval email:", error);
    return { success: false, error: error.message };
  }
};
