"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge, ApplicationStatus } from "./StatusBadge";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { ApplicationDetailModal } from "./ApplicationDetailModal";

type AppRow = {
  id: string;
  firstNameTh: string;
  lastNameTh: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
};

export function ApplicationTable() {
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete state
  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean;
    id: string | null;
  }>({ show: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteDialog({ show: false, id: null });
        fetchData(); // Refresh table
      } else {
        alert("ลบข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setSelectedAppId(id);
      setIsModalOpen(true);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/applications?page=${page}&search=${encodeURIComponent(debouncedSearch)}`,
      );
      const json = await res.json();
      if (res.ok) {
        setData(json.data);
        setTotalPages(json.meta.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);
  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="ค้นหาชื่อ หรือ อีเมล..."
          className="pl-9 font-noto-thai bg-white border-gray-200"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/80 text-gray-600 font-noto-thai border-b border-gray-200">
            <tr>
              <th className="px-5 py-3.5 font-medium">ชื่อ-สกุล</th>
              <th className="px-5 py-3.5 font-medium">อีเมล / เบอร์โทร</th>
              <th className="px-5 py-3.5 font-medium">วันที่สมัคร</th>
              <th className="px-5 py-3.5 font-medium">สถานะ</th>
              <th className="px-5 py-3.5 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-noto-thai">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#1B5E20]" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  ไม่พบข้อมูลใบสมัคร
                </td>
              </tr>
            ) : (
              (data as AppRow[]).map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {app.firstNameTh} {app.lastNameTh}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    <div>{app.email}</div>
                    <div className="text-xs">{app.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={app.status as ApplicationStatus} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition-all duration-300 shadow-sm flex items-center gap-1.5 font-noto-thai"
                        onClick={() => {
                          setSelectedAppId(app.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        ดูข้อมูล
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm flex items-center gap-1.5 font-noto-thai"
                        onClick={() =>
                          setDeleteDialog({ show: true, id: app.id })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                        ลบ
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500 font-noto-thai">
          หน้า {page} จาก {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="font-noto-thai"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> ก่อนหน้า
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="font-noto-thai"
          >
            ถัดไป <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      {/* Delete Confirmation Dialog Overlay */}
      {deleteDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-noto-thai">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-[440px] min-h-[255px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold">ยืนยันการลบข้อมูล</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                คุณต้องการลบใบสมัครนี้ใช่หรือไม่?
                การดำเนินการนี้ไม่สามารถย้อนกลับได้
                และข้อมูลทั้งหมดรวมถึงประวัติการดำเนินการจะถูกลบอย่างถาวร
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ show: false, id: null })}
                disabled={deleting}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleDelete(deleteDialog.id!)}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "ยืนยันลบ"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ApplicationDetailModal
        applicationId={selectedAppId || ""}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdated={fetchData}
      />
    </div>
  );
}
