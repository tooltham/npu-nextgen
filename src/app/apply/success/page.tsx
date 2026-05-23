import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, BookOpen, Mail, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12 font-noto-thai">
      <div className="max-w-2xl w-full space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-2">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            ส่งใบสมัครเรียบร้อยแล้ว
          </h1>
          <p className="text-gray-600 text-lg">
            มหาวิทยาลัยนครพนมได้รับข้อมูลของท่านแล้ว
            ระบบได้ส่งอีเมลยืนยันไปที่ที่อยู่อีเมลที่ท่านระบุ
          </p>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <div className="bg-[#1B5E20] p-4 text-white text-center font-medium">
            ขั้นตอนต่อไป (Next Steps)
          </div>
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#1B5E20]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    ตรวจสอบอีเมลยืนยัน
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    หากไม่พบในกล่องขาเข้า โปรดตรวจสอบในเมนู &quot;อีเมลขยะ&quot;
                    (Junk/Spam)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#1B5E20]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    ประกาศรายชื่อผู้มีสิทธิ์เข้าร่วม
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ทีมงานจะพิจารณาคุณสมบัติและประกาศผลทางอีเมลและหน้าเว็บไซต์โครงการ
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 h-auto text-gray-600 border-gray-200"
            >
              กลับสู่หน้าหลัก
            </Button>
          </Link>
          <Link href="https://iotes-sitc.npu.ac.th/">
            <Button className="w-full sm:w-auto bg-[#1B5E20] hover:bg-[#154a19] text-white px-8 py-6 h-auto">
              ดูเว็บไซต์โครงการ <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
