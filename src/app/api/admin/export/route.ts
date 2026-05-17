import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import Papa from "papaparse";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        consent: true,
      },
    });

    const csvData = applications.map((app) => ({
      ID: app.id,
      CreatedAt: app.createdAt.toISOString(),
      Status: app.status,
      Title: app.titleTh,
      FirstName: app.firstNameTh,
      LastName: app.lastNameTh,
      Email: app.email,
      Phone: app.phone,
      Education: app.education,
      TargetGroup: app.targetGroup.join(", "),
      AgriExperience: app.hasAgriExperience ? "YES" : "NO",
      AgriYears: app.agriExperienceYears || 0,
      DigitalSkill: app.digitalSkillLevel,
      ConsentVersion: app.consent?.consentVersion || "-",
      ConsentDate: app.consent?.grantedAt.toISOString() || "-",
    }));

    const csv = Papa.unparse(csvData);

    // Add UTF-8 BOM for Excel compatibility
    const BOM = "\uFEFF";
    const response = new NextResponse(BOM + csv);

    response.headers.set("Content-Type", "text/csv; charset=utf-8");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename=npu-applications-${new Date().toISOString().split("T")[0]}.csv`,
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 },
    );
  }
}
