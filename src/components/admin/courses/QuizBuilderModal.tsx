/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Quiz, Lesson } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Loader2, X, Plus, Trash2, Edit, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
}

export function QuizBuilderModal({ isOpen, onClose, lesson }: Props) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean;
    quizId: string | null;
  }>({ show: false, quizId: null });

  // Current editing quiz state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIdx, setCorrectIdx] = useState<number>(0);

  const loadQuizzes = useCallback(async () => {
    if (!lesson) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/courses/lessons/${lesson.id}/quizzes`,
      );
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [lesson]);

  useEffect(() => {
    if (isOpen && lesson) {
      loadQuizzes();
    } else {
      setQuizzes([]);
      setIsEditing(false);
    }
  }, [isOpen, lesson, loadQuizzes]);

  const handleAddNew = () => {
    setEditingId(null);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIdx(0);
    setIsEditing(true);
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingId(quiz.id);
    setQuestion(quiz.question);
    setOptions(quiz.options as string[]);
    setCorrectIdx(quiz.correctIdx);
    setIsEditing(true);
  };

  const confirmDeleteQuestion = async () => {
    if (!deleteDialog.quizId) return;
    setIsLoading(true);
    await fetch(`/api/admin/courses/quizzes/${deleteDialog.quizId}`, {
      method: "DELETE",
    });
    setDeleteDialog({ show: false, quizId: null });
    loadQuizzes();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson) return;

    // Validate options
    if (options.some((opt) => opt.trim() === "")) {
      alert("Please fill all options");
      return;
    }

    setIsLoading(true);
    try {
      const url = editingId
        ? `/api/admin/courses/quizzes/${editingId}`
        : `/api/admin/courses/lessons/${lesson.id}/quizzes`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, options, correctIdx }),
      });

      if (res.ok) {
        setIsEditing(false);
        loadQuizzes();
      } else {
        alert("Failed to save quiz");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-noto-thai">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b shrink-0 bg-purple-50">
          <div>
            <h2 className="text-lg font-bold text-purple-900">
              จัดการแบบทดสอบ
            </h2>
            <p className="text-sm text-purple-700">บทเรียน: {lesson.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-purple-500 hover:text-purple-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {isEditing ? (
            <form
              onSubmit={handleSave}
              className="bg-white p-4 rounded-lg border shadow-sm space-y-4"
            >
              <h3 className="font-semibold">
                {editingId ? "แก้ไขคำถาม" : "สร้างคำถามใหม่"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  คำถาม <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  ตัวเลือก (เลือกข้อที่ถูกที่สุด)
                </label>
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIdx === idx}
                      onChange={() => setCorrectIdx(idx)}
                      className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500 cursor-pointer"
                    />
                    <input
                      required
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`ตัวเลือกที่ ${idx + 1}`}
                      className={`flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${correctIdx === idx ? "border-purple-300 bg-purple-50" : ""}`}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  บันทึกคำถาม
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">
                  คำถามทั้งหมด ({quizzes.length} ข้อ)
                </h3>
                <Button
                  onClick={handleAddNew}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มคำถาม
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : quizzes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white border rounded-lg">
                  ยังไม่มีคำถามในบทเรียนนี้
                </div>
              ) : (
                <div className="space-y-3">
                  {quizzes.map((quiz, qIdx) => (
                    <div
                      key={quiz.id}
                      className="bg-white border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-medium text-gray-900 mb-2">
                            {qIdx + 1}. {quiz.question}
                          </p>
                          <ul className="space-y-1 ml-4 text-sm">
                            {(quiz.options as string[]).map((opt, oIdx) => (
                              <li
                                key={oIdx}
                                className={
                                  quiz.correctIdx === oIdx
                                    ? "text-green-600 font-semibold flex items-center gap-1"
                                    : "text-gray-600"
                                }
                              >
                                {quiz.correctIdx === oIdx ? "✓" : "•"} {opt}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(quiz)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              setDeleteDialog({ show: true, quizId: quiz.id })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom Delete Dialog Overlay */}
      {deleteDialog.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 font-noto-thai">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-[440px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold">ยืนยันการลบข้อสอบ</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการลบคำถามนี้?
                ข้อมูลคำถามและตัวเลือกจะถูกลบเมื่อคุณกดบันทึก
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ show: false, quizId: null })}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeleteQuestion}
              >
                ยืนยันลบ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
