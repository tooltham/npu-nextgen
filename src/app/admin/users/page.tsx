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

  useEffect(() => {
    loadUsers();
  }, []);

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
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-noto-thai">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block"
          >
            &larr; กลับหน้า Admin Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8 text-[#1B5E20]" />
              จัดการข้อมูลผู้เรียน
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, นามสกุล หรืออีเมล..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
              />
            </div>
            <div className="text-sm text-gray-500">
              พบผู้เรียนทั้งหมด{" "}
              <span className="font-bold text-gray-900">
                {filteredUsers.length}
              </span>{" "}
              คน
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b">
                <tr>
                  <th className="px-6 py-4">ข้อมูลผู้เรียน</th>
                  <th className="px-6 py-4">ความคืบหน้าการเรียน</th>
                  <th className="px-6 py-4">คะแนนทดสอบ</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      ไม่พบข้อมูลผู้เรียนที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-base">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          โทร: {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[120px] bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#1B5E20] h-2 rounded-full"
                              style={{ width: `${user.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold text-[#1B5E20] w-10 text-right">
                            {user.progressPercentage}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          เรียนจบ {user.completedLessonsCount} /{" "}
                          {user.totalLessons} บท
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <BarChart className="h-4 w-4 text-purple-500" />
                          <span className="font-medium text-gray-900">
                            {user.quizStats.correct} / {user.quizStats.total}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ข้อที่ตอบถูก (ทั้งหมด)
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium border border-green-200">
                            <ShieldCheck className="h-3 w-3" /> ใช้งานปกติ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-medium border border-red-200">
                            <ShieldOff className="h-3 w-3" /> ระงับสิทธิ์
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant={user.isActive ? "destructive" : "outline"}
                          size="sm"
                          className="shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-noto-thai">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-[440px] flex flex-col justify-between">
            <div>
              <div
                className={`flex items-center gap-3 mb-4 ${confirmDialog.currentStatus ? "text-red-600" : "text-blue-600"}`}
              >
                <ShieldOff className="w-6 h-6" />
                <h3 className="text-lg font-bold">ยืนยันการดำเนินการ</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการ{" "}
                <span className="font-bold text-gray-900">
                  {confirmDialog.currentStatus ? "ระงับสิทธิ์" : "เปิดใช้งาน"}
                </span>{" "}
                ผู้เรียนคนนี้?
                {confirmDialog.currentStatus &&
                  " หากระงับสิทธิ์ ผู้เรียนจะไม่สามารถเข้าสู่ระบบได้ชั่วคราว"}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
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
                className={
                  confirmDialog.currentStatus
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }
                onClick={confirmToggleUserStatus}
                disabled={confirmDialog.isProcessing}
              >
                {confirmDialog.isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "ยืนยัน"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
