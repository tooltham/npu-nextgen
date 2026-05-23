import { ApplicationTable } from "@/components/admin/ApplicationTable";
import { ExportButtons } from "@/components/admin/ExportButtons";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="p-6 lg:p-10 font-noto-thai">
      <div className="mx-auto max-w-[1280px] space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-[#1B5E20]" />
              รายการใบสมัคร
            </h1>
            <p className="text-zinc-500 mt-1 font-medium">
              จัดการและตรวจสอบข้อมูลผู้สมัครทั้งหมด
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ExportButtons />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <ApplicationTable />
        </div>
      </div>
    </div>
  );
}
