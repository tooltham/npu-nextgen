"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, Search } from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";

export function ExportButtons() {
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewDialog, setPreviewDialog] = useState<{
    show: boolean;
    type: "CSV" | "PDF" | null;
    csvData?: any[];
  }>({
    show: false,
    type: null,
  });

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const handlePreviewCSV = async () => {
    setIsLoadingPreview(true);
    try {
      const response = await fetch("/api/admin/export");
      const csvText = await response.text();
      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });
      setPreviewDialog({ show: true, type: "CSV", csvData: result.data });
    } catch (error) {
      console.error("Preview failed", error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handlePreviewPDF = () => {
    setPdfPreviewUrl("/api/admin/export/pdf?inline=true");
    setPreviewDialog({ show: true, type: "PDF" });
  };

  const closePreviewDialog = () => {
    setPreviewDialog({ show: false, type: null });
    setPdfPreviewUrl(null);
  };

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
          onClick={handlePreviewCSV}
          disabled={isExportingCsv || isLoadingPreview}
          className="font-noto-thai bg-white hover:bg-gray-50 text-gray-700 rounded-full font-bold px-4"
        >
          {isLoadingPreview && !previewDialog.show ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isExportingCsv ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4 text-[#1B5E20]" />
          )}
          ดูตัวอย่าง CSV
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handlePreviewPDF}
          disabled={isExportingPdf}
          className="font-noto-thai bg-[#1B5E20] hover:bg-[#154a19] text-white rounded-full font-bold px-4"
        >
          {isExportingPdf ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          ดูตัวอย่าง PDF
        </Button>
      </div>

      {/* Custom Preview Dialog Overlay */}
      {previewDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-noto-thai">
          <div
            className={`bg-white rounded-2xl p-7 shadow-2xl w-full max-w-5xl border border-zinc-100 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200 ${previewDialog.type === "PDF" ? "h-[90vh]" : "max-h-[90vh]"}`}
          >
            <div className="flex flex-col h-full overflow-hidden">
              <h3 className="text-2xl font-extrabold text-zinc-900 mb-1 shrink-0 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  {previewDialog.type === "CSV" ? (
                    <div className="p-2 bg-emerald-50 rounded-xl text-[#1B5E20]">
                      <Download className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="p-2 bg-emerald-50 rounded-xl text-[#1B5E20]">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                  ตัวอย่างข้อมูลก่อนส่งออก ({previewDialog.type})
                </span>

                {previewDialog.type === "PDF" && pdfPreviewUrl && (
                  <a
                    href={pdfPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1B5E20] hover:bg-green-50 rounded-full border border-green-200 transition-colors shrink-0"
                  >
                    เปิดในหน้าต่างใหม่ ↗
                  </a>
                )}
              </h3>
              <p className="text-sm text-zinc-500 mb-4 shrink-0">
                คุณสามารถตรวจสอบข้อมูลเบื้องต้นก่อนกดส่งออกได้
              </p>

              {/* CSV Preview Content */}
              {previewDialog.type === "CSV" && previewDialog.csvData && (
                <div className="mb-4 border rounded-xl overflow-hidden flex flex-col flex-1 min-h-0 bg-white">
                  <div className="overflow-auto flex-1">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-zinc-50 text-zinc-700 sticky top-0 shadow-sm z-10">
                        <tr>
                          {Object.keys(previewDialog.csvData[0] || {}).map(
                            (header) => (
                              <th
                                key={header}
                                className="px-3 py-2.5 font-bold whitespace-nowrap border-b border-zinc-200"
                              >
                                {header}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {previewDialog.csvData.slice(0, 10).map((row, i) => (
                          <tr
                            key={i}
                            className="hover:bg-emerald-50/30 transition-colors"
                          >
                            {Object.values(row).map((val: any, j) => (
                              <td
                                key={j}
                                className="px-3 py-2 whitespace-nowrap truncate max-w-[200px] text-zinc-600"
                              >
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-zinc-50 p-2.5 text-center text-xs font-medium text-zinc-500 border-t border-zinc-200 shrink-0">
                    แสดงตัวอย่าง 10 รายการแรก จากทั้งหมด{" "}
                    {previewDialog.csvData.length} รายการ
                  </div>
                </div>
              )}

              {/* PDF Preview Content */}
              {previewDialog.type === "PDF" && pdfPreviewUrl && (
                <div className="mb-4 border border-zinc-200 rounded-xl overflow-hidden flex-1 min-h-0 w-full bg-zinc-100/50">
                  <iframe
                    src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full block border-0"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end mt-2 shrink-0 pt-4 border-t border-zinc-100">
              <button
                onClick={closePreviewDialog}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                disabled={isExportingCsv || isExportingPdf}
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (previewDialog.type === "CSV") handleExportCSV();
                  else if (previewDialog.type === "PDF") handleExportPDF();
                  closePreviewDialog();
                }}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-[#1B5E20] hover:bg-[#154a19] transition-colors flex items-center gap-2 shadow-sm"
                disabled={isExportingCsv || isExportingPdf}
              >
                <Download className="w-4 h-4" />
                ยืนยันการส่งออกไฟล์
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
