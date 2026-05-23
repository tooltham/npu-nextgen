"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";

export function ExportButtons() {
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    type: "CSV" | "PDF" | null;
  }>({
    show: false,
    type: null,
  });

  const handleExportCSV = async () => {
    setIsExportingCsv(true);
    try {
      window.location.href = "/api/admin/export";
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setTimeout(() => setIsExportingCsv(false), 2000);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPdf(true);
    try {
      window.location.href = "/api/admin/export/pdf";
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setTimeout(() => setIsExportingPdf(false), 2000);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmDialog({ show: true, type: "CSV" })}
          disabled={isExportingCsv}
          className="font-noto-thai bg-white hover:bg-gray-50 text-gray-700 rounded-full font-bold px-4"
        >
          {isExportingCsv ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          CSV
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => setConfirmDialog({ show: true, type: "PDF" })}
          disabled={isExportingPdf}
          className="font-noto-thai bg-[#1B5E20] hover:bg-[#154a19] text-white rounded-full font-bold px-4"
        >
          {isExportingPdf ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          PDF Report
        </Button>
      </div>

      {/* Custom Confirm Dialog Overlay */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-noto-thai">
          <div className="bg-white rounded-2xl p-7 shadow-2xl w-full max-w-md border border-zinc-100 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
            <div>
              <div className="flex items-center gap-3 mb-4 text-[#1B5E20] bg-emerald-50 w-fit p-2 rounded-xl">
                {confirmDialog.type === "CSV" ? (
                  <Download className="w-6 h-6" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                ยืนยันการส่งออกข้อมูล
              </h3>
              <p className="text-sm text-zinc-500 mb-6">
                คุณต้องการส่งออกข้อมูลรายงานสรุปในรูปแบบ {confirmDialog.type}{" "}
                ใช่หรือไม่?
              </p>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setConfirmDialog({ show: false, type: null })}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (confirmDialog.type === "CSV") handleExportCSV();
                  else if (confirmDialog.type === "PDF") handleExportPDF();
                  setConfirmDialog({ show: false, type: null });
                }}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-[#1B5E20] hover:bg-[#154a19] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                ยืนยันการส่งออก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
