import { redirect } from "next/navigation";
import { verifyStaff } from "@/lib/auth-guards";
import prisma from "@/lib/db";
import StaffCourseManagerClient from "@/components/staff/StaffCourseManagerClient";

export const metadata = {
  title: "จัดการหลักสูตร | NPU NextGen",
  description:
    "จัดการหลักสูตร - Smart Integrated Farm Manager Application System",
};

export default async function CoursesPage() {
  const authResult = await verifyStaff();

  if (!authResult.success) {
    redirect("/admin/login");
  }

  const { user } = authResult;

  const modules = await prisma.courseModule.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { lessons: true } },
    },
  });

  return (
    <StaffCourseManagerClient
      initialModules={modules}
      currentUser={{
        id: user.id,
        name: user.name || null,
        email: user.email,
        role: user.role,
      }}
    />
  );
}
