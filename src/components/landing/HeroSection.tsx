import React from "react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-white py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl lg:text-6xl font-bold text-[#1B5E20] leading-tight mb-6 font-noto-thai">
          นักจัดการฟาร์มเกษตรแบบผสมผสานอัจฉริยะ
        </h1>
        <p className="text-xl lg:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto font-noto-thai">
          ยกระดับเกษตรกรรมด้วย AI และ IoT
          เพื่อการจัดการฟาร์มอย่างยั่งยืนและมีประสิทธิภาพ
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-[#1B5E20] hover:bg-[#154d1a] text-white px-10 py-6 text-lg rounded-xl font-noto-thai shadow-lg">
            สมัครเข้าร่วมหลักสูตร
          </Button>
          <Button
            variant="outline"
            className="border-[#1B5E20] text-[#1B5E20] px-10 py-6 text-lg rounded-xl font-noto-thai"
          >
            ดูรายละเอียดหลักสูตร
          </Button>
        </div>
      </div>
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#F9A825]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-[#1B5E20]/5 rounded-full blur-3xl"></div>
    </section>
  );
}
