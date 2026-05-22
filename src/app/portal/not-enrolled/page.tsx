import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "ไม่พบสิทธิ์เข้าเรียน | NPU NextGen",
  description: "คุณยังไม่ได้รับสิทธิ์หรือสิทธิ์เข้าเรียนหมดอายุ",
};

export default function NotEnrolledPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-zinc-200 text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            ไม่พบสิทธิ์เข้าเรียน
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            บัญชีของคุณยังไม่ได้รับสิทธิ์ในการเข้าถึงห้องเรียนออนไลน์
            หรือสิทธิ์ของคุณอาจถูกระงับ/หมดอายุ
            กรุณาติดต่อผู้ดูแลระบบหากคุณคิดว่านี่คือข้อผิดพลาด
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/portal"
            className="inline-flex justify-center w-full px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
          >
            กลับสู่หน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
