"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

type QuizQuestion = {
  id?: string;
  question: string;
  options: string[];
  correctIdx: number;
};

export default function QuizBuilderWidget({
  moduleId,
  lessonId,
  onClose,
}: {
  moduleId: string;
  lessonId: string;
  onClose: () => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(
          `/api/staff/courses/modules/${moduleId}/lessons/${lessonId}/quizzes`,
        );
        const result = await res.json();
        if (result.success && result.data.length > 0) {
          setQuestions(result.data);
        } else {
          // default first question
          setQuestions([
            { question: "", options: ["", "", "", ""], correctIdx: 0 },
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, [moduleId, lessonId]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctIdx: 0 },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, text: string) => {
    const newQ = [...questions];
    newQ[index].question = text;
    setQuestions(newQ);
  };

  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    text: string,
  ) => {
    const newQ = [...questions];
    newQ[qIndex].options[optIndex] = text;
    setQuestions(newQ);
  };

  const handleCorrectOptionChange = (qIndex: number, optIndex: number) => {
    const newQ = [...questions];
    newQ[qIndex].correctIdx = optIndex;
    setQuestions(newQ);
  };

  const handleSave = async () => {
    // Validate
    if (questions.some((q) => !q.question || q.options.some((o) => !o))) {
      alert("กรุณากรอกคำถามและตัวเลือกให้ครบถ้วน");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(
        `/api/staff/courses/modules/${moduleId}/lessons/${lessonId}/quizzes`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizzes: questions }),
        },
      );
      if (res.ok) {
        alert("บันทึกแบบทดสอบเรียบร้อยแล้ว");
        onClose();
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (e) {
      console.error(e);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-zinc-700">
                คำถามข้อที่ {qIndex + 1}
              </label>
              <textarea
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                placeholder="พิมพ์คำถามที่นี่..."
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none h-20"
              />
            </div>
            <button
              onClick={() => handleRemoveQuestion(qIndex)}
              className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-6"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700">
              ตัวเลือก
            </label>
            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="flex items-center gap-3">
                <button
                  onClick={() => handleCorrectOptionChange(qIndex, optIndex)}
                  className={`p-1.5 rounded-full border transition-colors ${
                    q.correctIdx === optIndex
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-zinc-300 text-transparent hover:border-emerald-500"
                  }`}
                  title={
                    q.correctIdx === optIndex
                      ? "คำตอบที่ถูก"
                      : "เลือกเป็นคำตอบที่ถูก"
                  }
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(qIndex, optIndex, e.target.value)
                  }
                  placeholder={`ตัวเลือก ${String.fromCharCode(65 + optIndex)}`}
                  className={`flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    q.correctIdx === optIndex
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-zinc-200"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handleAddQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มคำถาม
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-100 text-zinc-700 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกแบบทดสอบ"}
          </button>
        </div>
      </div>
    </div>
  );
}
