/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Lesson } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Loader2, X, Save } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { FileUpload } from "./FileUpload";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  moduleId: string | null;
  onSuccess: () => void;
}

export function LessonEditorModal({
  isOpen,
  onClose,
  lesson,
  moduleId,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"VIDEO" | "TEXT" | "QUIZ">("VIDEO");
  const [videoUrl, setVideoUrl] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [dripDays, setDripDays] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setType(lesson.type as "VIDEO" | "TEXT" | "QUIZ");
      setVideoUrl(lesson.videoUrl || "");
      setDocumentUrl(lesson.documentUrl || "");
      setContent(lesson.content || "");
      setIsPreview(lesson.isPreview);
      setDripDays(lesson.dripDays);
    } else {
      setTitle("");
      setType("VIDEO");
      setVideoUrl("");
      setDocumentUrl("");
      setContent("");
      setIsPreview(false);
      setDripDays(0);
    }
  }, [lesson, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = lesson
        ? `/api/admin/courses/lessons/${lesson.id}`
        : `/api/admin/courses/lessons`;

      const method = lesson ? "PUT" : "POST";

      const payload = {
        title,
        type,
        moduleId,
        videoUrl: videoUrl || null,
        documentUrl: documentUrl || null,
        content: content || null,
        isPreview,
        dripDays,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert("Failed to save lesson");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-noto-thai">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          <h2 className="text-lg font-bold">
            {lesson ? "แก้ไขบทเรียน" : "สร้างบทเรียนใหม่"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4 overflow-y-auto flex-1"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อบทเรียน <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
              placeholder="เช่น พื้นฐานการให้น้ำอัจฉริยะ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภทบทเรียน
            </label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "VIDEO" | "TEXT" | "QUIZ")
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
              disabled={!!lesson} // Cannot change type after creation easily
            >
              <option value="VIDEO">วิดีโอ (YouTube)</option>
              <option value="TEXT">บทความ / เนื้อหาอ่าน</option>
              <option value="QUIZ">แบบทดสอบ (Quiz)</option>
            </select>
          </div>

          {type === "VIDEO" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === "TEXT"
                ? "เนื้อหาบทความ"
                : "คำอธิบาย / คำแนะนำสำหรับผู้เรียน (Optional)"}
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {type === "QUIZ" && (
            <div className="bg-purple-50 p-3 rounded-md text-sm text-purple-700 border border-purple-100">
              💡 บันทึกบทเรียนนี้ก่อน แล้วไปสร้าง/แก้ไขคำถามในเมนู
              &quot;จัดการแบบทดสอบ&quot;
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ไฟล์เอกสารประกอบ (Optional)
            </label>
            <FileUpload
              value={documentUrl}
              onChange={setDocumentUrl}
              onRemove={() => setDocumentUrl("")}
              label="อัปโหลด PDF/เอกสาร"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPreview}
                  onChange={(e) => setIsPreview(e.target.checked)}
                  className="rounded border-gray-300 text-[#1B5E20] focus:ring-[#1B5E20]"
                />
                เปิดให้ดูฟรี (Preview)
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                ผู้ที่ยังไม่สมัครเรียนสามารถเข้าดูบทเรียนนี้ได้
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จำนวนวันหน่วงเนื้อหา (Drip Days)
              </label>
              <input
                type="number"
                min="0"
                value={dripDays}
                onChange={(e) => setDripDays(parseInt(e.target.value) || 0)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
              />
              <p className="text-xs text-gray-500 mt-1">
                ปล่อยเนื้อหาหลังจากลงทะเบียนเรียนแล้วกี่วัน (0 = ดูได้ทันที)
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 shrink-0 border-t mt-4">
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
