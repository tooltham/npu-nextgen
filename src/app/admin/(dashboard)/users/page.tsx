/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Loader2,
  BarChart,
  MoreVertical,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  progressPercentage: number;
  completedLessonsCount: number;
  totalLessons: number;
  quizStats: {
    total: number;
    correct: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    userId: string | null;
    currentStatus: boolean;
    isProcessing: boolean;
  }>({ show: false, userId: null, currentStatus: false, isProcessing: false });

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleUserStatusClick = (
    userId: string,
    currentStatus: boolean,
  ) => {
    setConfirmDialog({
      show: true,
      userId,
      currentStatus,
      isProcessing: false,
    });
  };

  const confirmToggleUserStatus = async () => {
    if (!confirmDialog.userId) return;

    setConfirmDialog((prev) => ({ ...prev, isProcessing: true }));
    try {
      const res = await fetch(`/api/admin/users/${confirmDialog.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !confirmDialog.currentStatus }),
      });
      if (res.ok) {
        loadUsers();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmDialog({
        show: false,
        userId: null,
        currentStatus: false,
        isProcessing: false,
      });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-10 font-noto-thai pb-16">
      <div className="mx-auto max-w-[1280px] space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-[#1B5E20]" />
              จัดการข้อมูลผู้เรียน
            </h1>
            <p className="text-zinc-500 font-medium">
              ตรวจสอบสถานะและความคืบหน้าของผู้เรียนทั้งหมด
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            <div className="text-sm text-zinc-500 hidden sm:block mr-2">
              ผู้เรียนทั้งหมด{" "}
              <span className="font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-full">
                {filteredUsers.length}
              </span>{" "}
              คน
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, นามสกุล หรืออีเมล..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 shadow-sm rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="bg-zinc-50/80 text-zinc-500 text-xs uppercase font-bold tracking-wider border-b border-zinc-200/80">
                <tr>
                  <th className="px-6 py-4">ข้อมูลผู้เรียน</th>
                  <th className="px-6 py-4">ความคืบหน้าการเรียน</th>
                  <th className="px-6 py-4">คะแนนทดสอบ</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#1B5E20]/50" />
                      <p className="text-sm text-zinc-400 mt-3">
                        กำลังโหลดข้อมูลผู้เรียน...
                      </p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center text-zinc-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200 mb-4 shadow-inner">
                          <Users className="w-8 h-8 text-zinc-300" />
                        </div>
                        <p className="font-bold text-zinc-700">
                          ไม่พบข้อมูลผู้เรียนที่ค้นหา
                        </p>
                        <p className="text-sm text-zinc-400 mt-1">
                          ลองเปลี่ยนคำค้นหาใหม่อีกครั้ง
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-zinc-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-zinc-900 text-base group-hover:text-[#1B5E20] transition-colors">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-zinc-500 font-medium mt-0.5">
                          {user.email}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-zinc-200"></span>
                          โทร: {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[120px] bg-zinc-100 rounded-full h-2.5 overflow-hidden border border-zinc-200/50 shadow-inner">
                            <div
                              className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] h-full rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${user.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="font-black text-[#1B5E20] w-10 text-right text-xs">
                            {user.progressPercentage}%
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-zinc-500 mt-1.5 bg-zinc-50 w-fit px-2 py-0.5 rounded-md border border-zinc-100">
                          เรียนจบ{" "}
                          <span className="text-zinc-800 font-bold">
                            {user.completedLessonsCount}
                          </span>{" "}
                          / {user.totalLessons} บท
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 bg-purple-50 rounded-md">
                            <BarChart className="h-3.5 w-3.5 text-purple-600" />
                          </div>
                          <span className="font-bold text-zinc-900 text-sm">
                            {user.quizStats.correct}{" "}
                            <span className="text-zinc-400 font-normal">
                              / {user.quizStats.total}
                            </span>
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1">
                          ข้อที่ตอบถูก (ทั้งหมด)
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] px-3 py-1 rounded-full font-bold border border-emerald-200 uppercase tracking-wide">
                            <ShieldCheck className="h-3.5 w-3.5" /> ใช้งานปกติ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-[11px] px-3 py-1 rounded-full font-bold border border-rose-200 uppercase tracking-wide">
                            <ShieldOff className="h-3.5 w-3.5" /> ระงับสิทธิ์
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`rounded-full px-4 text-xs font-bold transition-all shadow-sm ${
                            user.isActive
                              ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                              : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                          }`}
                          onClick={() =>
                            handleToggleUserStatusClick(user.id, user.isActive)
                          }
                        >
                          {user.isActive ? "ระงับสิทธิ์" : "เปิดใช้งาน"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Confirm Dialog Overlay */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-noto-thai">
          <div className="bg-white rounded-2xl p-7 shadow-2xl w-full max-w-md border border-zinc-100 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
            <div>
              <div
                className={`flex items-center gap-3 mb-4 w-fit p-2 rounded-xl ${
                  confirmDialog.currentStatus
                    ? "text-rose-600 bg-rose-50"
                    : "text-emerald-600 bg-emerald-50"
                }`}
              >
                {confirmDialog.currentStatus ? (
                  <ShieldOff className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                ยืนยันการดำเนินการ
              </h3>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                คุณแน่ใจหรือไม่ว่าต้องการ
                <span
                  className={`font-bold mx-1 ${confirmDialog.currentStatus ? "text-rose-600" : "text-emerald-600"}`}
                >
                  {confirmDialog.currentStatus ? "ระงับสิทธิ์" : "เปิดใช้งาน"}
                </span>
                ผู้เรียนคนนี้?
                {confirmDialog.currentStatus &&
                  " หากระงับสิทธิ์ ผู้เรียนจะไม่สามารถเข้าสู่ระบบได้ชั่วคราว"}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-full px-5"
                onClick={() =>
                  setConfirmDialog({
                    show: false,
                    userId: null,
                    currentStatus: false,
                    isProcessing: false,
                  })
                }
                disabled={confirmDialog.isProcessing}
              >
                ยกเลิก
              </Button>
              <Button
                className={`rounded-full px-5 shadow-md ${
                  confirmDialog.currentStatus
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                }`}
                onClick={confirmToggleUserStatus}
                disabled={confirmDialog.isProcessing}
              >
                {confirmDialog.isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : confirmDialog.currentStatus ? (
                  <ShieldOff className="w-4 h-4 mr-2" />
                ) : (
                  <ShieldCheck className="w-4 h-4 mr-2" />
                )}
                {confirmDialog.isProcessing ? "กำลังดำเนินการ..." : "ยืนยัน"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
