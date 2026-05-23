import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db
vi.mock("@/lib/db", () => {
  return {
    default: {
      $transaction: vi.fn(),
      application: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      applicationLog: {
        create: vi.fn(),
      },
    },
  };
});

// Mock email
vi.mock("@/lib/email", () => ({
  sendApprovalEmail: vi.fn().mockResolvedValue(true),
}));

import prisma from "@/lib/db";
import { sendApprovalEmail } from "@/lib/email";
import {
  changeApplicationStatus,
  updateApplicationData,
} from "@/services/applicationService";
import { AppStatus } from "@prisma/client";

describe("applicationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("changeApplicationStatus", () => {
    it("should throw error if application is not found", async () => {
      const mockTx = {
        application: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };
      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        return await callback(mockTx);
      });

      await expect(
        changeApplicationStatus(
          "app-1",
          AppStatus.ACCEPTED,
          "admin@test.com",
          "Note",
        ),
      ).rejects.toThrow("APPLICATION_NOT_FOUND");
    });

    it("should throw error on invalid state transition (REJECTED -> PENDING)", async () => {
      const mockTx = {
        application: {
          findUnique: vi.fn().mockResolvedValue({ status: AppStatus.REJECTED }),
        },
      };
      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        return await callback(mockTx);
      });

      await expect(
        changeApplicationStatus(
          "app-1",
          AppStatus.PENDING,
          "admin@test.com",
          "",
        ),
      ).rejects.toThrow("INVALID_STATE_TRANSITION");
    });

    it("should update status and send email if ACCEPTED and email not sent yet", async () => {
      const mockApp = {
        id: "app-1",
        status: AppStatus.PENDING,
        isAcceptanceEmailSent: false,
      };
      const updatedApp = {
        ...mockApp,
        status: AppStatus.ACCEPTED,
        isAcceptanceEmailSent: true,
      };

      const mockTx = {
        application: {
          findUnique: vi.fn().mockResolvedValue(mockApp),
          update: vi.fn().mockResolvedValue(updatedApp),
        },
        applicationLog: {
          create: vi.fn(),
        },
      };
      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        return await callback(mockTx);
      });

      const result = await changeApplicationStatus(
        "app-1",
        AppStatus.ACCEPTED,
        "admin@test.com",
        "Looks good",
      );

      expect(mockTx.application.update).toHaveBeenCalledWith({
        where: { id: "app-1" },
        data: { status: AppStatus.ACCEPTED, isAcceptanceEmailSent: true },
      });
      expect(mockTx.applicationLog.create).toHaveBeenCalledWith({
        data: {
          applicationId: "app-1",
          adminEmail: "admin@test.com",
          action: "STATUS_CHANGE",
          details: "Looks good",
        },
      });
      expect(sendApprovalEmail).toHaveBeenCalledWith(updatedApp);
      expect(result).toEqual(updatedApp);
    });

    it("should not send email again if already sent", async () => {
      const mockApp = {
        id: "app-1",
        status: AppStatus.PENDING,
        isAcceptanceEmailSent: true,
      };
      const updatedApp = {
        ...mockApp,
        status: AppStatus.ACCEPTED,
        isAcceptanceEmailSent: true,
      };

      const mockTx = {
        application: {
          findUnique: vi.fn().mockResolvedValue(mockApp),
          update: vi.fn().mockResolvedValue(updatedApp),
        },
        applicationLog: {
          create: vi.fn(),
        },
      };
      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        return await callback(mockTx);
      });

      await changeApplicationStatus(
        "app-1",
        AppStatus.ACCEPTED,
        "admin@test.com",
        "",
      );

      expect(sendApprovalEmail).not.toHaveBeenCalled();
    });
  });

  describe("updateApplicationData", () => {
    it("should update application data and create log", async () => {
      const mockApp = { id: "app-1", firstNameTh: "OldName" };
      const updatedApp = { id: "app-1", firstNameTh: "NewName" };

      const mockTx = {
        application: {
          findUnique: vi.fn().mockResolvedValue(mockApp),
          update: vi.fn().mockResolvedValue(updatedApp),
        },
        applicationLog: {
          create: vi.fn(),
        },
      };
      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        return await callback(mockTx);
      });

      const result = await updateApplicationData(
        "app-1",
        { firstNameTh: "NewName" } as any,
        "admin@test.com",
      );

      expect(mockTx.application.update).toHaveBeenCalledWith({
        where: { id: "app-1" },
        data: { firstNameTh: "NewName" },
        include: { logs: { orderBy: { createdAt: "desc" } } },
      });
      expect(mockTx.applicationLog.create).toHaveBeenCalledWith({
        data: {
          applicationId: "app-1",
          adminEmail: "admin@test.com",
          action: "DATA_UPDATE",
          details: "แก้ไขข้อมูลใบสมัคร",
        },
      });
      expect(result).toEqual(updatedApp);
    });

    it("should return existing application if no data changed", async () => {
      const mockApp = { id: "app-1", firstNameTh: "OldName" };

      const mockTx = {
        application: {
          findUnique: vi.fn().mockResolvedValue(mockApp),
          update: vi.fn(),
        },
        applicationLog: {
          create: vi.fn(),
        },
      };
      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        return await callback(mockTx);
      });

      const result = await updateApplicationData(
        "app-1",
        { firstNameTh: "OldName" } as any,
        "admin@test.com",
      );

      expect(mockTx.application.update).not.toHaveBeenCalled();
      expect(mockTx.applicationLog.create).not.toHaveBeenCalled();
      expect(result).toEqual(mockApp);
    });
  });
});
