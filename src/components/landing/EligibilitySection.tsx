export default function EligibilitySection() {
  const requirements = [
    "เกษตรกร หรือ ทายาทเกษตรกร ที่ต้องการยกระดับฟาร์ม",
    "ผู้ประกอบการวิสาหกิจชุมชน หรือ แรงงานในภาคเกษตร",
    "มีความมุ่งมั่นพัฒนาทักษะ AI และ IoT อย่างจริงจัง",
    "สามารถเข้าร่วมกิจกรรมได้ตลอด 16-20 สัปดาห์",
    "จบการศึกษามัธยมศึกษาตอนปลาย หรือ ปวช. ขึ้นไป",
  ];

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="rounded-[3rem] bg-[#f5f5f7] p-12 md:p-24 relative overflow-hidden">
        {/* Subtle Decorative Circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/30 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl text-[#1d1d1f]">
            คุณสมบัติผู้สมัคร
          </h2>
          <p className="mt-6 text-center text-black/40 font-medium text-lg italic">
            "เรามองหาผู้ที่พร้อมจะเปลี่ยนผ่านสู่โลกเกษตรดิจิทัล"
          </p>

          <div className="mt-20 grid gap-8 md:grid-cols-1 max-w-2xl mx-auto">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B5E20] text-white shadow-lg shadow-green-900/20 group-hover:scale-110 transition-transform">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-black/80 leading-snug">
                  {req}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 border-t border-black/5 pt-12 text-center">
            <p className="text-sm font-bold text-black/30 uppercase tracking-widest">
              รับสมัครจำนวนจำกัดเพียง 40 ท่านต่อรุ่น
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
