"use client";

import React, { useState } from "react";

export default function CourseDetails() {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const modules = [
    {
      title: "AI & Smart Planning",
      desc: "พื้นฐาน AI และการวางแผนฟาร์มอัจฉริยะเพื่อการวิเคราะห์และพยากรณ์ผลผลิตแม่นยำสูง",
      gradient: "from-green-500 to-emerald-400",
      image: "ai_smart_planning",
      competency:
        "สามารถประยุกต์ใช้เทคโนโลยี AI ร่วมกับระบบ IoT ในการวิเคราะห์ปัญหาหน้างาน ติดตั้งระบบควบคุมอัตโนมัติ และบริหารจัดการฟาร์มของตนเองให้มีประสิทธิภาพสูงสุด",
      details: [
        "1. ความถูกต้องระบุปัญหาได้ตรงจุดและสอดคล้องกับบริบทพื้นที่จริง",
        "2. ทักษะการใช้ AI แสดงร่องรอยการเขียนคำสั่งที่ซับซ้อนและการตรวจสอบความถูกต้องของข้อมูลที่ได้จาก AI",
        "3. การบูรณาการแผนงานมีการนำแนวคิดเศรษฐกิจ BCG (ลดต้นทุน/เพิ่มมูลค่า/รักษ์โลก) มาประยุกต์ใช้ได้อย่างเหมาะสม",
      ],
    },
    {
      title: "IoT & Implementation",
      desc: "การติดตั้งระบบเซนเซอร์และอุปกรณ์ IoT สำหรับการควบคุมสภาพแวดล้อมฟาร์มแบบเรียลไทม์",
      gradient: "from-blue-500 to-cyan-400",
      image: "iot_implementation",
      competency:
        "สามารถประยุกต์ใช้เทคโนโลยี AI ร่วมกับระบบ IoT ในการวิเคราะห์ปัญหาหน้างาน ติดตั้งระบบควบคุมอัตโนมัติ และบริหารจัดการฟาร์มของตนเองให้มีประสิทธิภาพสูงสุด",
      details: [
        "1. ฟังก์ชันการทำงาน อุปกรณ์ Sensor และ Actuator ทำงานได้จริง เสถียร และแม่นยำ",
        "2. การแสดงผลข้อมูล ออกแบบ Dashboard บนมือถือได้สวยงาม อ่านค่าง่าย และสื่อความหมาย",
        "3. ประสิทธิภาพระบบช่วยลดการใช้ทรัพยากร หรือแก้ปัญหาหน้างานได้จริง",
        "4. ความปลอดภัยและจริยธรรม ติดตั้งระบบไฟฟ้าได้มาตรฐานความปลอดภัยและไม่มีการบิดเบือนข้อมูล",
      ],
    },
    {
      title: "AI-Commerce",
      desc: "การสร้างแบรนด์ดิจิทัลและการตลาดสมัยใหม่ด้วย Generative AI เพื่อเพิ่มมูลค่าสินค้าเกษตร",
      gradient: "from-[#F9A825] to-amber-400",
      image: "ai_commerce",
      competency:
        "สร้างสรรค์อัตลักษณ์แบรนด์และเนื้อหาการตลาดด้วยเครื่องมือ Generative AI พร้อมทั้งบริหารจัดการร้านค้าบนแพลตฟอร์มพาณิชย์ดิจิทัล เพื่อสร้างมูลค่าเพิ่มให้กับสินค้าเกษตรและขยายฐานลูกค้าได้จริง",
      details: [
        "1. ความคิดสร้างสรรค์ โดดเด่น และสื่อถึงอัตลักษณ์สินค้าได้",
        "2. การนำไปใช้จริงบนบรรจุภัณฑ์ได้",
        "3. จริยธรรมและลิขสิทธิ์ และเนื้อหาการโฆษณาไม่เกินจริง",
        "5. ร้านค้ามีการลงสินค้าครบถ้วน ตั้งค่าระบบชำระเงินและขนส่งเสร็จสมบูรณ์",
        "6. ร้านค้ามีความเคลื่อนไหว มีการโพสต์คอนเทนต์สม่ำเสมอ หรือมียอดคำสั่งซื้อเกิดขึ้นจริง",
        "7. การปฏิบัติตามกฎหมาย PDPA",
        "8. การตั้งราคาและต้นทุนได้อย่างเหมาะสม มีกำไร และอิงกับหลักการบัญชีเบื้องต้น",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="mb-20 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl text-[#1d1d1f] font-noto-thai">
          หลักสูตรการเรียนรู้
        </h2>
        <p className="mt-6 text-xl text-black/50 font-medium font-noto-thai">
          3 โมดูลเข้มข้น เพื่อการเป็นผู้จัดการฟาร์มมืออาชีพ
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {modules.map((item, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-[2.5rem] bg-[#f5f5f7] transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl hover:shadow-black/5 flex flex-col"
          >
            <div className="h-56 overflow-hidden">
              <img
                src={`/img/${item.image}.png`}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="p-10 flex flex-col flex-1">
              <div
                className={`mb-6 h-10 w-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold shadow-lg shadow-green-900/10`}
              >
                {idx + 1}
              </div>
              <h3 className="mb-4 text-2xl font-bold text-[#1d1d1f] tracking-tight font-noto-thai">
                {item.title}
              </h3>
              <p className="text-black/60 leading-relaxed font-medium font-noto-thai mb-6 flex-1">
                {item.desc}
              </p>
              <div className="mt-auto">
                <button
                  onClick={() => setSelectedModule(idx)}
                  className="text-sm font-bold text-[#1B5E20] hover:opacity-70 transition-opacity font-noto-thai flex items-center gap-1"
                >
                  ดูรายละเอียดสมรรถนะ →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Modal Window */}
      {selectedModule !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedModule(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-8 relative animate-in zoom-in-95 duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedModule(null)}
              className="absolute top-6 right-6 text-black/40 hover:text-black transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${modules[selectedModule].gradient} flex items-center justify-center text-white font-bold shadow-lg`}
              >
                {selectedModule + 1}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1d1d1f] font-noto-thai">
                  {modules[selectedModule].title}
                </h3>
                <p className="text-xs font-semibold text-[#1B5E20] uppercase tracking-wider">
                  รายละเอียดสมรรถนะ
                </p>
              </div>
            </div>

            <div className="mb-8 p-5 bg-green-50/50 rounded-2xl border border-green-100">
              <p className="text-[#1B5E20] font-medium font-noto-thai leading-relaxed">
                {modules[selectedModule].competency}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-[#1d1d1f] font-noto-thai text-lg">
                เกณฑ์การประเมินและรายละเอียด:
              </h4>
              <ul className="space-y-3">
                {modules[selectedModule].details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="text-black/70 font-medium font-noto-thai leading-relaxed bg-[#f5f5f7] p-4 rounded-xl hover:bg-[#f0f0f2] transition-colors"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
