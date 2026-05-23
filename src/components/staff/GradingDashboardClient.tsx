"use client";

import { useState } from "react";

interface User {
  name: string | null;
  email: string;
}

interface Submission {
  id: string;
  userId: string;
  user: User;
  moduleId: string;
  assignmentUrl: string;
  note: string | null;
  score: number | null;
  feedback: string | null;
  status: "PENDING" | "PASS" | "FAIL";
  submittedAt: string;
}

interface Module {
  id: string;
  title: string;
}

interface GradingDashboardClientProps {
  initialSubmissions: Submission[];
  modules: Module[];
  currentUser: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

export default function GradingDashboardClient({
  initialSubmissions,
  modules,
  currentUser,
}: GradingDashboardClientProps) {
  const [submissions, setSubmissions] =
    useState<Submission[]>(initialSubmissions);
  const [activeTab, setActiveTab] = useState<"PENDING" | "GRADED">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("ALL");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  // Form states
  const [score, setScore] = useState<number>(80);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"PASS" | "FAIL">("PASS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "info";
  } | null>(null);

  const getModuleTitle = (moduleId: string): string => {
    return modules.find((m) => m.id === moduleId)?.title || "Unknown Module";
  };

  const handleOpenGrading = (sub: Submission) => {
    setSelectedSubmission(sub);
    setScore(sub.score || 80);
    setFeedback(sub.feedback || "");
    setStatus(sub.status === "PENDING" ? "PASS" : sub.status);
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/staff/grading/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          score,
          feedback,
          status,
        }),
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.error || "Failed to submit grading");
      }

      // Update submissions state immutably
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmission.id
            ? { ...sub, score, feedback, status }
            : sub,
        ),
      );

      showToast(
        res.isCertificateIssued
          ? "🎉 ตรวจงานสำเร็จ และระบบได้ออกใบประกาศนียบัตรออนไลน์ให้นักศึกษาท่านนี้แล้ว!"
          : "✓ ตรวจประเมินและบันทึกคะแนนเรียบร้อยแล้ว",
        "success",
      );

      setSelectedSubmission(null);
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการบันทึกคะแนน",
        "info",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (text: string, type: "success" | "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const isTabMatch =
      activeTab === "PENDING"
        ? sub.status === "PENDING"
        : sub.status !== "PENDING";
    const isModuleMatch =
      selectedModule === "ALL" || sub.moduleId === selectedModule;
    const name = sub.user.name || "";
    const email = sub.user.email;
    const isSearchMatch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    return isTabMatch && isModuleMatch && isSearchMatch;
  });

  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const passedCount = submissions.filter((s) => s.status === "PASS").length;

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 font-sans pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-lg backdrop-blur-md border animate-bounce ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-zinc-900 border-zinc-800 text-white"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold text-sm">
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header bar */}
      <header className="border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🧑‍🏫</span>
            <span className="font-extrabold text-zinc-900 tracking-tight text-lg">
              NPU NextGen{" "}
              <span className="font-medium text-zinc-400">Grading System</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
            <span>{currentUser.name || currentUser.email.split("@")[0]}</span>
            <span className="px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-500 text-xs font-bold uppercase tracking-wider">
              {currentUser.role}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-100 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl">
              ⏳
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                รอดำเนินการ
              </p>
              <h3 className="text-2xl font-black text-zinc-800">
                {pendingCount} รายการ
              </h3>
            </div>
          </div>
          <div className="bg-white border border-zinc-100 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                ผ่านการประเมินแล้ว
              </p>
              <h3 className="text-2xl font-black text-zinc-800">
                {passedCount} รายการ
              </h3>
            </div>
          </div>
          <div className="bg-white border border-zinc-100 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xl">
              🎓
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                จำนวนโมดูลหลักสูตร
              </p>
              <h3 className="text-2xl font-black text-zinc-800">
                {modules.length} วิชา
              </h3>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Tabs */}
            <div className="flex bg-zinc-100 p-1.5 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("PENDING")}
                className={`flex-1 sm:flex-initial py-2 px-5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === "PENDING"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                รอดำเนินการ ({pendingCount})
              </button>
              <button
                onClick={() => setActiveTab("GRADED")}
                className={`flex-1 sm:flex-initial py-2 px-5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === "GRADED"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                ตรวจประเมินแล้ว ({submissions.length - pendingCount})
              </button>
            </div>

            {/* Module Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1 sm:justify-end">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="px-4 py-2.5 rounded-2xl border border-zinc-200 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 outline-none text-zinc-700 font-semibold text-sm w-full sm:w-56 bg-white"
              >
                <option value="ALL">ทุกโมดูลวิชา</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="ค้นหาชื่อหรืออีเมลผู้เรียน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2.5 rounded-2xl border border-zinc-200 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 outline-none text-zinc-800 font-medium text-sm w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white border border-zinc-100 rounded-3xl shadow-sm overflow-hidden">
          {filteredSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50">
                    <th className="p-4 md:p-6 font-bold text-zinc-400 uppercase tracking-wider text-xs">
                      ข้อมูลผู้ส่ง
                    </th>
                    <th className="p-4 md:p-6 font-bold text-zinc-400 uppercase tracking-wider text-xs">
                      วิชา / โมดูล
                    </th>
                    <th className="p-4 md:p-6 font-bold text-zinc-400 uppercase tracking-wider text-xs">
                      ลิงก์โครงงาน
                    </th>
                    <th className="p-4 md:p-6 font-bold text-zinc-400 uppercase tracking-wider text-xs">
                      วันที่ส่ง
                    </th>
                    <th className="p-4 md:p-6 font-bold text-zinc-400 uppercase tracking-wider text-xs">
                      สถานะ
                    </th>
                    <th className="p-4 md:p-6 font-bold text-zinc-400 uppercase tracking-wider text-xs text-right">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredSubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="p-4 md:p-6">
                        <p className="font-extrabold text-zinc-800">
                          {sub.user.name || "ไม่ระบุชื่อ"}
                        </p>
                        <p className="text-zinc-400 text-xs font-medium">
                          {sub.user.email}
                        </p>
                      </td>
                      <td className="p-4 md:p-6">
                        <p className="font-semibold text-zinc-700">
                          {getModuleTitle(sub.moduleId)}
                        </p>
                      </td>
                      <td className="p-4 md:p-6">
                        <a
                          href={sub.assignmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 font-bold hover:text-zinc-950 transition-colors hover:underline flex items-center gap-1.5 break-all max-w-[200px]"
                        >
                          📂 เปิดดูโครงงาน ↗
                        </a>
                      </td>
                      <td className="p-4 md:p-6 text-zinc-500">
                        {new Date(sub.submittedAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4 md:p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            sub.status === "PASS"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : sub.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}
                        >
                          {sub.status === "PASS"
                            ? "✓ ผ่าน"
                            : sub.status === "PENDING"
                              ? "⏳ รอตรวจ"
                              : "💡 แก้ไข"}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 text-right">
                        <button
                          onClick={() => handleOpenGrading(sub)}
                          className="py-2 px-4 rounded-xl text-xs font-extrabold text-white bg-zinc-950 hover:bg-zinc-800 transition-all shadow-sm"
                        >
                          {sub.status === "PENDING"
                            ? "ตรวจประเมิน"
                            : "ดูผล / แก้ไข"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center text-zinc-400">
              <span className="text-4xl mb-3 block">📭</span>
              <p className="font-semibold">
                ไม่มีรายการข้อมูลโครงงานตามเงื่อนไขที่ค้นหา
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Grading Slide-over Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-zinc-100 p-6 md:p-8 animate-slide-in overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
              <h3 className="text-lg font-black text-zinc-900">
                {selectedSubmission.status === "PENDING"
                  ? "ตรวจให้คะแนนโครงการ"
                  : "ผลการประเมินเดิม"}
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {/* Submission details */}
              <div className="bg-zinc-50 p-5 rounded-2xl space-y-3.5 border border-zinc-100">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    ผู้ส่งโครงการ
                  </p>
                  <p className="font-bold text-zinc-800">
                    {selectedSubmission.user.name || "ไม่ระบุชื่อ"}
                  </p>
                  <p className="text-zinc-400 text-xs font-semibold">
                    {selectedSubmission.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    โมดูลที่ส่งงาน
                  </p>
                  <p className="font-bold text-zinc-800">
                    {getModuleTitle(selectedSubmission.moduleId)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    ลิงก์ผลงานโครงงาน
                  </p>
                  <a
                    href={selectedSubmission.assignmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-900 font-extrabold text-sm hover:underline hover:text-black break-all"
                  >
                    {selectedSubmission.assignmentUrl} ↗
                  </a>
                </div>
                {selectedSubmission.note && (
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      บันทึกเพิ่มเติมจากผู้เรียน
                    </p>
                    <p className="text-zinc-700 italic text-sm leading-relaxed">
                      {selectedSubmission.note}
                    </p>
                  </div>
                )}
              </div>

              {/* Grading Form */}
              <form onSubmit={handleGradeSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    คะแนนประเมิน (1 - 100)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 outline-none text-zinc-800 font-bold transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    ผลการประเมิน (Status)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setStatus("PASS")}
                      className={`py-3.5 px-4 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
                        status === "PASS"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-extrabold shadow-sm"
                          : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      <span>✓</span> ผ่านการประเมิน (PASS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("FAIL")}
                      className={`py-3.5 px-4 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
                        status === "FAIL"
                          ? "bg-rose-50 border-rose-200 text-rose-800 font-extrabold shadow-sm"
                          : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      <span>💡</span> ต้องแก้ไข (FAIL)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    ข้อแนะนำ / Feedback เพิ่มเติม
                  </label>
                  <textarea
                    placeholder="ระบุจุดที่ออกแบบได้ดี หรือจุดที่ควรปรับปรุงแก้ไขเพิ่มเติม..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 outline-none text-zinc-800 font-medium transition-all text-sm resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="w-1/3 py-3.5 px-4 rounded-2xl font-bold border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3.5 px-6 rounded-2xl font-bold text-white bg-zinc-950 hover:bg-zinc-800 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "บันทึกการประเมินโครงการ"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
