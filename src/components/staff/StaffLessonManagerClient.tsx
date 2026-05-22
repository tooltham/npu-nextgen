"use client";

import { useState } from "react";
import {
  Plus,
  GripVertical,
  Trash2,
  Edit2,
  Play,
  FileText,
  HelpCircle,
  FileSignature,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import QuizBuilderWidget from "./QuizBuilderWidget";

type LessonType = "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT";

type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  type: LessonType;
  videoUrl: string | null;
  documentUrl: string | null;
  content: string | null;
  order: number;
  isPreview: boolean;
  dripDays: number;
  _count: { quizzes: number };
};

const TypeIcon = ({ type }: { type: LessonType }) => {
  switch (type) {
    case "VIDEO":
      return <Play className="w-4 h-4" />;
    case "TEXT":
      return <FileText className="w-4 h-4" />;
    case "QUIZ":
      return <HelpCircle className="w-4 h-4" />;
    case "ASSIGNMENT":
      return <FileSignature className="w-4 h-4" />;
  }
};

export default function StaffLessonManagerClient({
  moduleId,
  initialLessons,
}: {
  moduleId: string;
  initialLessons: Lesson[];
}) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<LessonType>("VIDEO");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Lesson>>({});
  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean;
    lessonId: string | null;
  }>({ show: false, lessonId: null });

  const router = useRouter();

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(
        `/api/staff/courses/modules/${moduleId}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTitle,
            type: newType,
            order: lessons.length,
          }),
        },
      );
      const result = await res.json();
      if (result.success) {
        setLessons([...lessons, { ...result.data, _count: { quizzes: 0 } }]);
        setNewTitle("");
        setNewType("VIDEO");
        setIsCreating(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      alert("Error creating lesson");
    }
  };

  const confirmDelete = async () => {
    if (!deleteDialog.lessonId) return;
    try {
      const res = await fetch(
        `/api/staff/courses/modules/${moduleId}/lessons/${deleteDialog.lessonId}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setLessons(lessons.filter((l) => l.id !== deleteDialog.lessonId));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteDialog({ show: false, lessonId: null });
    }
  };

  const startEditing = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setEditFormData({
      title: lesson.title,
      type: lesson.type,
      videoUrl: lesson.videoUrl || "",
      content: lesson.content || "",
      isPreview: lesson.isPreview,
      dripDays: lesson.dripDays,
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch(
        `/api/staff/courses/modules/${moduleId}/lessons/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editFormData),
        },
      );
      const result = await res.json();
      if (result.success) {
        setLessons(
          lessons.map((l) => (l.id === id ? { ...l, ...result.data } : l)),
        );
        setEditingId(null);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      alert("Error updating lesson");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">เนื้อหาในโมดูล</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มเนื้อหา
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 flex items-center gap-4">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as LessonType)}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="VIDEO">วิดีโอ (YouTube)</option>
            <option value="TEXT">บทความ</option>
            <option value="QUIZ">แบบทดสอบ</option>
            <option value="ASSIGNMENT">ส่งงาน</option>
          </select>
          <input
            type="text"
            placeholder="ชื่อบทเรียน..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            autoFocus
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800"
          >
            บันทึก
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-xl text-sm font-medium hover:bg-zinc-200"
          >
            ยกเลิก
          </button>
        </div>
      )}

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden"
          >
            {editingId === lesson.id ? (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <h3 className="font-semibold text-zinc-900">แก้ไขบทเรียน</h3>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-sm text-zinc-500 hover:text-zinc-700"
                  >
                    ปิด
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">
                        ชื่อบทเรียน
                      </label>
                      <input
                        type="text"
                        value={editFormData.title || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                          ประเภท
                        </label>
                        <select
                          value={editFormData.type || "VIDEO"}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              type: e.target.value as LessonType,
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        >
                          <option value="VIDEO">วิดีโอ (YouTube)</option>
                          <option value="TEXT">บทความ</option>
                          <option value="QUIZ">แบบทดสอบ</option>
                          <option value="ASSIGNMENT">ส่งงาน</option>
                        </select>
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                          ปลดล็อก (วัน)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editFormData.dripDays || 0}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              dripDays: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`preview-${lesson.id}`}
                        checked={editFormData.isPreview || false}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            isPreview: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
                      />
                      <label
                        htmlFor={`preview-${lesson.id}`}
                        className="text-sm text-zinc-700"
                      >
                        อนุญาตให้ดูฟรีก่อนลงทะเบียน (Preview)
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {editFormData.type === "VIDEO" && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                          YouTube URL
                        </label>
                        <input
                          type="text"
                          value={editFormData.videoUrl || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              videoUrl: e.target.value,
                            })
                          }
                          placeholder="https://youtu.be/..."
                          className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                    )}

                    {editFormData.type === "TEXT" && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                          เนื้อหา (Markdown)
                        </label>
                        <textarea
                          value={editFormData.content || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              content: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 h-32 resize-none"
                          placeholder="# หัวข้อ..."
                        />
                      </div>
                    )}

                    {editFormData.type === "QUIZ" && (
                      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-sm text-zinc-600">
                        <p>
                          จัดการแบบทดสอบในส่วน <b>"จัดการคำถาม"</b>{" "}
                          หลังจากบันทึกการตั้งค่านี้แล้ว
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => handleSaveEdit(lesson.id)}
                    className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
                  >
                    บันทึกการตั้งค่า
                  </button>
                </div>

                {lesson.type === "QUIZ" && editFormData.type === "QUIZ" && (
                  <div className="pt-8 border-t border-zinc-200">
                    <h3 className="font-semibold text-zinc-900 mb-4">
                      จัดการคำถาม (Quiz Builder)
                    </h3>
                    <QuizBuilderWidget
                      moduleId={moduleId}
                      lessonId={lesson.id}
                      onClose={() => setEditingId(null)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 flex items-center gap-4 group hover:bg-zinc-50 transition-colors">
                <div className="cursor-grab p-1 text-zinc-400 hover:text-zinc-600">
                  <GripVertical className="w-5 h-5" />
                </div>

                <div
                  className={`p-2 rounded-lg ${
                    lesson.type === "VIDEO"
                      ? "bg-red-100 text-red-600"
                      : lesson.type === "TEXT"
                        ? "bg-blue-100 text-blue-600"
                        : lesson.type === "QUIZ"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <TypeIcon type={lesson.type} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-zinc-900">
                      {lesson.title}
                    </h3>
                    {lesson.isPreview && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider">
                        Preview
                      </span>
                    )}
                    {lesson.dripDays > 0 && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase tracking-wider">
                        Drip {lesson.dripDays}d
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 mt-0.5 flex items-center gap-2">
                    <span className="capitalize">
                      {lesson.type.toLowerCase()}
                    </span>
                    {lesson.type === "QUIZ" && (
                      <span>• {lesson._count.quizzes} คำถาม</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEditing(lesson)}
                    className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteDialog({ show: true, lessonId: lesson.id })
                    }
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {lessons.length === 0 && !isCreating && (
          <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200 border-dashed">
            <p className="text-zinc-500">ยังไม่มีเนื้อหาในโมดูลนี้</p>
          </div>
        )}
      </div>

      {deleteDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-[440px]">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">ยืนยันการลบบทเรียน</h3>
            </div>
            <p className="text-zinc-600 text-sm mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบบทเรียนนี้?
              ข้อมูลทั้งหมดและแบบทดสอบภายในจะถูกลบอย่างถาวร
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteDialog({ show: false, lessonId: null })}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
