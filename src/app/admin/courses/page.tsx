import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { CourseBuilderClient } from "@/components/admin/courses/CourseBuilderClient";

export default async function AdminCoursesPage() {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
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
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-noto-thai">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <div>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block"
          >
            &larr; กลับหน้า Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Course Builder
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
