import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background Cinematic Glow */}
      <div className="absolute -top-24 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 bg-green-50/50 blur-[150px] rounded-full" />

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="max-w-5xl text-5xl font-bold tracking-tighter md:text-7xl lg:text-9xl leading-[1.05]">
          <span className="block bg-gradient-to-b from-[#1d1d1f] to-[#1d1d1f]/60 bg-clip-text text-transparent">
            นักจัดการฟาร์ม
          </span>
          <span className="mt-2 block bg-gradient-to-b from-[#1B5E20] to-[#2e7d32] bg-clip-text text-transparent">
            เกษตรอัจฉริยะ
          </span>
        </h1>

        <p className="mx-auto mt-10 max-w-2xl text-lg font-medium text-black/60 md:text-2xl leading-relaxed">
          ยกระดับเกษตรกรรมด้วย AI และ IoT <br className="hidden md:block" />
          ปั้นนวัตกรเกษตรยุคใหม่ สู่การจัดการฟาร์มที่ยั่งยืน
        </p>

        <div className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <Link href="/apply">
            <Button className="h-16 rounded-full bg-[#1B5E20] px-12 text-lg font-semibold text-white transition-all hover:bg-[#154a19] hover:scale-105 shadow-xl shadow-green-900/10">
              เริ่มใบสมัครของคุณ
            </Button>
          </Link>
          <Link
            href="#courses"
            className="group flex items-center gap-2 text-xl font-medium text-[#1B5E20] hover:underline underline-offset-8 decoration-2"
          >
            เรียนรู้เพิ่มเติม
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      {/* Decorative Floor Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
