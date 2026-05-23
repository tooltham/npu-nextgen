"use client";

import { useState } from "react";
import Link from "next/link";
import { Sprout, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 font-noto-thai">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/admin/login" className="inline-block mx-auto mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1B5E20] text-white shadow-lg mx-auto hover:bg-[#154a19] transition-colors">
              <Sprout className="h-8 w-8" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            รีเซ็ตรหัสผ่าน
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            กรอกอีเมลบัญชีของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
          {success ? (
            <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                ส่งลิงก์สำเร็จ
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                หากอีเมล <strong>{email}</strong> อยู่ในระบบ
                เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปให้แล้ว
                กรุณาตรวจสอบกล่องจดหมายของคุณ (รวมถึงโฟลเดอร์สแปม)
              </p>
              <Link href="/admin/login" className="w-full inline-block">
                <Button className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl">
                  กลับไปหน้าเข้าสู่ระบบ
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-zinc-700"
                >
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@npu.ac.th หรืออีเมลที่ใช้สมัคร"
                  className="h-12 focus-visible:ring-[#1B5E20]"
                  required
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-12 bg-[#1B5E20] hover:bg-[#154a19] text-white text-base font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "ส่งลิงก์รีเซ็ตรหัสผ่าน"
                  )}
                </Button>

                <Link
                  href="/admin/login"
                  className="flex items-center justify-center gap-2 w-full h-12 text-zinc-600 hover:bg-zinc-50 font-bold rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  กลับไปหน้าเข้าสู่ระบบ
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
