"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge, ApplicationStatus } from "./StatusBadge";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
              <th className="px-5 py-3.5 font-medium text-right">จัดการ</th>
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
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#1B5E20] hover:bg-green-50"
                      onClick={() => {
                        setSelectedAppId(app.id);
                        setIsModalOpen(true);
                      }}
                    >
                      ดูข้อมูล
                    </Button>
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
      <ApplicationDetailModal
        applicationId={selectedAppId || ""}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdated={fetchData}
      />
    </div>
  );
}
