import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import path from "path";
import { decrypt } from "@/lib/encrypt";

// 1. Register Thai Font (Load from local file)
const fontPath = path.join(
  process.cwd(),
  "public/fonts/NotoSansThai-Regular.ttf",
);

Font.register({
  family: "Noto Sans Thai",
  src: fontPath,
});

// 2. Define Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Noto Sans Thai",
    padding: 30,
    fontSize: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 24,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#1B5E20",
    color: "#ffffff",
    fontWeight: "bold",
  },
  tableColIndex: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 5,
    paddingHorizontal: 2,
    textAlign: "center",
  },
  tableColName: {
    width: "22%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableColNationalId: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: "center",
  },
  tableColEmail: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableColPhone: {
    width: "18%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: "center",
  },
  textHeader: { color: "#ffffff", fontWeight: "bold", textAlign: "center" },
});

// 4. PDF Document Component
const MyDocument = ({ data }: { data: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>รายงานรายชื่อผู้สมัคร NPU NextGen</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColIndex}>
            <Text style={styles.textHeader}>ลำดับ </Text>
          </View>
          <View style={styles.tableColName}>
            <Text style={styles.textHeader}>ชื่อ สกุล</Text>
          </View>
          <View style={styles.tableColNationalId}>
            <Text style={styles.textHeader}>เลขบัตรประจำตัวประชาชน</Text>
          </View>
          <View style={styles.tableColEmail}>
            <Text style={styles.textHeader}>อีเมล์</Text>
          </View>
          <View style={styles.tableColPhone}>
            <Text style={styles.textHeader}>โทรศัพท์</Text>
          </View>
        </View>
        {/* Table Body */}
        {data.map((app, index) => (
          <View style={styles.tableRow} key={app.id}>
            <View style={styles.tableColIndex}>
              <Text>{index + 1}</Text>
            </View>
            <View style={styles.tableColName}>
              <Text>{`${app.titleTh}${app.firstNameTh} ${app.lastNameTh}`}</Text>
            </View>
            <View style={styles.tableColNationalId}>
              <Text>{app.nationalId}</Text>
            </View>
            <View style={styles.tableColEmail}>
              <Text>{app.email}</Text>
            </View>
            <View style={styles.tableColPhone}>
              <Text>{app.phone}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// 5. API Route Handler
export async function GET(request: Request) {
  const session = await auth();

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const isInline = searchParams.get("inline") === "true";

  let applications;
  try {
    applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("PDF Export failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications for PDF" },
      { status: 500 },
    );
  }

  // Decrypt national ID for export
  const formattedData = applications.map((app) => {
    let decryptedNationalId = "-";
    if (app.nationalId) {
      try {
        decryptedNationalId = decrypt(app.nationalId);
      } catch (err) {
        console.error("Failed to decrypt nationalId for application", app.id);
      }
    }
    return {
      ...app,
      nationalId: decryptedNationalId,
    };
  });

  const document = <MyDocument data={formattedData} />;

  try {
    const buffer = await renderToBuffer(document);

    const disposition = isInline ? "inline" : "attachment";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename=npu-applications-${new Date().toISOString().split("T")[0]}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF Render failed:", error);
    return NextResponse.json(
      { error: "Failed to render PDF" },
      { status: 500 },
    );
  }
}
