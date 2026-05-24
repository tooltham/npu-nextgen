import prisma from "@/lib/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Inbox,
  User,
} from "lucide-react";
import GradingForm from "@/components/admin/GradingForm";
import Image from "next/image";

export default async function UserSubmissionsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  const userRole = (session.user as { role?: string }).role;
  if (userRole !== "ADMIN" && userRole !== "STAFF") {
    redirect("/admin/login");
  }

  const { userId } = await params;

  // Fetch the specific user and their submissions
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      submissions: {
        include: {
          module: { select: { title: true } },
          gradedBy: { select: { name: true, email: true } },
        },
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-noto-thai">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ไม่พบผู้ใช้งาน
          </h1>
          <p className="text-gray-500 mb-6">
            ระบบไม่พบข้อมูลผู้เรียนที่คุณต้องการตรวจงาน
          </p>
          <Link
            href="/admin/submissions"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> กลับหน้ารวม
          </Link>
        </div>
      </div>
    );
  }

  const submissions = user.submissions;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-noto-thai">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/admin/submissions"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                ตรวจผลงาน
              </h1>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          {user.image ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm">
              <Image
                src={user.image}
                alt={user.name || "User Avatar"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-2xl border border-indigo-100 shadow-sm">
              {(user.name || user.email || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user.name || "ไม่มีชื่อ"}
            </h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
              <Inbox className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">
                ผู้เรียนรายนี้ยังไม่มีผลงานที่ถูกส่งมา
              </p>
            </div>
          ) : (
            submissions.map((submission) => {
              const isPass = submission.status === "PASS";
              const isPending = submission.status === "PENDING";

              return (
                <div
                  key={submission.id}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-start gap-6"
                >
                  {/* Status Icon */}
                  <div
                    className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${
                      isPass
                        ? "bg-emerald-100 text-emerald-600"
                        : isPending
                          ? "bg-amber-100 text-amber-600"
                          : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {isPass ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : isPending ? (
                      <Clock className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                          isPass
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : isPending
                              ? "bg-amber-50 border-amber-200 text-amber-700"
                              : "bg-rose-50 border-rose-200 text-rose-700"
                        }`}
                      >
                        {submission.status}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        ส่งเมื่อ{" "}
                        {new Date(submission.submittedAt).toLocaleString(
                          "th-TH",
                        )}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {submission.module?.title || "Unknown Module"}
                      </h3>
                    </div>

                    <a
                      href={submission.assignmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:underline text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 w-fit transition-colors"
                    >
                      เปิดไฟล์ผลงาน <ExternalLink className="w-4 h-4" />
                    </a>

                    {submission.note && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm">
                        <span className="font-bold text-gray-500 block mb-1 text-xs">
                          บันทึกจากผู้เรียน:
                        </span>
                        <p className="text-gray-700">{submission.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Grading Panel */}
                  <div className="w-full md:w-[320px] shrink-0 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      ส่วนของการประเมินผล
                    </h4>

                    <GradingForm
                      submissionId={submission.id}
                      initialScore={submission.score}
                      initialFeedback={submission.feedback || ""}
                    />

                    {submission.gradedBy && (
                      <p className="text-xs text-gray-400 mt-4 text-center">
                        ประเมินล่าสุดโดย{" "}
                        {submission.gradedBy.name || submission.gradedBy.email}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
