import { ApplicationTable } from "@/components/admin/ApplicationTable";
import { StatsCards } from "@/components/admin/StatsCards";
import { ExportButtons } from "@/components/admin/ExportButtons";
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

  return (
    <div className="p-6 lg:p-10 font-noto-thai">
      <div className="mx-auto max-w-[1280px] space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-3 mb-2">
              <LayoutDashboard className="h-8 w-8 text-[#1B5E20]" />
              Admin Dashboard
            </h1>
            <p className="text-zinc-500 mt-1 font-medium">
              ระบบจัดการผู้สมัครโครงการ NPU NextGen
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ExportButtons />
          </div>
        </div>

        <StatsCards stats={{ total, pending, accepted, rejected }} />

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-zinc-900">รายการใบสมัคร</h2>
          <ApplicationTable />
        </div>
      </div>
    </div>
  );
}
