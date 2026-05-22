"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, File, X } from "lucide-react";

interface Props {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove: () => void;
  accept?: string;
  label?: string;
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  accept = "*/*",
  label = "อัปโหลดไฟล์",
}: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  if (value) {
    return (
      <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
        <File className="h-5 w-5 text-gray-500" />
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-[#1B5E20] hover:underline flex-1 truncate"
        >
          {value.split("/").pop()}
        </a>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isUploading ? "กำลังอัปโหลด..." : label}
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
