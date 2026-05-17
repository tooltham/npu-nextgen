import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import CourseDetails from "@/components/landing/CourseDetails";
import EligibilitySection from "@/components/landing/EligibilitySection";
import OutcomesSection from "@/components/landing/OutcomesSection";
import PartnersSection from "@/components/landing/PartnersSection";
import FAQSection from "@/components/landing/FAQSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-noto-thai">
      {/* Navigation (Simple) */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-[#1B5E20]">NPU NextGen</div>
          <Link href="/apply">
            <Button className="bg-[#1B5E20] hover:bg-[#154a19] text-white">
              สมัครเรียน
            </Button>
          </Link>
        </div>
      </nav>

      <HeroSection />

      <div id="details">
        <CourseDetails />
      </div>

      <EligibilitySection />
      <OutcomesSection />
      <PartnersSection />
      <FAQSection />

      {/* Footer CTA */}
      <section className="py-20 bg-[#1B5E20] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            พร้อมที่จะเป็นผู้นำเกษตรอัจฉริยะแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            เปิดรับสมัครแล้ววันนี้ - จำนวนจำกัดเพื่อคุณภาพการเรียนการสอนสูงสุด
          </p>
          <Link href="/apply">
            <Button className="bg-[#F9A825] hover:bg-[#e69b20] text-black font-bold px-12 py-8 text-xl rounded-2xl shadow-xl">
              สมัครเข้าร่วมหลักสูตรตอนนี้
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-10 border-t bg-gray-50 text-gray-500 text-center">
        <div className="container mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Nakhon Phanom University. All rights
            reserved.
          </p>
          <p className="text-sm mt-2">
            ศูนย์วิจัยและพัฒนาเกษตรอัจฉริยะ (IoTES)
          </p>
        </div>
      </footer>
    </main>
  );
}
