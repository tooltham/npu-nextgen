import { StatsCards } from "@/components/admin/StatsCards";
import ApplicationStatusChart from "@/components/admin/charts/ApplicationStatusChart";
import DemographicsCharts from "@/components/admin/charts/DemographicsCharts";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Fetch summary stats server-side
  const [total, pending, accepted, rejected] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "ACCEPTED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
  ]);

  // Status Chart Data
  const statusGroups = await prisma.application.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const statusMap: Record<string, string> = {
    PENDING: "รอดำเนินการ",
    REVIEWED: "กำลังพิจารณา",
    ACCEPTED: "ผ่านการคัดเลือก",
    WAITLISTED: "ตัวสำรอง",
    REJECTED: "ไม่ผ่าน",
  };

  const statusColors: Record<string, string> = {
    PENDING: "#F59E0B",
    REVIEWED: "#3B82F6",
    ACCEPTED: "#10B981",
    WAITLISTED: "#6366F1",
    REJECTED: "#EF4444",
  };

  const statusData = statusGroups.map((g) => ({
    name: statusMap[g.status] || g.status,
    value: g._count.status,
    fill: statusColors[g.status] || "#9CA3AF",
  }));

  // Demographics: Digital Skills
  const digitalSkillGroups = await prisma.application.groupBy({
    by: ["digitalSkillLevel"],
    _count: { digitalSkillLevel: true },
  });

  const skillMap: Record<string, string> = {
    EXCELLENT: "ดีเยี่ยม",
    GOOD: "ดี",
    AVERAGE: "ปานกลาง",
    LOW: "พอใช้",
    NONE: "ไม่มีพื้นฐาน",
  };

  const skillColors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

  const digitalSkillsData = digitalSkillGroups
    .sort((a, b) => b._count.digitalSkillLevel - a._count.digitalSkillLevel)
    .map((g, i) => ({
      name: skillMap[g.digitalSkillLevel] || g.digitalSkillLevel,
      value: g._count.digitalSkillLevel,
      fill: skillColors[i] || "#9CA3AF",
    }));

  // Demographics: Agri Experience
  const hasAgri = await prisma.application.count({
    where: { hasAgriExperience: true },
  });
  const noAgri = await prisma.application.count({
    where: { hasAgriExperience: false },
  });

  const agriExperienceData = [
    { name: "มีประสบการณ์", value: hasAgri, fill: "#10B981" },
    { name: "ไม่มีประสบการณ์", value: noAgri, fill: "#F59E0B" },
  ].filter((d) => d.value > 0);

  return (
    <div className="p-6 lg:p-10 font-noto-thai">
      <div className="mx-auto max-w-[1280px] space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-3 mb-2">
              <LayoutDashboard className="h-8 w-8 text-[#1B5E20]" />
              แดชบอร์ดข้อมูล
            </h1>
            <p className="text-zinc-500 mt-1 font-medium">
              ระบบจัดการโครงการ NPU NextGen
            </p>
          </div>
        </div>

        <StatsCards stats={{ total, pending, accepted, rejected }} />

        <div className="grid grid-cols-1 gap-6 pt-4">
          <ApplicationStatusChart data={statusData} />
          <DemographicsCharts
            digitalSkillsData={digitalSkillsData}
            agriExperienceData={agriExperienceData}
          />
        </div>
      </div>
    </div>
  );
}
