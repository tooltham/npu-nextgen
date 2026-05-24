import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role;
    if (!session || (userRole !== "ADMIN" && userRole !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: lessonId } = await params;
    const quizzes = await prisma.quiz.findMany({
      where: { lessonId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("GET quizzes error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role;
    if (!session || (userRole !== "ADMIN" && userRole !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: lessonId } = await params;
    const data = await req.json();
    const { question, options, correctIdx } = data;

    if (!question || !options || correctIdx === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newQuiz = await prisma.quiz.create({
      data: {
        lessonId,
        question,
        options,
        correctIdx,
      },
    });

    return NextResponse.json(newQuiz);
  } catch (error) {
    console.error("POST quiz error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
