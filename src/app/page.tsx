import HeroSection from "@/components/landing/HeroSection";
import CourseDetails from "@/components/landing/CourseDetails";
import EligibilitySection from "@/components/landing/EligibilitySection";
import OutcomesSection from "@/components/landing/OutcomesSection";
import PartnersSection from "@/components/landing/PartnersSection";
import FAQSection from "@/components/landing/FAQSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Sprout } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans antialiased text-[#1d1d1f]">
      {/* Sleek Minimalist Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
            >
              <Sprout className="h-5 w-5 text-[#1B5E20]" />
              NPU NextGen
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-black/60">
              <Link
                href="#courses"
                className="hover:text-black transition-colors"
              >
                หลักสูตร
              </Link>
              <Link
                href="#eligibility"
                className="hover:text-black transition-colors"
              >
                คุณสมบัติ
              </Link>
              <Link href="#faq" className="hover:text-black transition-colors">
                คำถามที่พบบ่อย
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="hidden sm:block text-sm font-medium text-black/60 hover:text-black transition-colors"
            >
              เข้าสู่ห้องเรียน
            </Link>
            <Link
              href="/apply"
              className="rounded-full bg-[#1B5E20] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#154a19] transition-colors"
            >
              สมัครเลย
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Content Sections */}
      <div className="space-y-32 py-24">
        <ScrollReveal>
          <section id="courses">
            <CourseDetails />
          </section>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <section id="eligibility">
            <EligibilitySection />
          </section>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <OutcomesSection />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <section id="partners">
            <PartnersSection />
          </section>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <section id="faq">
            <FAQSection />
          </section>
        </ScrollReveal>
      </div>

      <footer className="bg-gray-900 py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <Sprout className="h-5 w-5 text-emerald-400" />
              <span className="text-lg font-bold text-white">NPU NextGen</span>
            </div>
            <p className="text-gray-400">
              หน่วยวิจัยอินเตอร์เน็ตของสรรพสิ่งและระบบสมองกลฝังตัว (IoTES)
            </p>
            <p className="text-gray-400">
              วิทยาลัยเทคโนโลยีอุตสาหกรรมศรีสงคราม
            </p>
            <p className="text-gray-400">มหาวิทยาลัยนครพนม</p>
          </div>
          <div className="space-y-2 text-gray-400 md:text-right flex flex-col md:items-end justify-center">
            <p>129 หมู่ 7 ถ.ศรีสงคราม-ท่าดอกแก้ว</p>
            <p>ต.ศรีสงคราม อ.ศรีสงคราม จ.นครพนม 48150</p>
            <p>Tel: 082 887 6739</p>
            <p>Email: iotes@npu.ac.th</p>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Internet of Things and Embedded System
            Research Laboratory (IoTES). All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
