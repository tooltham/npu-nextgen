"use client";

import React, { useState } from "react";
import { useFormContext } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ReviewSummary = () => {
  const { formData, goToStep, prevStep } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const sections = [
    {
      title: "ข้อมูลส่วนตัว",
      step: 1,
      items: [
        {
          label: "ชื่อ-นามสกุล (TH)",
          value: `${formData.titleTh} ${formData.firstNameTh} ${formData.lastNameTh}`,
        },
        {
          label: "Name (EN)",
          value: `${formData.firstNameEn} ${formData.lastNameEn}`,
        },
        {
          label: "เลขประจำตัวประชาชน",
          value: formData.nationalId?.replace(
            /(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/,
            "$1-XXXX-XXXXX-$4-$5",
          ),
        },
        { label: "อีเมล", value: formData.email },
        { label: "เบอร์โทรศัพท์", value: formData.phone },
      ],
    },
    {
      title: "ประวัติการทำงานและกลุ่มเป้าหมาย",
      step: 2,
      items: [
        { label: "ระดับการศึกษา", value: formData.education },
        {
          label: "กลุ่มเป้าหมาย",
          value: (formData.targetGroup as unknown as string[])?.join(", "),
        },
        {
          label: "ประสบการณ์การเกษตร",
          value: formData.hasAgriExperience
            ? `${formData.agriExperienceYears} ปี`
            : "ไม่มีประสบการณ์",
        },
      ],
    },
    {
      title: "ความพร้อมและความคาดหวัง",
      step: 3,
      items: [
        { label: "ทักษะดิจิทัล", value: formData.digitalSkillLevel },
        {
          label: "ความพร้อมด้านเวลา",
          value: formData.canCommitTime ? "พร้อมเข้าร่วม 100%" : "ไม่แน่ใจ",
        },
        {
          label: "ความคาดหวัง",
          value: (formData.expectations as unknown as string[])?.join(", "),
          fullWidth: true,
        },
      ],
    },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Re-structure to match backend applicationSchema
      const payload = {
        personalInfo: {
          email: formData.email,
          titleTh: formData.titleTh,
          firstNameTh: formData.firstNameTh,
          lastNameTh: formData.lastNameTh,
          firstNameEn: formData.firstNameEn,
          lastNameEn: formData.lastNameEn,
          nationalId: formData.nationalId,
          phone: formData.phone,
          lineId: formData.lineId || "",
        },
        background: {
          education: formData.education,
          targetGroup: formData.targetGroup,
          hasAgriExperience: formData.hasAgriExperience,
          agriExperienceYears: formData.agriExperienceYears,
        },
        readiness: {
          digitalSkillLevel: formData.digitalSkillLevel,
          expectations: formData.expectations,
          expectationsOther: formData.expectationsOther || "",
          canCommitTime: formData.canCommitTime,
        },
        consent: {
          granted: true,
          consentVersion: "v1.0",
          consentText: "PDPA Consent Statement",
        },
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        sessionStorage.removeItem("npu_nextgen_form");
        router.push("/apply/success");
      } else {
        setError(result.error || "เกิดข้อผิดพลาดในการส่งข้อมูล");
      }
    } catch (err) {
      setError("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ โปรดลองอีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-[#1B5E20]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1B5E20] font-noto-thai">
          ตรวจสอบข้อมูลของท่าน
        </h2>
        <p className="text-gray-600 font-noto-thai">
          กรุณาตรวจสอบข้อมูลก่อนการยืนยันส่งใบสมัคร
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <Card key={idx} className="overflow-hidden border-gray-200">
            <CardHeader className="bg-gray-50 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-700 font-noto-thai">
                {section.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToStep(section.step)}
                className="text-[#1B5E20] hover:bg-green-50 gap-1 font-noto-thai"
                disabled={isSubmitting}
              >
                <Edit2 className="w-4 h-4" /> แก้ไข
              </Button>
            </CardHeader>
            <CardContent className="py-4 font-noto-thai">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className={item.fullWidth ? "md:col-span-2" : ""}
                  >
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-gray-800 font-medium break-all">
                      {item.value || "-"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-noto-thai text-center">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          className="font-noto-thai px-8"
          disabled={isSubmitting}
        >
          ย้อนกลับ
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#F9A825] hover:bg-[#e69b20] text-black font-bold px-10 text-lg font-noto-thai"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
              กำลังส่งข้อมูล...
            </>
          ) : (
            "ยืนยันส่งใบสมัคร"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewSummary;
