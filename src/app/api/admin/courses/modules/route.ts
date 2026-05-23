import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const modules = await prisma.courseModule.findMany({
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("GET modules error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { title, description, thumbnail } = data;

    // Get max order
    const lastModule = await prisma.courseModule.findFirst({
      orderBy: { order: "desc" },
    });
    const nextOrder = lastModule ? lastModule.order + 1 : 1;

    const newModule = await prisma.courseModule.create({
      data: {
        title: title || "New Module",
        description: description || "",
        thumbnail: thumbnail || null,
        order: nextOrder,
        status: "DRAFT",
      },
    });

    return NextResponse.json(newModule);
  } catch (error) {
    console.error("POST module error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
