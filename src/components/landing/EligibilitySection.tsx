import React from "react";
import { CheckCircle2 } from "lucide-react";

const EligibilitySection = () => {
  const requirements = [
    "บุคคลสัญชาติไทยที่มีความตั้งใจพัฒนาทักษะดิจิทัล",
    "เกษตรกร ผู้ประกอบการชุมชน หรือผู้ที่สนใจด้านการเกษตร",
    "สามารถเข้าร่วมกิจกรรมได้ตลอดระยะเวลาที่กำหนด",
    "มีความพร้อมในการนำเทคโนโลยีไปประยุกต์ใช้ในพื้นที่จริง",
    "จบการศึกษาขั้นพื้นฐานหรือมีประสบการณ์เทียบเท่า",
  ];

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-[#1B5E20] p-8 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4 font-noto-thai">
              คุณสมบัติผู้สมัคร
            </h2>
            <p className="opacity-90 font-noto-thai">
              ตรวจสอบความพร้อมของท่านเพื่อเข้าร่วมเป็นส่วนหนึ่งของนวัตกรเกษตรยุคใหม่
            </p>
          </div>
          <div className="md:w-2/3 p-8 md:p-12">
            <ul className="space-y-4">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#F9A825] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg font-noto-thai">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EligibilitySection;
