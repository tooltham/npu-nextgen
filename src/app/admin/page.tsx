import { ApplicationTable } from "@/components/admin/ApplicationTable";
import { StatsCards } from "@/components/admin/StatsCards";
import { ExportButtons } from "@/components/admin/ExportButtons";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Fetch summary stats server-side
  const [total, pending, accepted, rejected] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "ACCEPTED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-noto-thai">
      <div className="mx-auto max-w-[1400px] space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              ระบบจัดการผู้สมัครโครงการ NPU NextGen
            </p>
          </div>
          <ExportButtons />
        </div>

        <StatsCards stats={{ total, pending, accepted, rejected }} />

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold text-gray-900">รายการใบสมัคร</h2>
          <ApplicationTable />
        </div>
      </div>
    </div>
  );
}
