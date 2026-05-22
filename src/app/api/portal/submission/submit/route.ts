import { NextResponse } from "next/server";
import { verifyEnrollment } from "@/lib/auth-guards";
import prisma from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const authResult = await verifyEnrollment();
    if (!authResult.success) {
      return authResult.response;
    }

    const { user } = authResult;
    const formData = await request.formData();

    const moduleId = formData.get("moduleId") as string;
    const note = formData.get("note") as string;
    const file = formData.get("file") as File;

    if (!moduleId || !file) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: moduleId and file" },
        { status: 400 },
      );
    }

    // 10 MB limit
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 10 MB limit" },
        { status: 400 },
      );
    }

    // Valid formats: .pdf, .doc, .docx
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file format. Only PDF, DOC, and DOCX are allowed.",
        },
        { status: 400 },
      );
    }

    // Check if CourseModule exists
    const moduleExists = await prisma.courseModule.findUnique({
      where: { id: moduleId },
    });

    if (!moduleExists) {
      return NextResponse.json(
        { success: false, error: "Course module not found" },
        { status: 404 },
      );
    }

    // Convert File to ArrayBuffer, then to Buffer for Supabase
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${moduleId}-${uuidv4()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("assignments")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to upload file to storage server." },
        { status: 500 },
      );
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from("assignments")
      .getPublicUrl(fileName);

    const assignmentUrl = publicUrlData.publicUrl;

    // Check for existing submission
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        userId: user.id,
        moduleId: moduleId,
      },
    });

    let submission;

    if (existingSubmission) {
      // Update and reset grading status for re-submission
      submission = await prisma.submission.update({
        where: { id: existingSubmission.id },
        data: {
          assignmentUrl,
          note,
          submittedAt: new Date(),
          status: "PENDING",
          score: null,
          feedback: null,
          gradedById: null,
          gradedAt: null,
        },
      });
    } else {
      // Create new submission
      submission = await prisma.submission.create({
        data: {
          userId: user.id,
          moduleId,
          assignmentUrl,
          note,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Failed to submit assignment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
