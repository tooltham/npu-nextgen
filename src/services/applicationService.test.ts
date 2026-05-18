import { describe, it, expect, vi, beforeEach } from "vitest";
import { changeApplicationStatus } from "./applicationService";
import prisma from "@/lib/db";
import * as emailUtils from "@/lib/email";
import { AppStatus } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/db", () => ({
  default: {
    application: { findUnique: vi.fn(), update: vi.fn() },
    applicationLog: { create: vi.fn() },
    $transaction: vi.fn(async (cb) => {
      // Simulate transaction passing mocked prisma clients
      const tx = {
        application: { findUnique: vi.fn(), update: vi.fn() },
        applicationLog: { create: vi.fn() },
      };
      // Link tx methods to the outer mock so we can assert them
      tx.application.findUnique = prisma.application.findUnique as any;
      tx.application.update = prisma.application.update as any;
      tx.applicationLog.create = prisma.applicationLog.create as any;
      return await cb(tx);
    }),
  },
}));

vi.mock("@/lib/email", () => ({
  sendApprovalEmail: vi.fn().mockResolvedValue({ success: true }),
}));

describe("ApplicationService - changeApplicationStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. should throw error if application not found", async () => {
    vi.mocked(prisma.application.findUnique).mockResolvedValue(null);

    await expect(
      changeApplicationStatus(
        "app123",
        "ACCEPTED" as AppStatus,
        "admin@npu.ac.th",
        "Approved",
      ),
    ).rejects.toThrow("APPLICATION_NOT_FOUND");
  });

  it("2. should not send email if status changed to something other than ACCEPTED", async () => {
    const mockApp = {
      id: "app123",
      status: "PENDING",
      isAcceptanceEmailSent: false,
    } as any;
    vi.mocked(prisma.application.findUnique).mockResolvedValue(mockApp);
    vi.mocked(prisma.application.update).mockResolvedValue({
      ...mockApp,
      status: "WAITLISTED",
    });

    const result = await changeApplicationStatus(
      "app123",
      "WAITLISTED" as AppStatus,
      "admin@npu.ac.th",
      "Moved to waitlist",
    );

    expect(result.status).toBe("WAITLISTED");
    expect(emailUtils.sendApprovalEmail).not.toHaveBeenCalled();
    expect(prisma.applicationLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "STATUS_CHANGE",
          details: "Moved to waitlist",
        }),
      }),
    );
  });

  it("3. should send email when changed to ACCEPTED for the first time", async () => {
    const mockApp = {
      id: "app123",
      status: "REVIEWED",
      isAcceptanceEmailSent: false,
      email: "user@example.com",
    } as any;
    vi.mocked(prisma.application.findUnique).mockResolvedValue(mockApp);
    vi.mocked(prisma.application.update).mockResolvedValue({
      ...mockApp,
      status: "ACCEPTED",
      isAcceptanceEmailSent: true,
    });

    await changeApplicationStatus(
      "app123",
      "ACCEPTED" as AppStatus,
      "admin@npu.ac.th",
      "Welcome",
    );

    expect(emailUtils.sendApprovalEmail).toHaveBeenCalledTimes(1);
    expect(prisma.application.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "ACCEPTED",
          isAcceptanceEmailSent: true,
        }),
      }),
    );
  });

  it("4. should NOT send email if ACCEPTED but isAcceptanceEmailSent is already true", async () => {
    const mockApp = {
      id: "app123",
      status: "WAITLISTED",
      isAcceptanceEmailSent: true,
    } as any;
    vi.mocked(prisma.application.findUnique).mockResolvedValue(mockApp);
    vi.mocked(prisma.application.update).mockResolvedValue({
      ...mockApp,
      status: "ACCEPTED",
    });

    await changeApplicationStatus(
      "app123",
      "ACCEPTED" as AppStatus,
      "admin@npu.ac.th",
      "Promoted from waitlist",
    );

    expect(emailUtils.sendApprovalEmail).not.toHaveBeenCalled(); // Email already sent in the past!
  });

  it("5. should enforce strict state transitions (cannot change REJECTED back to PENDING)", async () => {
    const mockApp = {
      id: "app123",
      status: "REJECTED",
      isAcceptanceEmailSent: false,
    } as any;
    vi.mocked(prisma.application.findUnique).mockResolvedValue(mockApp);

    await expect(
      changeApplicationStatus(
        "app123",
        "PENDING" as AppStatus,
        "admin@npu.ac.th",
        "Undo reject",
      ),
    ).rejects.toThrow("INVALID_STATE_TRANSITION");
  });
});
