"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Loader2,
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  Eye,
  AlertCircle,
} from "lucide-react";
import { CourseModule, Lesson } from "@prisma/client";
import { LessonEditorModal } from "./LessonEditorModal";
import { ModuleEditorModal } from "./ModuleEditorModal";
import { QuizBuilderModal } from "./QuizBuilderModal";

type ModuleWithLessons = CourseModule & { lessons: Lesson[] };

export function CourseBuilderClient({
  initialModules,
}: {
  initialModules: ModuleWithLessons[];
}) {
  const [modules, setModules] = useState<ModuleWithLessons[]>(initialModules);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean;
    type: "module" | "lesson" | null;
    id: string | null;
    isDeleting: boolean;
  }>({ show: false, type: null, id: null, isDeleting: false });

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [activeQuizLesson, setActiveQuizLesson] = useState<Lesson | null>(null);

  const loadModules = async () => {
    const res = await fetch("/api/admin/courses/modules");
    if (res.ok) {
      const data = await res.json();
      setModules(data);
    }
  };

  const confirmDeleteModule = async () => {
    if (!deleteDialog.id) return;
    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
    try {
      const res = await fetch(`/api/admin/courses/modules/${deleteDialog.id}`, {
        method: "DELETE",
      });
      if (res.ok) await loadModules();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteDialog({ show: false, type: null, id: null, isDeleting: false });
    }
  };

  const confirmDeleteLesson = async () => {
    if (!deleteDialog.id) return;
    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
    try {
      const res = await fetch(`/api/admin/courses/lessons/${deleteDialog.id}`, {
        method: "DELETE",
      });
      if (res.ok) await loadModules();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteDialog({ show: false, type: null, id: null, isDeleting: false });
    }
  };

  const moveModule = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === modules.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newModules = [...modules];
    const temp = newModules[index];
    newModules[index] = newModules[newIndex];
    newModules[newIndex] = temp;

    // Update order property
    newModules[index].order = index + 1;
    newModules[newIndex].order = newIndex + 1;
    setModules(newModules);

    await Promise.all([
      fetch(`/api/admin/courses/modules/${newModules[index].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newModules[index].order }),
      }),
      fetch(`/api/admin/courses/modules/${newModules[newIndex].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newModules[newIndex].order }),
      }),
    ]);
    loadModules();
  };

  const moveLesson = async (
    moduleIndex: number,
    lessonIndex: number,
    direction: "up" | "down",
  ) => {
    const mod = modules[moduleIndex];
    if (direction === "up" && lessonIndex === 0) return;
    if (direction === "down" && lessonIndex === mod.lessons.length - 1) return;

    const newIndex = direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
    const newModules = [...modules];
    const newLessons = [...mod.lessons];

    const temp = newLessons[lessonIndex];
    newLessons[lessonIndex] = newLessons[newIndex];
    newLessons[newIndex] = temp;

    // Update order property
    newLessons[lessonIndex].order = lessonIndex + 1;
    newLessons[newIndex].order = newIndex + 1;

    newModules[moduleIndex] = { ...mod, lessons: newLessons };
    setModules(newModules);

    await Promise.all([
      fetch(`/api/admin/courses/lessons/${newLessons[lessonIndex].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newLessons[lessonIndex].order }),
      }),
      fetch(`/api/admin/courses/lessons/${newLessons[newIndex].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newLessons[newIndex].order }),
      }),
    ]);
    loadModules();
  };

  return (
    <div className="space-y-6 font-noto-thai">
      <div className="flex justify-end">
        <Button
          className="bg-[#1B5E20] hover:bg-[#154a19] text-white"
          onClick={() => {
            setEditingModule(null);
            setIsModuleModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มโมดูลใหม่
        </Button>
      </div>

      <div className="space-y-4">
        {modules.map((mod, index) => (
          <div
            key={mod.id}
            className="bg-white border rounded-lg shadow-sm overflow-hidden"
          >
            <div className="bg-gray-50 border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <button
                    onClick={() => moveModule(index, "up")}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveModule(index, "down")}
                    disabled={index === modules.length - 1}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    โมดูล {index + 1}: {mod.title}
                  </h3>
                  {mod.description && (
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {mod.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${mod.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}
                >
                  {mod.status}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingModule(mod);
                    setIsModuleModalOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setDeleteDialog({
                      show: true,
                      type: "module",
                      id: mod.id,
                      isDeleting: false,
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-3 bg-gray-50/80">
              {mod.lessons.length === 0 && (
                <div className="text-sm text-gray-400 text-center py-4 border-2 border-dashed rounded-lg bg-white">
                  ยังไม่มีบทเรียนในโมดูลนี้
                </div>
              )}
              {mod.lessons.map((lesson, lIndex) => (
                <div
                  key={lesson.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between hover:border-gray-300 transition-colors shadow-sm gap-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col border-r pr-3 border-gray-100">
                      <button
                        onClick={() => moveLesson(index, lIndex, "up")}
                        disabled={lIndex === 0}
                        className="text-gray-400 hover:text-[#1B5E20] disabled:opacity-30"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveLesson(index, lIndex, "down")}
                        disabled={lIndex === mod.lessons.length - 1}
                        className="text-gray-400 hover:text-[#1B5E20] disabled:opacity-30"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 shrink-0">
                      {lesson.type === "VIDEO" && (
                        <Video className="h-4 w-4 text-blue-600" />
                      )}
                      {lesson.type === "TEXT" && (
                        <FileText className="h-4 w-4 text-green-600" />
                      )}
                      {lesson.type === "QUIZ" && (
                        <HelpCircle className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-sm text-gray-800">
                        บทที่ {lIndex + 1}: {lesson.title}
                      </span>
                      <div className="flex gap-2 mt-1">
                        {lesson.isPreview && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-medium">
                            Preview (ดูฟรี)
                          </span>
                        )}
                        {lesson.dripDays > 0 && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">
                            ปลดล็อค {lesson.dripDays} วัน
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {lesson.type === "QUIZ" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        onClick={() => {
                          setActiveQuizLesson(lesson);
                          setIsQuizModalOpen(true);
                        }}
                      >
                        จัดการแบบทดสอบ
                      </Button>
                    )}
                    <Link href="/portal/classroom" target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        title="พรีวิวบทเรียน"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => {
                        setEditingLesson(lesson);
                        setActiveModuleId(mod.id);
                        setIsLessonModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                      onClick={() =>
                        setDeleteDialog({
                          show: true,
                          type: "lesson",
                          id: lesson.id,
                          isDeleting: false,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-dashed"
                onClick={() => {
                  setEditingLesson(null);
                  setActiveModuleId(mod.id);
                  setIsLessonModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มบทเรียนใหม่
              </Button>
            </div>
          </div>
        ))}

        {modules.length === 0 && (
          <div className="text-center py-12 bg-white border rounded-lg text-gray-500">
            ยังไม่มีโมดูล กดปุ่ม "เพิ่มโมดูลใหม่" เพื่อเริ่มต้น
          </div>
        )}
      </div>

      <ModuleEditorModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        module={editingModule}
        onSuccess={loadModules}
      />

      <LessonEditorModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        lesson={editingLesson}
        moduleId={activeModuleId}
        onSuccess={loadModules}
      />

      <QuizBuilderModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        lesson={activeQuizLesson}
      />
      {/* Custom Delete Dialog Overlay */}
      {deleteDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-noto-thai">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-[440px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold">ยืนยันการลบข้อมูล</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                {deleteDialog.type === "module"
                  ? "คุณแน่ใจหรือไม่ว่าต้องการลบโมดูลนี้? บทเรียนและข้อสอบทั้งหมดในโมดูลนี้จะถูกลบไปด้วย และไม่สามารถกู้คืนได้"
                  : "คุณแน่ใจหรือไม่ว่าต้องการลบบทเรียนนี้? ข้อมูลและข้อสอบภายในจะถูกลบอย่างถาวร"}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  setDeleteDialog({
                    show: false,
                    type: null,
                    id: null,
                    isDeleting: false,
                  })
                }
                disabled={deleteDialog.isDeleting}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={
                  deleteDialog.type === "module"
                    ? confirmDeleteModule
                    : confirmDeleteLesson
                }
                disabled={deleteDialog.isDeleting}
              >
                {deleteDialog.isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "ยืนยันลบ"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
