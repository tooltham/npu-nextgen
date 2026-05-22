"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, HelpCircle } from "lucide-react";

interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  options: any; // Json array
  correctIdx: number;
}

interface QuizWidgetProps {
  quiz: Quiz;
  previousAttempt?: {
    selectedIdx: number;
    isCorrect: boolean;
  } | null;
  onSuccess?: () => void;
}

export default function QuizWidget({
  quiz,
  previousAttempt,
  onSuccess,
}: QuizWidgetProps) {
  const options = Array.isArray(quiz.options)
    ? quiz.options
    : typeof quiz.options === "string"
      ? JSON.parse(quiz.options)
      : [];

  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    previousAttempt ? previousAttempt.selectedIdx : null,
  );
  const [isSubmitted, setIsSubmitted] = useState(!!previousAttempt);
  const [isCorrect, setIsCorrect] = useState(
    previousAttempt ? previousAttempt.isCorrect : false,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (selectedIdx === null) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/portal/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: quiz.id, selectedIdx }),
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.error || "Failed to submit answer");
      }

      setIsCorrect(res.data.isCorrect);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/20 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-wide uppercase">
            แบบทดสอบความเข้าใจ
          </h3>
          <p className="text-xs font-medium text-zinc-400">
            เลือกคำตอบที่ถูกต้องที่สุดเพียง 1 ข้อ
          </p>
        </div>
      </div>
      <p className="text-zinc-800 mb-8 font-semibold text-lg leading-relaxed">
        {quiz.question}
      </p>

      <div className="space-y-3 mb-8">
        {options.map((option: string, index: number) => {
          const isSelected = selectedIdx === index;

          let optionStyle =
            "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50";
          let icon = (
            <div className="w-5 h-5 rounded-full border-2 border-zinc-200 shrink-0" />
          );

          if (isSubmitted) {
            if (index === quiz.correctIdx) {
              optionStyle =
                "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-sm ring-1 ring-emerald-500/20";
              icon = (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              );
            } else if (isSelected && !isCorrect) {
              optionStyle =
                "border-rose-300 bg-rose-50 text-rose-900 font-bold opacity-70";
              icon = <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            } else {
              optionStyle =
                "border-zinc-100 text-zinc-400 cursor-not-allowed opacity-50";
            }
          } else if (isSelected) {
            optionStyle =
              "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-600/20 shadow-md transform -translate-y-0.5";
            icon = (
              <div className="w-5 h-5 rounded-full border-[6px] border-indigo-600 shrink-0" />
            );
          }

          return (
            <button
              key={index}
              disabled={isSubmitted || isLoading}
              onClick={() => setSelectedIdx(index)}
              className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${optionStyle}`}
            >
              {icon}
              <span className="text-sm md:text-base leading-snug">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-rose-500 text-sm mb-4 font-bold flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {!isSubmitted ? (
        <button
          disabled={selectedIdx === null || isLoading}
          onClick={handleSubmit}
          className="w-full py-4 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-1"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "ตรวจคำตอบ"
          )}
        </button>
      ) : (
        <div
          className={`p-4 md:p-5 rounded-2xl flex items-center justify-center gap-3 ${isCorrect ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"} font-bold text-sm shadow-sm`}
        >
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>ยอดเยี่ยม! คุณเลือกคำตอบที่ถูกต้องแล้ว</span>
            </>
          ) : (
            <>
              <HelpCircle className="w-5 h-5 text-rose-600" />
              <span>
                ยังไม่ถูกต้อง ลองศึกษาบทเรียนหรือวิดีโอข้างบนใหม่อีกรอบนะ
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
