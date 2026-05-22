import { redirect } from "next/navigation";
import { verifyStaff } from "@/lib/auth-guards";
import prisma from "@/lib/db";
import StaffLessonManagerClient from "@/components/staff/StaffLessonManagerClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "จัดการบทเรียน | NPU NextGen",
  description:
    "Lesson Builder - Smart Integrated Farm Manager Application System",
};

export default async function ModuleLessonsPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const authResult = await verifyStaff();

  if (!authResult.success) {
    redirect("/admin/login");
  }

  const { moduleId } = await params;

  const moduleInfo = await prisma.courseModule.findUnique({
    where: { id: moduleId },
  });

  if (!moduleInfo) {
    redirect("/staff/courses");
  }

  const lessons = await prisma.lesson.findMany({
    where: { moduleId },
    orderBy: { order: "asc" },
    include: { _count: { select: { quizzes: true } } },
  });

  return (
    <div className="min-h-screen bg-zinc-50/50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/staff/courses"
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              จัดการบทเรียน: {moduleInfo.title}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              เพิ่ม ลบ และจัดเรียงลำดับเนื้อหาในหัวข้อนี้
            </p>
          </div>
        </div>

        <StaffLessonManagerClient
          moduleId={moduleId}
          initialLessons={lessons}
        />
      </div>
    </div>
  );
}
