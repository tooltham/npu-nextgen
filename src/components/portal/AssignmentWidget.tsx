"use client";

import { useState } from "react";
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Lightbulb,
  ExternalLink,
  Loader2,
  XCircle,
} from "lucide-react";

interface Submission {
  id: string;
  assignmentUrl: string;
  note: string | null;
  score: number | null;
  feedback: string | null;
  status: "PENDING" | "PASS" | "FAIL";
}

interface AssignmentWidgetProps {
  moduleId: string;
  previousSubmission?: Submission | null;
  onSuccess?: (submission: Submission) => void;
}

export default function AssignmentWidget({
  moduleId,
  previousSubmission,
  onSuccess,
}: AssignmentWidgetProps) {
  const [submission, setSubmission] = useState<Submission | null>(
    previousSubmission || null,
  );
  const [isEditing, setIsEditing] = useState(!previousSubmission);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState(previousSubmission?.note || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("กรุณาอัปโหลดไฟล์ PDF หรือ Word (.doc, .docx) เท่านั้น");
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("ขนาดไฟล์ต้องไม่เกิน 10MB");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If editing a previous submission, file is optional if they just change the note?
    // Wait, the API requires a file if it's a new upload. Let's force re-upload.
    if (!file && !submission?.assignmentUrl) {
      setError("กรุณาเลือกไฟล์ที่ต้องการส่ง");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("moduleId", moduleId);
      formData.append("note", note);
      if (file) {
        formData.append("file", file);
      } else if (submission?.assignmentUrl) {
        // Mock a field if file isn't updated but note is?
        // Actually, the new API requires 'file' to be present. So user MUST upload a file again if they edit.
        if (!file) {
          throw new Error(
            "ระบบต้องการไฟล์ใหม่เสมอเพื่อยืนยันการแก้ไข กรุณาอัปโหลดไฟล์อีกครั้ง",
          );
        }
      }

      const response = await fetch("/api/portal/submission/submit", {
        method: "POST",
        body: formData,
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.error || "Failed to submit assignment");
      }

      setSubmission(res.data);
      setIsEditing(false);
      setFile(null);
      if (onSuccess) onSuccess(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing && submission) {
    const isPending = submission.status === "PENDING";
    const isPass = submission.status === "PASS";
    const isFail = submission.status === "FAIL";

    return (
      <div
        className={`p-6 md:p-8 rounded-3xl border shadow-xl shadow-zinc-200/10 transition-all duration-300 relative overflow-hidden ${
          isPass
            ? "bg-emerald-50 border-emerald-100 text-emerald-950"
            : isPending
              ? "bg-amber-50 border-amber-100 text-amber-950"
              : "bg-rose-50 border-rose-100 text-rose-950"
        }`}
      >
        <div
          className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 rounded-full ${isPass ? "bg-emerald-500" : isPending ? "bg-amber-500" : "bg-rose-500"}`}
        ></div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                isPass
                  ? "bg-emerald-100 text-emerald-600"
                  : isPending
                    ? "bg-amber-100 text-amber-600"
                    : "bg-rose-100 text-rose-600"
              }`}
            >
              {isPass ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isPending ? (
                <Clock className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
            </div>
            <h3 className="font-extrabold text-lg md:text-xl tracking-tight">
              {isPass
                ? "ผ่านการประเมินโครงงานแล้ว"
                : isPending
                  ? "ส่งโครงงานเรียบร้อยแล้ว"
                  : "ไม่ผ่านเกณฑ์ โปรดแก้ไขโครงงาน"}
            </h3>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
              isPass
                ? "bg-emerald-100/50 border-emerald-200 text-emerald-800"
                : isPending
                  ? "bg-amber-100/50 border-amber-200 text-amber-800"
                  : "bg-rose-100/50 border-rose-200 text-rose-800"
            }`}
          >
            สถานะ: {submission.status}
          </span>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/50 space-y-4 relative z-10">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              ไฟล์ที่ส่งล่าสุด
            </span>
            <a
              href={submission.assignmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline truncate"
            >
              ดาวน์โหลดไฟล์โครงงาน <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {submission.note && (
            <div className="flex flex-col gap-1 border-t border-zinc-200/50 pt-4">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                ข้อความเพิ่มเติม
              </span>
              <p className="text-sm font-medium text-zinc-700">
                {submission.note}
              </p>
            </div>
          )}

          {submission.feedback && (
            <div
              className={`flex flex-col gap-1 border-t border-zinc-200/50 pt-4 ${isFail ? "text-rose-700" : "text-emerald-700"}`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-wider ${isFail ? "text-rose-500" : "text-emerald-600"}`}
              >
                ข้อเสนอแนะจากผู้สอน{" "}
                {submission.score !== null &&
                  `(คะแนน: ${submission.score}/100)`}
              </span>
              <p className="text-sm font-bold bg-white/50 p-4 rounded-xl border">
                {submission.feedback}
              </p>
            </div>
          )}
        </div>

        {(isFail || isPending) && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 w-full relative z-10 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg transition-all hover:-translate-y-0.5"
          >
            {isPending
              ? "แก้ไขการส่งงาน (อัปโหลดไฟล์ใหม่)"
              : "ส่งงานแก้อีกครั้ง"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 rounded-3xl border border-zinc-100 bg-white/70 backdrop-blur-md shadow-xl shadow-zinc-200/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-zinc-50 rounded-full blur-3xl opacity-50"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-md">
          <FolderGit2 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg md:text-xl font-extrabold text-zinc-900 tracking-tight">
          อัปโหลดโครงงานท้ายบทเรียน
        </h3>
      </div>

      <p className="text-zinc-600 text-sm mb-8 leading-relaxed font-medium relative z-10">
        กรุณาแนบไฟล์เอกสาร (.pdf, .doc, .docx) ขนาดไม่เกิน 10MB
        เพื่อให้เจ้าหน้าที่ทำการตรวจประเมิน
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-zinc-700 block">
            แนบไฟล์ (จำกัด 1 ไฟล์) <span className="text-rose-500">*</span>
          </label>
          <div className="relative group">
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                file
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-zinc-200 bg-zinc-50 group-hover:border-zinc-300 group-hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                {file ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <FolderGit2 className="w-5 h-5 text-zinc-400" />
                )}
                <span
                  className={`text-sm font-medium truncate ${file ? "text-emerald-700" : "text-zinc-500"}`}
                >
                  {file
                    ? file.name
                    : "คลิกหรือลากไฟล์ .pdf, .doc, .docx มาวางที่นี่"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-zinc-700 block">
            บันทึกเพิ่มเติมถึงผู้สอน (ไม่บังคับ)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0 transition-colors text-sm font-medium bg-zinc-50 focus:bg-white min-h-[100px] resize-none"
            placeholder="เช่น คำอธิบายปัญหาหรือข้อเสนอแนะเพิ่มเติม..."
          />
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-700 text-sm font-bold rounded-xl border border-rose-100 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {submission && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
              disabled={isLoading}
            >
              ยกเลิก
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3.5 px-6 rounded-xl text-sm font-bold bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> กำลังอัปโหลด...
              </>
            ) : (
              "อัปโหลดและส่งงาน"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
