import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import Papa from "papaparse";
import { decrypt } from "@/lib/encrypt";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        consent: true,
      },
    });

    const csvData = applications.map((app) => {
      let decryptedNationalId = "-";
      if (app.nationalId) {
        try {
          decryptedNationalId = decrypt(app.nationalId);
        } catch (err) {
          console.error("Failed to decrypt nationalId for application", app.id);
        }
      }

      return {
        ID: app.id,
        CreatedAt: app.createdAt.toISOString(),
        Status: app.status,
        TitleTh: app.titleTh,
        FirstNameTh: app.firstNameTh,
        LastNameTh: app.lastNameTh,
        FirstNameEn: app.firstNameEn || "-",
        LastNameEn: app.lastNameEn || "-",
        NationalId: decryptedNationalId,
        Email: app.email,
        Phone: app.phone,
        LineId: app.lineId || "-",
        Address: app.address,
        Education: app.education,
        TargetGroup: app.targetGroup.join(", "),
        TargetGroupOther: app.targetGroupOther || "-",
        AgriExperience: app.hasAgriExperience ? "YES" : "NO",
        AgriYears: app.agriExperienceYears || 0,
        FarmName: app.farmName || "-",
        FarmLocation: app.farmLocation || "-",
        DigitalSkill: app.digitalSkillLevel,
        Expectations: app.expectations.join(", "),
        ExpectationsOther: app.expectationsOther || "-",
        CanCommitTime: app.canCommitTime ? "YES" : "NO",
        ConsentVersion: app.consent?.consentVersion || "-",
        ConsentDate: app.consent?.grantedAt.toISOString() || "-",
      };
    });

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
