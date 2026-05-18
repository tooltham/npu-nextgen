"use client";

import React from "react";
import { useFormContext } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useStepValidation } from "@/hooks/useStepValidation";
import { backgroundSchema } from "@/schemas/applicationSchema";
import { Input } from "@/components/ui/input";

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-red-500 text-xs mt-1 font-noto-thai">{message}</p>
  ) : null;

const StepBackground = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  const { validate, errors } = useStepValidation(backgroundSchema);

  const targetGroups = [
    {
      id: "UNEMPLOYED",
      label: "ผู้ที่ยังไม่ได้ทำงาน ต้องการเรียนเพื่อประกอบอาชีพ",
    },
    { id: "FARMER", label: "เกษตรกร หรือ ทายาทเกษตรกร" },
    {
      id: "COMMUNITY_ENTERPRISE",
      label: "ผู้ประกอบการวิสาหกิจชุมชน หรือแรงงานในภาคการเกษตร",
    },
    { id: "OTHER", label: "อื่นๆ" },
  ];

  const educationMap: Record<string, string> = {
    HIGH_SCHOOL_OR_VOC: "มัธยมศึกษาตอนปลาย หรือ ปวช.",
    DIPLOMA: "ปวส.",
    BACHELOR: "ปริญญาตรี",
    ABOVE_BACHELOR: "สูงกว่าปริญญาตรี",
  };

  const toggleTargetGroup = (groupId: string) => {
    const currentGroups = formData.targetGroup
      ? (formData.targetGroup as unknown as string[])
      : [];
    const newGroups = currentGroups.includes(groupId)
      ? currentGroups.filter((id) => id !== groupId)
      : [...currentGroups, groupId];
    updateFormData({ targetGroup: newGroups });
  };

  const handleNext = () => {
    const isValid = validate({
      education: formData.education,
      targetGroup: formData.targetGroup as unknown as string[],
      targetGroupOther: formData.targetGroupOther,
      hasAgriExperience: formData.hasAgriExperience,
      agriExperienceYears: formData.agriExperienceYears,
      farmName: formData.farmName,
      farmLocation: formData.farmLocation,
    });
    if (isValid) nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1B5E20] font-noto-thai">
          ประวัติการทำงานและกลุ่มเป้าหมาย
        </h2>
        <p className="text-gray-600 font-noto-thai">
          เพื่อประเมินความเหมาะสมของหลักสูตรกับตัวท่าน
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="education" className="font-noto-thai font-bold">
            ระดับการศึกษาสูงสุด <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(val) =>
              updateFormData({
                education: val as
                  | "HIGH_SCHOOL_OR_VOC"
                  | "DIPLOMA"
                  | "BACHELOR"
                  | "ABOVE_BACHELOR",
              })
            }
            value={formData.education ?? ""}
          >
            <SelectTrigger
              className={`w-full font-noto-thai ${errors.education ? "border-red-400 ring-1 ring-red-400" : ""}`}
            >
              <SelectValue placeholder="เลือกการศึกษา">
                {formData.education
                  ? educationMap[formData.education]
                  : "เลือกการศึกษา"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="font-noto-thai">
              <SelectItem value="HIGH_SCHOOL_OR_VOC">
                มัธยมศึกษาตอนปลาย หรือ ปวช.
              </SelectItem>
              <SelectItem value="DIPLOMA">ปวส.</SelectItem>
              <SelectItem value="BACHELOR">ปริญญาตรี</SelectItem>
              <SelectItem value="ABOVE_BACHELOR">สูงกว่าปริญญาตรี</SelectItem>
            </SelectContent>
          </Select>
          <FieldError message={errors.education} />
        </div>

        <div className="space-y-3">
          <Label className="font-noto-thai font-bold">
            ท่านอยู่ในกลุ่มเป้าหมายใด (เลือกได้มากกว่า 1 ข้อ){" "}
            <span className="text-red-500">*</span>
          </Label>
          <div
            className={`grid grid-cols-1 gap-3 rounded-lg p-1 ${errors.targetGroup ? "ring-1 ring-red-400" : ""}`}
          >
            {targetGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={group.id}
                  checked={(
                    (formData.targetGroup as unknown as string[]) || []
                  ).includes(group.id)}
                  onCheckedChange={() => toggleTargetGroup(group.id)}
                />
                <label
                  htmlFor={group.id}
                  className="text-sm font-medium font-noto-thai cursor-pointer flex-1"
                >
                  {group.label}
                </label>
              </div>
            ))}
          </div>
          <FieldError message={errors.targetGroup} />
        </div>

        {((formData.targetGroup as unknown as string[]) || []).includes(
          "OTHER",
        ) && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="targetGroupOther" className="font-noto-thai">
              โปรดระบุกลุ่มเป้าหมายอื่นๆ
            </Label>
            <Input
              id="targetGroupOther"
              placeholder="ระบุกลุ่มเป้าหมายของท่าน..."
              className="font-noto-thai"
              value={formData.targetGroupOther || ""}
              onChange={(e) =>
                updateFormData({ targetGroupOther: e.target.value })
              }
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="font-noto-thai font-bold">
            มีประสบการณ์ด้านการเกษตรหรือไม่{" "}
            <span className="text-red-500">*</span>
          </Label>
          <div
            className={`flex gap-4 ${errors.hasAgriExperience ? "ring-1 ring-red-400 rounded-lg p-1" : ""}`}
          >
            <Button
              type="button"
              variant={
                formData.hasAgriExperience === true ? "default" : "outline"
              }
              className={`flex-1 font-noto-thai ${formData.hasAgriExperience === true ? "bg-[#1B5E20]" : ""}`}
              onClick={() => updateFormData({ hasAgriExperience: true })}
            >
              มีประสบการณ์
            </Button>
            <Button
              type="button"
              variant={
                formData.hasAgriExperience === false ? "default" : "outline"
              }
              className={`flex-1 font-noto-thai ${formData.hasAgriExperience === false ? "bg-[#1B5E20]" : ""}`}
              onClick={() => updateFormData({ hasAgriExperience: false })}
            >
              ไม่มีประสบการณ์
            </Button>
          </div>
          <FieldError message={errors.hasAgriExperience} />
        </div>

        {formData.hasAgriExperience === true && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="agriExperienceYears" className="font-noto-thai">
              ระบุจำนวนปีที่มีประสบการณ์
            </Label>
            <Select
              onValueChange={(val) =>
                updateFormData({ agriExperienceYears: parseInt(val || "0") })
              }
              value={formData.agriExperienceYears?.toString() ?? ""}
            >
              <SelectTrigger className="font-noto-thai">
                <SelectValue placeholder="จำนวนปี" />
              </SelectTrigger>
              <SelectContent className="font-noto-thai">
                <SelectItem value="1">1 ปี</SelectItem>
                <SelectItem value="2">2 ปี</SelectItem>
                <SelectItem value="3">3 ปี</SelectItem>
                <SelectItem value="5">มากกว่า 5 ปี</SelectItem>
                <SelectItem value="10">มากกว่า 10 ปี</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="farmName" className="font-noto-thai">
                  ชื่อฟาร์ม (ถ้ามี)
                </Label>
                <Input
                  id="farmName"
                  className="font-noto-thai"
                  placeholder="เช่น มินะฟาร์ม"
                  value={formData.farmName || ""}
                  onChange={(e) => updateFormData({ farmName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmLocation" className="font-noto-thai">
                  ที่ตั้งฟาร์ม (ถ้ามี)
                </Label>
                <Input
                  id="farmLocation"
                  className="font-noto-thai"
                  placeholder="เช่น อ.เมือง จ.นครพนม"
                  value={formData.farmLocation || ""}
                  onChange={(e) =>
                    updateFormData({ farmLocation: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {formData.hasAgriExperience === false && (
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold font-noto-thai text-sm">ข้อควรระวัง</p>
              <p className="text-xs font-noto-thai leading-relaxed">
                หลักสูตรนี้กำหนดให้ผู้สมัครต้องมีประสบการณ์ด้านการเกษตรแบบผสมผสาน
                ท่านสามารถสมัครได้แต่อาจส่งผลต่อการพิจารณาคัดเลือก
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
          className="font-noto-thai px-8"
        >
          ย้อนกลับ
        </Button>
        <Button
          onClick={handleNext}
          className="bg-[#1B5E20] hover:bg-[#154a19] text-white px-8 font-noto-thai"
        >
          ขั้นตอนถัดไป
        </Button>
      </div>
    </div>
  );
};

export default StepBackground;
