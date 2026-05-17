import React from "react";
import { Cpu, TrendingUp, Zap } from "lucide-react";

const OutcomesSection = () => {
  const outcomes = [
    {
      icon: <Cpu className="w-12 h-12 text-[#1B5E20]" />,
      title: "AI & IoT in Agriculture",
      description:
        "ประยุกต์ใช้ระบบปัญญาประดิษฐ์และอินเทอร์เน็ตสรรพสิ่งเพื่อการจัดการฟาร์มอัจฉริยะ การพยากรณ์ผลผลิต และการควบคุมสภาพแวดล้อม",
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-[#1B5E20]" />,
      title: "Modern Marketing",
      description:
        "ยกระดับการตลาดดิจิทัล การสร้างแบรนด์สินค้าเกษตร และการเข้าถึงตลาด e-commerce ทั้งในและต่างประเทศ",
    },
    {
      icon: <Zap className="w-12 h-12 text-[#1B5E20]" />,
      title: "Efficiency & Cost Reduction",
      description:
        "ลดต้นทุนการผลิตด้วยเทคโนโลยีแม่นยำสูง เพิ่มประสิทธิภาพการใช้ทรัพยากร และสร้างกำไรที่ยั่งยืน",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-4 font-noto-thai">
            สิ่งที่จะได้รับจากโครงการ
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-noto-thai">
            พัฒนาทักษะรอบด้านเพื่อก้าวสู่การเป็นผู้นำด้านเทคโนโลยีเกษตรในอนาคต
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {outcomes.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-6 p-6 rounded-3xl bg-green-50 group-hover:bg-[#1B5E20] group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 font-noto-thai">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed font-noto-thai">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutcomesSection;
