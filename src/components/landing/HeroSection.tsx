import Link from "next/link";
import { Sprout } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#0a1a0d] via-[#1B5E20] to-[#0d3b2a] animate-mesh-gradient opacity-[0.04]" />

      {/* Dot Grid Pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1B5E20 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Cinematic Glow Orbs */}
      <div className="absolute -top-24 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 bg-gradient-to-r from-green-100/60 via-emerald-50/40 to-teal-100/60 blur-[150px] rounded-full animate-mesh-gradient" />
      <div className="absolute bottom-20 -left-40 -z-10 h-[300px] w-[300px] bg-emerald-200/20 blur-[120px] rounded-full animate-float" />
      <div
        className="absolute top-40 -right-40 -z-10 h-[250px] w-[250px] bg-teal-200/20 blur-[100px] rounded-full animate-float"
        style={{ animationDelay: "3s" }}
      />

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Badge */}
        <div className="mb-8 mt-12 inline-flex items-center gap-2 rounded-full bg-[#1B5E20]/10 px-4 py-2 text-sm font-semibold text-[#1B5E20] border border-[#1B5E20]/10">
          <Sprout className="h-4 w-4" />
          Non-Degree Certificate Program
        </div>

        <h1 className="max-w-5xl text-5xl font-bold md:text-7xl lg:text-9xl leading-[1.15]">
          <span className="block bg-gradient-to-b from-[#1d1d1f] to-[#1d1d1f]/60 bg-clip-text text-transparent">
            นักจัดการฟาร์ม
          </span>
          <span className="mt-2 block bg-gradient-to-r from-[#1B5E20] via-[#2e7d32] to-[#0F766E] bg-clip-text text-transparent">
            เกษตรอัจฉริยะ
          </span>
        </h1>

        <p className="mx-auto mt-10 max-w-2xl text-lg font-medium text-black/60 md:text-2xl leading-relaxed">
          ยกระดับเกษตรกรรมด้วย AI และ IoT <br className="hidden md:block" />
          ปั้นนวัตกรเกษตรยุคใหม่ สู่การจัดการฟาร์มที่ยั่งยืน
        </p>

        <div className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center h-16 rounded-full bg-[#1B5E20] px-12 text-lg font-semibold text-white transition-all hover:bg-[#154a19] hover:scale-105 animate-pulse-glow"
          >
            เริ่มใบสมัครของคุณ
          </Link>
        </div>

        {/* Stats Counter */}
        <div className="mt-24 mx-auto max-w-4xl rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl shadow-green-900/5 p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 md:divide-x divide-black/10">
            <div className="flex flex-col items-center justify-center">
              <p className="text-4xl md:text-5xl font-black text-[#1d1d1f] tracking-tight mb-2">
                3
              </p>
              <p className="text-sm font-bold text-black/50 uppercase tracking-wide">
                โมดูลเข้มข้น
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-4xl md:text-5xl font-black text-[#1d1d1f] tracking-tight mb-2">
                16-20
              </p>
              <p className="text-sm font-bold text-black/50 uppercase tracking-wide">
                สัปดาห์
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-4xl md:text-5xl font-black text-[#1d1d1f] tracking-tight mb-2">
                40
              </p>
              <p className="text-sm font-bold text-black/50 uppercase tracking-wide">
                ที่นั่งต่อรุ่น
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-4xl md:text-5xl font-black text-[#1B5E20] tracking-tight mb-2">
                ฟรี
              </p>
              <p className="text-sm font-bold text-[#1B5E20]/70 uppercase tracking-wide">
                ไม่มีค่าใช้จ่าย
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Floor Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
