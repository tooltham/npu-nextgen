import HeroSection from "@/components/landing/HeroSection";
import CourseDetails from "@/components/landing/CourseDetails";
import EligibilitySection from "@/components/landing/EligibilitySection";
import OutcomesSection from "@/components/landing/OutcomesSection";
import PartnersSection from "@/components/landing/PartnersSection";
import FAQSection from "@/components/landing/FAQSection";
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
              className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity"
            >
              NPU NextGen
            </Link>
            <div className="hidden md:flex items-center gap-6 text-[12px] font-medium text-black/60">
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
          <Link
            href="/apply"
            className="rounded-full bg-[#1B5E20] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#154a19] transition-colors"
          >
            สมัครเลย
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Content Sections */}
      <div className="space-y-32 py-24">
        <section id="courses">
          <CourseDetails />
        </section>

        <section id="eligibility">
          <EligibilitySection />
        </section>

        <OutcomesSection />

        <section id="partners">
          <PartnersSection />
        </section>

        <section id="faq">
          <FAQSection />
        </section>
      </div>

      <footer className="bg-[#f5f5f7] py-24 text-center border-t border-black/5">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-4">
            Nakhon Phanom University
          </p>
          <p className="text-sm text-black/50">
            © {new Date().getFullYear()} ศูนย์วิจัยและพัฒนาเกษตรอัจฉริยะ
            (IoTES). All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
