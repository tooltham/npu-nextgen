"use client";

import { useState } from "react";
import { Lock, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ForcePasswordModalProps {
  onClose?: () => void;
}

export default function ForcePasswordModal({
  onClose,
}: ForcePasswordModalProps = {}) {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/portal/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword: password }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
      }

      // Success, reload page to refresh session state
      if (onClose) {
        onClose();
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm p-4 font-noto-thai">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 text-center mb-2">
          {onClose ? "เปลี่ยนรหัสผ่าน" : "บังคับเปลี่ยนรหัสผ่าน"}
        </h2>
        <p className="text-zinc-500 text-center text-sm mb-8">
          {onClose
            ? "กรุณาตั้งรหัสผ่านใหม่สำหรับการเข้าสู่ระบบของคุณ"
            : "เพื่อความปลอดภัยของบัญชี กรุณาตั้งรหัสผ่านใหม่สำหรับการเข้าสู่ระบบครั้งแรกของคุณ"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">
              รหัสผ่านปัจจุบัน
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านปัจจุบันของคุณ"
              className="w-full pr-10"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">
              รหัสผ่านใหม่
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่านอย่างน้อย 8 ตัวอักษร แนะนำให้มีตัวเลขและตัวอักษร"
              className="w-full pr-10"
            />
            {password.length > 0 && (
              <div className="mt-2 text-xs font-medium">
                <div
                  className={`flex items-center gap-1.5 ${password.length >= 8 ? "text-emerald-600" : "text-amber-600"}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? "bg-emerald-600" : "bg-amber-600"}`}
                  />
                  ความยาวอย่างน้อย 8 ตัวอักษร
                </div>
                <div
                  className={`flex items-center gap-1.5 mt-1 ${/[0-9]/.test(password) && /[a-zA-Z]/.test(password) ? "text-emerald-600" : "text-amber-600"}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) && /[a-zA-Z]/.test(password) ? "bg-emerald-600" : "bg-amber-600"}`}
                  />
                  มีตัวอักษรภาษาอังกฤษและตัวเลข
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">
              ยืนยันรหัสผ่านใหม่
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านอีกครั้งให้ตรงกัน"
              className={`w-full pr-10 ${confirmPassword.length > 0 && password !== confirmPassword ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            />
            {confirmPassword.length > 0 && (
              <div className="mt-1.5 text-xs font-medium">
                {password === confirmPassword ? (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    รหัสผ่านตรงกัน
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    รหัสผ่านไม่ตรงกัน
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded border-zinc-300 text-amber-600 focus:ring-amber-600"
            />
            <label
              htmlFor="show-password"
              className="text-sm text-zinc-600 cursor-pointer"
            >
              แสดงรหัสผ่าน
            </label>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 font-medium text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-6 font-bold mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "บันทึกรหัสผ่านใหม่"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
