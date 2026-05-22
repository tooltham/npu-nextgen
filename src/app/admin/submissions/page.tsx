import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Clock, CheckCircle2, ChevronRight, Inbox } from "lucide-react";
import Image from "next/image";
import SubmissionsFilter from "@/components/admin/SubmissionsFilter";
import PaginationControls from "@/components/admin/PaginationControls";

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; filter?: string }>;
}) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { page = "1", search = "", filter = "all" } = await searchParams;

  const currentPage = Math.max(1, parseInt(page, 10));
  const itemsPerPage = 12;

  // Build the dynamic where clause
  const whereClause: any = {
    submissions: {
      some: {},
    },
  };

  // Add search filter (name or email)
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  // Add status filter
  if (filter === "pending") {
    whereClause.submissions = {
      some: { status: "PENDING" },
    };
  } else if (filter === "graded") {
    whereClause.submissions = {
      every: { status: { not: "PENDING" } },
      some: {}, // ensures they have at least one submission
    };
  }

  const [totalUsers, usersWithSubmissions] = await Promise.all([
    prisma.user.count({ where: whereClause }),
    prisma.user.findMany({
      where: whereClause,
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        submissions: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-noto-thai">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                ระบบตรวจงาน (Submissions)
              </h1>
            </div>
            <p className="text-gray-500">
              เลือกรายชื่อนักศึกษาเพื่อดูและประเมินผลงาน (แยกตามรายบุคคล)
            </p>
          </div>
          <SubmissionsFilter />
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {usersWithSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
              <Users className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">ไม่พบผู้เรียนที่ตรงกับเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
                {usersWithSubmissions.map((user) => {
                  const pendingCount = user.submissions.filter((s) => s.status === "PENDING").length;
                  const totalSubmissions = user.submissions.length;

                  return (
                    <Link
                      key={user.id}
                      href={`/admin/submissions/${user.id}`}
                      className="block group bg-white"
                    >
                      <div className="p-6 hover:bg-indigo-50/50 transition-colors flex items-center justify-between h-full">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          {user.image ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
                              <Image
                                src={user.image}
                                alt={user.name || "User Avatar"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-lg border border-indigo-100">
                              {(user.name || user.email || "?").charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                              {user.name || "ไม่มีชื่อ"}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{user.email}</p>
                            
                            <div className="flex items-center gap-3 mt-2">
                              {pendingCount > 0 ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                  <Clock className="w-3.5 h-3.5" /> รอตรวจ {pendingCount} งาน
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> ตรวจครบแล้ว
                                </span>
                              )}
                              <span className="text-xs text-gray-400">ทั้งหมด {totalSubmissions} งาน</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-gray-300 group-hover:text-indigo-500 transition-colors ml-4 shrink-0">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <PaginationControls currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
