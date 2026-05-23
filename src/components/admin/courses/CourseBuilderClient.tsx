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
    <div className="space-y-8 font-noto-thai pb-10">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-zinc-200/60">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">โครงสร้างหลักสูตร</h2>
          <p className="text-sm text-zinc-500">
            จัดการลำดับโมดูลและบทเรียนทั้งหมด
          </p>
        </div>
        <Button
          className="bg-[#1B5E20] hover:bg-[#154a19] text-white shadow-md shadow-[#1B5E20]/20 rounded-full px-6"
          onClick={() => {
            setEditingModule(null);
            setIsModuleModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          สร้างโมดูลใหม่
        </Button>
      </div>

      <div className="space-y-6">
        {modules.map((mod, index) => (
          <div
            key={mod.id}
            className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-zinc-300"
          >
            {/* Module Header */}
            <div className="bg-zinc-50/50 border-b border-zinc-100 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
              <div className="flex items-center gap-4">
                {/* Reorder Buttons */}
                <div className="flex flex-col bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm shrink-0">
                  <button
                    onClick={() => moveModule(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    title="เลื่อนขึ้น"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <div className="h-px bg-zinc-200 w-full" />
                  <button
                    onClick={() => moveModule(index, "down")}
                    disabled={index === modules.length - 1}
                    className="p-1.5 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    title="เลื่อนลง"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Module Info */}
                <div>
                  <h3 className="font-extrabold text-lg text-zinc-900 flex items-center gap-2">
                    <span className="text-[#1B5E20] font-black">
                      โมดูล {index + 1}:
                    </span>
                    {mod.title}
                  </h3>
                  {mod.description && (
                    <p className="text-sm text-zinc-500 mt-1 line-clamp-2 max-w-2xl">
                      {mod.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Module Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span
                  className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                    mod.status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-zinc-100 text-zinc-600 border-zinc-200"
                  }`}
                >
                  {mod.status}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-zinc-600 hover:text-zinc-900 border-zinc-200"
                    onClick={() => {
                      setEditingModule(mod);
                      setIsModuleModalOpen(true);
                    }}
                    title="แก้ไขโมดูล"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-100"
                    onClick={() =>
                      setDeleteDialog({
                        show: true,
                        type: "module",
                        id: mod.id,
                        isDeleting: false,
                      })
                    }
                    title="ลบโมดูล"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <div className="p-5 space-y-3 bg-white">
              {mod.lessons.length === 0 && (
                <div className="text-sm text-zinc-400 text-center py-10 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50 flex flex-col items-center gap-3">
                  <HelpCircle className="w-8 h-8 text-zinc-300" />
                  <p>ยังไม่มีบทเรียนในโมดูลนี้</p>
                </div>
              )}

              {mod.lessons.map((lesson, lIndex) => (
                <div
                  key={lesson.id}
                  className="group bg-white border border-zinc-200/80 rounded-xl p-3.5 flex flex-col xl:flex-row xl:items-center justify-between hover:border-[#1B5E20]/40 hover:shadow-md hover:shadow-[#1B5E20]/5 transition-all gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Lesson Reorder */}
                    <div className="flex flex-col bg-zinc-50 border border-zinc-200 rounded-md overflow-hidden shrink-0">
                      <button
                        onClick={() => moveLesson(index, lIndex, "up")}
                        disabled={lIndex === 0}
                        className="p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-30 transition-colors"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveLesson(index, lIndex, "down")}
                        disabled={lIndex === mod.lessons.length - 1}
                        className="p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-30 transition-colors"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Lesson Icon */}
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 shadow-sm border ${
                        lesson.type === "VIDEO"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : lesson.type === "TEXT"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-purple-50 text-purple-600 border-purple-100"
                      }`}
                    >
                      {lesson.type === "VIDEO" && <Video className="h-5 w-5" />}
                      {lesson.type === "TEXT" && (
                        <FileText className="h-5 w-5" />
                      )}
                      {lesson.type === "QUIZ" && (
                        <HelpCircle className="h-5 w-5" />
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div>
                      <span className="font-bold text-sm text-zinc-900 block group-hover:text-[#1B5E20] transition-colors">
                        บทที่ {lIndex + 1}: {lesson.title}
                      </span>
                      <div className="flex gap-2 mt-1.5 flex-wrap">
                        {lesson.isPreview && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-bold">
                            Preview (ดูฟรี)
                          </span>
                        )}
                        {lesson.dripDays > 0 && (
                          <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200 font-bold">
                            ปลดล็อค {lesson.dripDays} วัน
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lesson Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 xl:opacity-60 xl:group-hover:opacity-100 transition-opacity mt-3 xl:mt-0 ml-14 xl:ml-0">
                    {lesson.type === "QUIZ" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 bg-purple-50/50 shadow-sm rounded-lg"
                        onClick={() => {
                          setActiveQuizLesson(lesson);
                          setIsQuizModalOpen(true);
                        }}
                      >
                        จัดการแบบทดสอบ
                      </Button>
                    )}

                    <Link
                      href="/portal/classroom"
                      target="_blank"
                      className="hidden sm:block"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        title="พรีวิวบทเรียน"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                      onClick={() => {
                        setEditingLesson(lesson);
                        setActiveModuleId(mod.id);
                        setIsLessonModalOpen(true);
                      }}
                      title="แก้ไขบทเรียน"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() =>
                        setDeleteDialog({
                          show: true,
                          type: "lesson",
                          id: lesson.id,
                          isDeleting: false,
                        })
                      }
                      title="ลบบทเรียน"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full mt-4 border-dashed border-2 hover:border-[#1B5E20] hover:text-[#1B5E20] hover:bg-[#1B5E20]/5 text-zinc-500 rounded-xl py-6 bg-zinc-50/50 transition-colors shadow-sm"
                onClick={() => {
                  setEditingLesson(null);
                  setActiveModuleId(mod.id);
                  setIsLessonModalOpen(true);
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                เพิ่มบทเรียนใหม่
              </Button>
            </div>
          </div>
        ))}

        {modules.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200 mb-4 shadow-inner">
              <BookOpen className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              ยังไม่มีโครงสร้างหลักสูตร
            </h3>
            <p className="text-zinc-500 mb-6 max-w-sm">
              เริ่มต้นสร้างเนื้อหาการเรียนรู้โดยการเพิ่มโมดูลแรกของคุณ
            </p>
            <Button
              className="bg-[#1B5E20] hover:bg-[#154a19] text-white shadow-md rounded-full px-6"
              onClick={() => {
                setEditingModule(null);
                setIsModuleModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              สร้างโมดูลแรก
            </Button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-noto-thai">
          <div className="bg-white rounded-2xl p-7 shadow-2xl w-full max-w-md border border-zinc-100 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
            <div>
              <div className="flex items-center gap-3 mb-4 text-rose-600 bg-rose-50 w-fit p-2 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                ยืนยันการลบข้อมูล
              </h3>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                {deleteDialog.type === "module"
                  ? "คุณแน่ใจหรือไม่ว่าต้องการลบโมดูลนี้? บทเรียนและข้อสอบทั้งหมดในโมดูลนี้จะถูกลบไปด้วย และไม่สามารถกู้คืนได้"
                  : "คุณแน่ใจหรือไม่ว่าต้องการลบบทเรียนนี้? ข้อมูลและข้อสอบภายในจะถูกลบอย่างถาวร"}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-full px-5"
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
                className="bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 rounded-full px-5"
                onClick={
                  deleteDialog.type === "module"
                    ? confirmDeleteModule
                    : confirmDeleteLesson
                }
                disabled={deleteDialog.isDeleting}
              >
                {deleteDialog.isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {deleteDialog.isDeleting ? "กำลังลบ..." : "ยืนยันการลบ"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
