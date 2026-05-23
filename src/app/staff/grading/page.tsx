import { redirect } from "next/navigation";
import { verifyStaff } from "@/lib/auth-guards";
import prisma from "@/lib/db";
import GradingDashboardClient from "@/components/staff/GradingDashboardClient";

export const metadata = {
  title: "ระบบตรวจประเมินโครงการ | NPU NextGen",
  description:
    "Smart Integrated Farm Manager Application System - Grading Portal",
};

export default async function GradingPage() {
  const authResult = await verifyStaff();

  if (!authResult.success) {
    redirect("/admin/login");
  }

  const { user } = authResult;

  // Fetch all submissions with user details
  const submissions = await prisma.submission.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  // Fetch modules to map titles
  const modules = await prisma.courseModule.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <GradingDashboardClient
      initialSubmissions={submissions as Record<string, unknown>}
      modules={modules}
      currentUser={{
        id: user.id,
        name: user.name || null,
        email: user.email,
        role: user.role,
      }}
    />
  );
}
