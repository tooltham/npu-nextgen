import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Clock, CheckCircle2, ChevronRight, Inbox, Eye } from "lucide-react";
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
      <div className="mx-auto max-w-[1400px] space-y-8">
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
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/80 text-gray-600 font-noto-thai border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">ชื่อ-สกุล</th>
                    <th className="px-5 py-3.5 font-medium">อีเมล</th>
                    <th className="px-5 py-3.5 font-medium">สถานะงาน</th>
                    <th className="px-5 py-3.5 font-medium">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-noto-thai">
                  {usersWithSubmissions.map((user) => {
                    const pendingCount = user.submissions.filter((s) => s.status === "PENDING").length;
                    const totalSubmissions = user.submissions.length;

                    return (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                <Image
                                  src={user.image}
                                  alt={user.name || "User Avatar"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B5E20]/10 text-[#1B5E20] text-sm font-bold">
                                {(user.name || user.email || "?").charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="line-clamp-1">{user.name || "ไม่มีชื่อ"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          <div className="line-clamp-1">{user.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {pendingCount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" /> รอตรวจ {pendingCount}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> ตรวจครบแล้ว
                              </span>
                            )}
                            <span className="text-[11px] text-gray-400">ทั้งหมด {totalSubmissions}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/admin/submissions/${user.id}`}>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 border border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white shadow-sm h-8 px-3 gap-1.5 font-noto-thai">
                              <Eye className="w-4 h-4" />
                              ตรวจงาน
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {usersWithSubmissions.length > 0 && (
            <div className="pt-2">
              <PaginationControls currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
