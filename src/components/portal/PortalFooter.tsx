import { Sprout } from "lucide-react";

export default function PortalFooter() {
  return (
    <footer className="w-full border-t border-zinc-200/60 bg-white/50 backdrop-blur-sm mt-auto font-noto-thai">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-500">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold tracking-tight">
              NPU NextGen
            </span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs font-medium text-zinc-400">
              © {new Date().getFullYear()} IoTES Research Lab — Nakhon Phanom
              University.
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              แพลตฟอร์มการเรียนรู้และจัดการโครงการ นักจัดการฟาร์มเกษตรอัจฉริยะ
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
