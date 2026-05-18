import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import {
  changeApplicationStatus,
  updateApplicationData,
} from "@/services/applicationService";
import { AppStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        logs: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!application) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({ data: application });
  } catch (error: any) {
    console.error("GET application error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch details" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, noteDetails } = body;

  try {
    const adminEmail = session.user?.email || "unknown@admin.com";

    const updated = await changeApplicationStatus(
      id,
      status as AppStatus,
      adminEmail,
      noteDetails || `เปลี่ยนสถานะเป็น ${status}`,
    );

    return NextResponse.json({ success: true, status: updated.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update status" },
      { status: 400 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const adminEmail = session.user?.email || "unknown@admin.com";

    const updated = await updateApplicationData(id, body, adminEmail);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT application error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update application data",
      },
      { status: 500 },
    );
  }
}
