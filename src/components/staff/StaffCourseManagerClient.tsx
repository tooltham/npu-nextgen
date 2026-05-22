"use client";

import { useState } from "react";
import {
  Plus,
  GripVertical,
  Edit2,
  Trash2,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Module = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED";
  thumbnail: string | null;
  _count: { lessons: number };
};

export default function StaffCourseManagerClient({
  initialModules,
}: {
  initialModules: Module[];
  currentUser: any;
}) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();

  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean;
    moduleId: string | null;
  }>({ show: false, moduleId: null });

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch("/api/staff/courses/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          order: modules.length,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setModules([...modules, { ...result.data, _count: { lessons: 0 } }]);
        setNewTitle("");
        setIsCreating(false);
        router.refresh();
      } else {
        alert("Error creating module");
      }
    } catch (e) {
      console.error(e);
      alert("Error creating module");
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: "DRAFT" | "PUBLISHED",
  ) => {
    const newStatus = currentStatus === "DRAFT" ? "PUBLISHED" : "DRAFT";
    try {
      const res = await fetch(`/api/staff/courses/modules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setModules(
          modules.map((m) => (m.id === id ? { ...m, status: newStatus } : m)),
        );
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = async () => {
    if (!deleteDialog.moduleId) return;
    try {
      const res = await fetch(
        `/api/staff/courses/modules/${deleteDialog.moduleId}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setModules(modules.filter((m) => m.id !== deleteDialog.moduleId));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteDialog({ show: false, moduleId: null });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              จัดการหลักสูตร
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              สร้างและจัดการโมดูลเนื้อหา
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            สร้างโมดูลใหม่
          </button>
        </div>

        {isCreating && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 flex items-center gap-4">
            <input
              type="text"
              placeholder="ชื่อโมดูลใหม่..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
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
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 flex items-center gap-4 group hover:border-zinc-300 transition-colors"
            >
              <div className="cursor-grab p-1 text-zinc-400 hover:text-zinc-600">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-zinc-900">{module.title}</h3>
                <p className="text-sm text-zinc-500 mt-0.5">
                  {module._count.lessons} บทเรียน
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleStatus(module.id, module.status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    module.status === "PUBLISHED"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  }`}
                >
                  {module.status === "PUBLISHED" ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
                </button>

                <Link
                  href={`/staff/courses/${module.id}`}
                  className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  title="จัดการบทเรียน"
                >
                  <LinkIcon className="w-5 h-5" />
                </Link>

                <button
                  onClick={() =>
                    setDeleteDialog({ show: true, moduleId: module.id })
                  }
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="ลบโมดูล"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {modules.length === 0 && !isCreating && (
            <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200 border-dashed">
              <p className="text-zinc-500">ยังไม่มีโมดูลเนื้อหา</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Delete Dialog Overlay */}
      {deleteDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-noto-thai">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-[440px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold">ยืนยันการลบโมดูล</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการลบโมดูลนี้?
                บทเรียนทั้งหมดภายในโมดูลนี้จะถูกลบอย่างถาวร
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ show: false, moduleId: null })}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDelete}
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
