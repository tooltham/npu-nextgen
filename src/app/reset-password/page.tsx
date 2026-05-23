"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sprout, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("ไม่พบ Token สำหรับการรีเซ็ตรหัสผ่าน");
      return;
    }
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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาด");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-xl border border-gray-100 text-center w-full">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ลิงก์ไม่ถูกต้อง
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          ไม่พบ Token สำหรับรีเซ็ตรหัสผ่าน
          กรุณาตรวจสอบลิงก์จากอีเมลของคุณอีกครั้ง
        </p>
        <Link href="/admin/login" className="w-full inline-block">
          <Button className="w-full h-11 bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold rounded-xl">
            กลับไปหน้าเข้าสู่ระบบ
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <Link href="/admin/login" className="inline-block mx-auto mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1B5E20] text-white shadow-lg mx-auto hover:bg-[#154a19] transition-colors">
            <Sprout className="h-8 w-8" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          ตั้งรหัสผ่านใหม่
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          กรุณาตั้งรหัสผ่านใหม่เพื่อเข้าใช้งานบัญชีของคุณ
        </p>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
        {success ? (
          <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              เปลี่ยนรหัสผ่านสำเร็จ
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว
              คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที
            </p>
            <Link href="/admin/login" className="w-full inline-block">
              <Button className="w-full h-11 bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold rounded-xl shadow-md">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2 relative">
              <Label
                htmlFor="password"
                className="text-sm font-bold text-zinc-700"
              >
                รหัสผ่านใหม่
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่านอย่างน้อย 8 ตัวอักษร"
                className="h-12 focus-visible:ring-[#1B5E20] pr-10"
                required
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

            <div className="space-y-2 relative">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-bold text-zinc-700"
              >
                ยืนยันรหัสผ่านใหม่
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านอีกครั้งให้ตรงกัน"
                className={`h-12 focus-visible:ring-[#1B5E20] pr-10 ${confirmPassword.length > 0 && password !== confirmPassword ? "border-red-300 focus-visible:ring-red-500" : ""}`}
                required
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

            <div className="flex items-center gap-2 pt-1 pb-2">
              <input
                type="checkbox"
                id="show-password"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="rounded border-zinc-300 text-[#1B5E20] focus:ring-[#1B5E20]"
              />
              <label
                htmlFor="show-password"
                className="text-sm font-medium text-zinc-600 cursor-pointer"
              >
                แสดงรหัสผ่าน
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={
                  loading || password.length < 8 || password !== confirmPassword
                }
                className="w-full h-12 bg-[#1B5E20] hover:bg-[#154a19] text-white text-base font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "บันทึกรหัสผ่านใหม่"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 font-noto-thai">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#1B5E20]" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
