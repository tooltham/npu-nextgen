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
        "1. สร้างสรรค์อัตลักษณ์และนำไปใช้จริงบนบรรจุภัณฑ์ได้โดดเด่น",
        "2. เคารพจริยธรรม ลิขสิทธิ์ ไม่โฆษณาเกินจริง และทำตาม PDPA",
        "3. บริหารร้านค้าดิจิทัลสมบูรณ์ (ข้อมูล, ชำระเงิน, ขนส่ง, คอนเทนต์)",
        "4. คำนวณต้นทุน/ราคาเหมาะสมตามหลักบัญชีเบื้องต้น",
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
            className="group relative overflow-hidden rounded-[2.5rem] bg-black transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1B5E20]/20 flex flex-col h-[480px] cursor-pointer"
            onClick={() => setSelectedModule(idx)}
          >
            {/* Background Image */}
            <img
              src={`/img/${item.image}.png`}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

            {/* Content Floating at Bottom */}
            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col transform transition-transform duration-500 ease-out group-hover:-translate-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-lg font-bold shadow-lg border border-white/20`}
                >
                  {idx + 1}
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight font-noto-thai leading-tight drop-shadow-md">
                  {item.title}
                </h3>
              </div>

              {/* Expandable Content (Visible on Hover) */}
              <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
                <p className="text-white/80 leading-relaxed font-medium font-noto-thai text-sm mb-6 pt-2 border-t border-white/10 mt-2">
                  {item.desc}
                </p>

                <div className="inline-flex items-center text-sm font-bold text-emerald-400 font-noto-thai gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                  <span>ดูรายละเอียดสมรรถนะ</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
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
