import { ApplicationTable } from "@/components/admin/ApplicationTable";
import { StatsCards } from "@/components/admin/StatsCards";
import { ExportButtons } from "@/components/admin/ExportButtons";
import { LogoutButton } from "@/components/admin/LogoutButton";
import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Presentation, BookOpen, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

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
              สวัสดี, {session.user?.email} — ระบบจัดการผู้สมัครโครงการ NPU
              NextGen
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/users"
              className={buttonVariants({
                size: "sm",
                variant: "outline",
                className: "shadow-sm font-noto-thai shrink-0",
              })}
            >
              <Users className="mr-2 h-4 w-4 shrink-0" />
              จัดการข้อมูลผู้เรียน
            </Link>
            <Link
              href="/admin/courses"
              className={buttonVariants({
                size: "sm",
                variant: "outline",
                className: "shadow-sm font-noto-thai shrink-0",
              })}
            >
              <BookOpen className="mr-2 h-4 w-4 shrink-0" />
              จัดการหลักสูตร
            </Link>
            <Link
              href="/admin/submissions"
              className={buttonVariants({
                size: "sm",
                variant: "outline",
                className: "shadow-sm font-noto-thai shrink-0",
              })}
            >
              <Presentation className="mr-2 h-4 w-4 shrink-0" />
              ตรวจผลงาน
            </Link>
            <Link
              href="/portal"
              className={buttonVariants({
                size: "sm",
                className:
                  "bg-[#1B5E20] hover:bg-[#154a19] text-white shadow-sm font-noto-thai px-4 shrink-0",
              })}
            >
              <BookOpen className="mr-2 h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Student Portal</span>
            </Link>
            <ExportButtons />
            <LogoutButton />
          </div>
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
