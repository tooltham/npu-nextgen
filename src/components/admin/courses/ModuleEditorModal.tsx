/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { CourseModule } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Loader2, X, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  module: CourseModule | null;
  onSuccess: () => void;
}

export function ModuleEditorModal({
  isOpen,
  onClose,
  module,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (module) {
      setTitle(module.title);
      setDescription(module.description || "");
      setStatus(module.status as "DRAFT" | "PUBLISHED");
    } else {
      setTitle("");
      setDescription("");
      setStatus("DRAFT");
    }
  }, [module, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = module
        ? `/api/admin/courses/modules/${module.id}`
        : `/api/admin/courses/modules`;

      const method = module ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert("Failed to save module");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-noto-thai">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">
            {module ? "แก้ไขโมดูล" : "สร้างโมดูลใหม่"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อโมดูล <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
              placeholder="เช่น การวางแผนเกษตรอัจฉริยะ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รายละเอียด (ย่อ)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
              rows={3}
              placeholder="อธิบายสั้น ๆ เกี่ยวกับโมดูลนี้"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สถานะ
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "DRAFT" | "PUBLISHED")
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
            >
              <option value="DRAFT">DRAFT (ซ่อนไว้ก่อน)</option>
              <option value="PUBLISHED">PUBLISHED (เผยแพร่ให้ผู้เรียน)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#1B5E20] hover:bg-[#154a19] text-white rounded-full font-bold px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              บันทึก
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
