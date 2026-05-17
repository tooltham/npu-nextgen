import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Building2 } from "lucide-react";

const CourseDetails = () => {
  const details = [
    {
      icon: <Calendar className="w-8 h-8 text-[#1B5E20]" />,
      title: "ระยะเวลาหลักสูตร",
      value: "16 - 20 สัปดาห์",
      description: "เรียนรู้เข้มข้นทั้งภาคทฤษฎีและปฏิบัติ",
    },
    {
      icon: <Clock className="w-8 h-8 text-[#1B5E20]" />,
      title: "จำนวนชั่วโมงเรียน",
      value: "285 ชั่วโมง",
      description: "ครอบคลุมทักษะดิจิทัลและเกษตรสมัยใหม่",
    },
    {
      icon: <Building2 className="w-8 h-8 text-[#1B5E20]" />,
      title: "หน่วยงานผู้จัด",
      value: "มหาวิทยาลัยนครพนม",
      description: "ร่วมกับเครือข่ายความร่วมมือทางวิชาการ",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#1B5E20] font-noto-thai">
          รายละเอียดหลักสูตร
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {details.map((item, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="flex flex-col items-center pb-2">
                <div className="p-4 rounded-full bg-green-50 mb-4">
                  {item.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800 font-noto-thai">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-[#F9A825] mb-2 font-noto-thai">
                  {item.value}
                </p>
                <p className="text-gray-600 font-noto-thai">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;
