import prisma from "@/lib/db";
import { AppStatus, Application } from "@prisma/client";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";

export async function changeApplicationStatus(
  applicationId: string,
  newStatus: AppStatus,
  adminEmail: string,
  noteDetails: string,
) {
  let shouldSendApprovalEmail = false;
  let shouldSendRejectionEmail = false;
  let updatedApp: Application | undefined;

  await prisma.$transaction(async (tx) => {
    // 1. Fetch current application
    const application = await tx.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error("APPLICATION_NOT_FOUND");
    }

    const currentStatus = application.status;

    // 2. Validate State Transitions
    if (currentStatus === "REJECTED" && newStatus === "PENDING") {
      throw new Error("INVALID_STATE_TRANSITION");
    }

    // 3. Check for Email Idempotency
    let newEmailSentFlag = application.isAcceptanceEmailSent;

    if (newStatus === "ACCEPTED" && !application.isAcceptanceEmailSent) {
      shouldSendApprovalEmail = true;
      newEmailSentFlag = true;
    } else if (newStatus === "REJECTED") {
      shouldSendRejectionEmail = true;
    }

    // 4. Update Application
    updatedApp = await tx.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        isAcceptanceEmailSent: newEmailSentFlag,
      },
    });

    const statusMap: Record<string, string> = {
      PENDING: "รอดำเนินการ",
      REVIEWED: "กำลังพิจารณา",
      ACCEPTED: "อนุมัติผ่าน",
      REJECTED: "ไม่ผ่าน",
      WAITLISTED: "ตัวสำรอง",
    };

    // 5. Create Log Entry
    await tx.applicationLog.create({
      data: {
        applicationId,
        adminEmail,
        action: "STATUS_CHANGE",
        details:
          noteDetails ||
          `เปลี่ยนสถานะจาก ${statusMap[currentStatus] || currentStatus} เป็น ${statusMap[newStatus] || newStatus}`,
      },
    });
  });

  // 6. Send Email Notification
  if (updatedApp) {
    if (shouldSendApprovalEmail) {
      try {
        await sendApprovalEmail(updatedApp);
      } catch (error) {
        console.error(
          "Failed to send approval email, but status was updated",
          error,
        );
      }
    } else if (shouldSendRejectionEmail) {
      try {
        await sendRejectionEmail(updatedApp);
      } catch (error) {
        console.error(
          "Failed to send rejection email, but status was updated",
          error,
        );
      }
    }
  }

  return updatedApp;
}

export async function updateApplicationData(
  applicationId: string,
  data: Partial<Application>,
  adminEmail: string,
) {
  const {
    id: _id,
    nationalId: _nationalId,
    status: _status,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    isAcceptanceEmailSent: _isAcceptanceEmailSent,
    logs: _logs,
    consent: _consent,
    ...editableData
  } = data as Record<string, unknown>;

  return await prisma.$transaction(async (tx) => {
    // 1. Fetch current application
    const application = await tx.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error("APPLICATION_NOT_FOUND");
    }

    // Check if any data actually changed
    const hasChanged = Object.keys(editableData).some((key) => {
      const oldVal = (application as Record<string, unknown>)[key] ?? "";
      const newVal = (editableData as Record<string, unknown>)[key] ?? "";
      return oldVal !== newVal;
    });

    if (!hasChanged) {
      return application;
    }

    // 1. Create Log Entry (Do this first so it's included in the fetch below)
    await tx.applicationLog.create({
      data: {
        applicationId,
        adminEmail,
        action: "DATA_UPDATE",
        details: "แก้ไขข้อมูลใบสมัคร",
      },
    });

    // 2. Update Application
    const updatedApp = await tx.application.update({
      where: { id: applicationId },
      data: editableData,
      include: { logs: { orderBy: { createdAt: "desc" } } },
    });

    return updatedApp;
  });
}
