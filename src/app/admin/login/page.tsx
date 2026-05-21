"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex min-h-screen font-noto-thai">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2e7d32] to-[#0F766E] items-center justify-center p-12">
        {/* Dot Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 max-w-md text-white text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Sprout className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            NPU NextGen
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            ระบบจัดการผู้สมัครโครงการ
            <br />
            นักจัดการฟาร์มเกษตรอัจฉริยะ
          </p>
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-white/40">
            <span>IoTES Research Lab</span>
            <span>•</span>
            <span>มหาวิทยาลัยนครพนม</span>
          </div>
        </div>

        {/* Floating Glow */}
        <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] bg-white/5 blur-[100px] rounded-full" />
        <div className="absolute -top-20 -right-20 h-[250px] w-[250px] bg-teal-300/10 blur-[80px] rounded-full" />
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-gray-50/50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1B5E20] text-white">
              <Sprout className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-[#1B5E20]">NPU NextGen</h1>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                เข้าสู่ระบบผู้ดูแล
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                กรุณากรอกอีเมลและรหัสผ่านเพื่อดำเนินการต่อ
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 focus-visible:ring-[#1B5E20]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  รหัสผ่าน
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 focus-visible:ring-[#1B5E20]"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#1B5E20] hover:bg-[#154a19] text-white text-base font-semibold"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-xs text-gray-400">
              Powered by IoTES — Nakhon Phanom University
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
