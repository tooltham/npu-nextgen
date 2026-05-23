/* eslint-disable react-hooks/set-state-in-effect */
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
  UserPlus,
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

  const [successDialog, setSuccessDialog] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteDialog({ show: false, id: null });
        setSuccessDialog({ show: true, message: "ลบข้อมูลสำเร็จ" });
        fetchData(); // Refresh table
      } else {
        setSuccessDialog({ show: true, message: "ลบข้อมูลไม่สำเร็จ" });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setSuccessDialog({ show: true, message: "เกิดข้อผิดพลาดในการลบ" });
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="ค้นหาชื่อ หรือ อีเมล..."
          className="pl-9 font-noto-thai bg-white border-zinc-200 rounded-full focus-visible:ring-[#1B5E20]/20 focus-visible:border-[#1B5E20]"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50/80 text-zinc-500 text-xs uppercase font-bold tracking-wider border-b border-zinc-200/80">
            <tr>
              <th className="px-5 py-3.5 font-medium">ชื่อ-สกุล</th>
              <th className="px-5 py-3.5 font-medium">อีเมล / เบอร์โทร</th>
              <th className="px-5 py-3.5 font-medium">วันที่สมัคร</th>
              <th className="px-5 py-3.5 font-medium">สถานะ</th>
              <th className="px-5 py-3.5 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-noto-thai">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#1B5E20]/50" />
                  <p className="text-sm text-zinc-400 mt-3">
                    กำลังโหลดข้อมูลใบสมัคร...
                  </p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-16 text-center text-zinc-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200 mb-4 shadow-inner">
                      <UserPlus className="w-8 h-8 text-zinc-300" />
                    </div>
                    <p className="font-bold text-zinc-700">
                      ไม่พบข้อมูลใบสมัคร
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              (data as AppRow[]).map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-zinc-50/50 transition-colors group"
                >
                  <td className="px-5 py-4 font-medium text-zinc-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B5E20]/10 text-[#1B5E20] text-sm font-bold">
                        {app.firstNameTh?.charAt(0) || "?"}
                      </div>
                      <span className="font-extrabold group-hover:text-[#1B5E20] transition-colors">
                        {app.firstNameTh} {app.lastNameTh}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    <div className="font-medium text-xs">{app.email}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {app.phone}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 font-medium">
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
                        className="rounded-full border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all shadow-sm flex items-center gap-1.5"
                        onClick={() => {
                          setSelectedAppId(app.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        ดูข้อมูล
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-none h-8 w-8"
                        onClick={() =>
                          setDeleteDialog({ show: true, id: app.id })
                        }
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2 pt-2">
        <p className="text-sm text-zinc-500 font-noto-thai font-medium">
          หน้า {page} จาก {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="font-noto-thai rounded-full px-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> ก่อนหน้า
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="font-noto-thai rounded-full px-4"
          >
            ถัดไป <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      {/* Delete Confirmation Dialog Overlay */}
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
                คุณต้องการลบใบสมัครนี้ใช่หรือไม่?
                การดำเนินการนี้ไม่สามารถย้อนกลับได้
                และข้อมูลทั้งหมดรวมถึงประวัติการดำเนินการจะถูกลบอย่างถาวร
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-full px-5"
                onClick={() => setDeleteDialog({ show: false, id: null })}
                disabled={deleting}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 rounded-full px-5"
                onClick={() => handleDelete(deleteDialog.id!)}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {deleting ? "กำลังลบ..." : "ยืนยันการลบ"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Message Dialog Overlay */}
      {successDialog.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 font-noto-thai">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-[400px] text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">แจ้งเตือน</h3>
            <p className="text-gray-600 text-sm mb-6">
              {successDialog.message}
            </p>
            <Button
              className="w-full bg-[#1B5E20] hover:bg-[#154a19] text-white"
              onClick={() => setSuccessDialog({ show: false, message: "" })}
            >
              ตกลง
            </Button>
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
