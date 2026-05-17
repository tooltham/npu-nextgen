export default function CourseDetails() {
  const modules = [
    {
      title: "AI & Smart Planning",
      desc: "พื้นฐาน AI และการวางแผนฟาร์มอัจฉริยะเพื่อการวิเคราะห์และพยากรณ์ผลผลิตแม่นยำสูง",
      gradient: "from-green-500 to-emerald-400",
    },
    {
      title: "IoT & Implementation",
      desc: "การติดตั้งระบบเซนเซอร์และอุปกรณ์ IoT สำหรับการควบคุมสภาพแวดล้อมฟาร์มแบบเรียลไทม์",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      title: "AI-Commerce",
      desc: "การสร้างแบรนด์ดิจิทัลและการตลาดสมัยใหม่ด้วย Generative AI เพื่อเพิ่มมูลค่าสินค้าเกษตร",
      gradient: "from-[#F9A825] to-amber-400",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="mb-20 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl text-[#1d1d1f]">
          หลักสูตรการเรียนรู้
        </h2>
        <p className="mt-6 text-xl text-black/50 font-medium">
          3 โมดูลเข้มข้น เพื่อการเป็นผู้จัดการฟาร์มมืออาชีพ
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {modules.map((item, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-[2.5rem] bg-[#f5f5f7] p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl hover:shadow-black/5"
          >
            <div
              className={`mb-8 h-14 w-14 rounded-[1.25rem] bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-40 transition-opacity`}
            />
            <h3 className="mb-4 text-2xl font-bold text-[#1d1d1f] tracking-tight">
              {item.title}
            </h3>
            <p className="text-black/60 leading-relaxed font-medium">
              {item.desc}
            </p>
            <div className="mt-10">
              <span className="text-sm font-bold text-[#1B5E20] group-hover:underline underline-offset-4 decoration-2">
                ดูรายละเอียดสมรรถนะ →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
