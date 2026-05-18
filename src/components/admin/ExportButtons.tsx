"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";

export function ExportButtons() {
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

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
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCSV}
        disabled={isExportingCsv}
        className="font-noto-thai bg-white hover:bg-gray-50 text-gray-700"
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
        onClick={handleExportPDF}
        disabled={isExportingPdf}
        className="font-noto-thai bg-[#1B5E20] hover:bg-[#154a19] text-white"
      >
        {isExportingPdf ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileText className="mr-2 h-4 w-4" />
        )}
        PDF Report
      </Button>
    </div>
  );
}
