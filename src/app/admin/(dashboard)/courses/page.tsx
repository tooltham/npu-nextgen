import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { CourseBuilderClient } from "@/components/admin/courses/CourseBuilderClient";
import { BookOpen } from "lucide-react";

export default async function AdminCoursesPage() {
  const session = await auth();

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Fetch initial data
  const modules = await prisma.courseModule.findMany({
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-6 lg:p-10 font-noto-thai">
      <div className="mx-auto max-w-[1280px] space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-[#1B5E20]" />
            จัดการหลักสูตร
          </h1>
          <p className="text-gray-500 mt-1">
            จัดการโครงสร้างหลักสูตร, โมดูล, บทเรียน และแบบทดสอบ
          </p>
        </div>

        <CourseBuilderClient initialModules={modules} />
      </div>
    </div>
  );
}
