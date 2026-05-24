import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  ChevronRight,
  Inbox,
  Eye,
  ClipboardList,
} from "lucide-react";
import Image from "next/image";
import SubmissionsFilter from "@/components/admin/SubmissionsFilter";
import PaginationControls from "@/components/admin/PaginationControls";

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; filter?: string }>;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  const userRole = (session.user as { role?: string }).role;
  if (userRole !== "ADMIN" && userRole !== "STAFF") {
    redirect("/admin/login");
  }

  const { page = "1", search = "", filter = "all" } = await searchParams;

  const currentPage = Math.max(1, parseInt(page, 10));
  const itemsPerPage = 12;

  // Build the dynamic where clause
  const whereClause: Record<string, unknown> = {
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
    <div className="p-6 lg:p-10 font-noto-thai">
      <div className="mx-auto max-w-[1280px] space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-3">
                <ClipboardList className="h-8 w-8 text-[#1B5E20]" />
                ระบบตรวจงาน
              </h1>
            </div>
            <p className="text-zinc-500 font-medium">
              เลือกรายชื่อนักศึกษาเพื่อดูและประเมินผลงาน (แยกตามรายบุคคล)
            </p>
          </div>
          <SubmissionsFilter />
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {usersWithSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-200/80 shadow-sm">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200 mb-4 shadow-inner">
                <Inbox className="w-8 h-8 text-zinc-300" />
              </div>
              <p className="text-zinc-500 font-bold">
                ไม่พบผู้เรียนที่ตรงกับเงื่อนไขการค้นหา
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50/80 text-zinc-500 text-xs uppercase font-bold tracking-wider border-b border-zinc-200/80">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">ชื่อ-สกุล</th>
                    <th className="px-5 py-3.5 font-medium">อีเมล</th>
                    <th className="px-5 py-3.5 font-medium">สถานะงาน</th>
                    <th className="px-5 py-3.5 font-medium">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-noto-thai">
                  {usersWithSubmissions.map((user) => {
                    const pendingCount = user.submissions.filter(
                      (s) => s.status === "PENDING",
                    ).length;
                    const totalSubmissions = user.submissions.length;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-zinc-50/50 transition-colors group"
                      >
                        <td className="px-5 py-4 font-medium text-zinc-900">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-zinc-100 shadow-sm">
                                <Image
                                  src={user.image}
                                  alt={user.name || "User Avatar"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B5E20]/10 text-[#1B5E20] text-sm font-bold">
                                {(user.name || user.email || "?")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                            <span className="line-clamp-1 font-extrabold group-hover:text-[#1B5E20] transition-colors">
                              {user.name || "ไม่มีชื่อ"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-zinc-600">
                          <div className="line-clamp-1 font-medium text-xs">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {pendingCount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full shadow-sm">
                                <Clock className="w-3 h-3" /> รอตรวจ{" "}
                                {pendingCount}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full shadow-sm">
                                <CheckCircle2 className="w-3 h-3" /> ตรวจครบแล้ว
                              </span>
                            )}
                            <span className="text-[11px] text-zinc-400 font-medium ml-1">
                              ทั้งหมด {totalSubmissions}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/admin/submissions/${user.id}`}>
                            <button className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm h-8 px-4 gap-1.5 font-noto-thai">
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
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
