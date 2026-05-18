"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 font-noto-thai">
      <Card className="w-full max-w-md shadow-lg border-gray-100">
        <form onSubmit={handleLogin}>
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-[#1B5E20]">
              NPU Admin Portal
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              กรุณาเข้าสู่ระบบด้วยอีเมลผู้ดูแลระบบ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล (Email)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@npu.ac.th"
                className="focus-visible:ring-[#1B5E20]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน (Password)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-[#1B5E20]"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-[#1B5E20] hover:bg-[#154a19] text-white"
            >
              เข้าสู่ระบบ
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
