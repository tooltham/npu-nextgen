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
    padding: 5,
    textAlign: "center",
  },
  tableColName: {
    width: "30%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableColEmail: {
    width: "30%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableColPhone: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: "center",
  },
  tableColStatus: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: "center",
  },
  textHeader: { color: "#ffffff", fontWeight: "bold" },
});

// 3. Status Map for Thai labels
const statusMap: Record<string, string> = {
  PENDING: "รอดำเนินการ",
  REVIEWED: "กำลังพิจารณา",
  ACCEPTED: "อนุมัติผ่าน",
  REJECTED: "ไม่ผ่าน",
  WAITLISTED: "ตัวสำรอง",
};

// 4. PDF Document Component
const MyDocument = ({ data }: { data: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>รายงานรายชื่อผู้สมัคร NPU NextGen</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColIndex}>
            <Text style={styles.textHeader}>ลำดับ</Text>
          </View>
          <View style={styles.tableColName}>
            <Text style={styles.textHeader}>ชื่อ-สกุล</Text>
          </View>
          <View style={styles.tableColEmail}>
            <Text style={styles.textHeader}>อีเมล</Text>
          </View>
          <View style={styles.tableColPhone}>
            <Text style={styles.textHeader}>เบอร์โทร</Text>
          </View>
          <View style={styles.tableColStatus}>
            <Text style={styles.textHeader}>สถานะ</Text>
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
            <View style={styles.tableColEmail}>
              <Text>{app.email}</Text>
            </View>
            <View style={styles.tableColPhone}>
              <Text>{app.phone}</Text>
            </View>
            <View style={styles.tableColStatus}>
              <Text>{statusMap[app.status] || app.status}</Text>
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

  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });

    const buffer = await renderToBuffer(<MyDocument data={applications} />);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=npu-applications-${new Date().toISOString().split("T")[0]}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF Export failed:", error);
    return NextResponse.json(
      { error: "Failed to export PDF" },
      { status: 500 },
    );
  }
}
