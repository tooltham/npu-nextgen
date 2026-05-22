"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface GradingFormProps {
  submissionId: string;
  initialScore: number | null;
  initialFeedback: string;
}

export default function GradingForm({
  submissionId,
  initialScore,
  initialFeedback,
}: GradingFormProps) {
  const [score, setScore] = useState<string>(
    initialScore !== null ? initialScore.toString() : "",
  );
  const [feedback, setFeedback] = useState<string>(initialFeedback);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || isNaN(Number(score))) {
      setError("กรุณากรอกคะแนนเป็นตัวเลข");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: Number(score),
          feedback,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "บันทึกข้อมูลไม่สำเร็จ");
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700">
          คะแนน (เต็ม 100)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="ex. 85"
          required
        />
        <p className="text-[10px] text-gray-500">
          * ระบบจะปรับสถานะเป็น PASS อัตโนมัติหากได้ 70 คะแนนขึ้นไป
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700">ข้อเสนอแนะ</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[80px] resize-none"
          placeholder="พิมพ์ข้อเสนอแนะ..."
          required
        />
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-bold bg-rose-50 p-2 rounded border border-rose-100">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-2 rounded border border-emerald-100">
          บันทึกคะแนนเรียบร้อยแล้ว
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "บันทึกการประเมิน"
        )}
      </button>
    </form>
  );
}
