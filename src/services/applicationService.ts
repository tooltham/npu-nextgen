import prisma from "@/lib/db";
import { AppStatus } from "@prisma/client";
import { sendApprovalEmail } from "@/lib/email";

export async function changeApplicationStatus(
  applicationId: string,
  newStatus: AppStatus,
  adminEmail: string,
  noteDetails: string,
) {
  let shouldSendEmail = false;
  let updatedApp: any;

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
      shouldSendEmail = true;
      newEmailSentFlag = true;
    }

    // 4. Update Application
    updatedApp = await tx.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        isAcceptanceEmailSent: newEmailSentFlag,
      },
    });

    // 5. Create Log Entry
    await tx.applicationLog.create({
      data: {
        applicationId,
        adminEmail,
        action: "STATUS_CHANGE",
        details:
          noteDetails || `Status changed from ${currentStatus} to ${newStatus}`,
      },
    });
  });

  // 6. Send Email Notification
  if (shouldSendEmail && updatedApp) {
    try {
      await sendApprovalEmail(updatedApp);
    } catch (error) {
      console.error(
        "Failed to send approval email, but status was updated",
        error,
      );
      // We don't throw here because the DB transaction already succeeded
    }
  }

  return updatedApp;
}

export async function updateApplicationData(
  applicationId: string,
  data: any,
  adminEmail: string,
) {
  const {
    id,
    nationalId,
    status,
    logs,
    createdAt,
    updatedAt,
    isAcceptanceEmailSent,
    ...editableData
  } = data;

  return await prisma.$transaction(async (tx) => {
    // 1. Fetch current application
    const application = await tx.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error("APPLICATION_NOT_FOUND");
    }

    // 2. Update Application
    const updatedApp = await tx.application.update({
      where: { id: applicationId },
      data: editableData,
    });

    // 3. Create Log Entry
    await tx.applicationLog.create({
      data: {
        applicationId,
        adminEmail,
        action: "DATA_UPDATE",
        details: "แก้ไขข้อมูลใบสมัคร",
      },
    });

    return updatedApp;
  });
}
