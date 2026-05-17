"use client";

import React from "react";
import { useFormContext } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const StepReadiness = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const expectationOptions = [
    {
      id: "AI_IOT_FARM",
      label: "ต้องการใช้ AI และ IoT ในการวิเคราะห์และจัดการฟาร์ม",
    },
    {
      id: "DIGITAL_MARKETING",
      label: "ต้องการทักษะการสร้างแบรนด์และการตลาดดิจิทัล",
    },
    {
      id: "REDUCE_COST",
      label: "ต้องการนำเทคโนโลยีมาลดต้นทุนและเพิ่มมูลค่าผลผลิต",
    },
    { id: "OTHER_EXP", label: "อื่นๆ" },
  ];

  const toggleExpectation = (id: string) => {
    const current = formData.expectations
      ? (formData.expectations as unknown as string[])
      : [];
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    updateFormData({ expectations: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1B5E20] font-noto-thai">
          ความพร้อมและความคาดหวัง
        </h2>
        <p className="text-gray-600 font-noto-thai">
          ข้อมูลนี้จะถูกใช้เป็นเกณฑ์สำคัญในการคัดเลือก
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="digitalSkillLevel"
            className="font-noto-thai font-bold"
          >
            ระดับทักษะดิจิทัลพื้นฐาน
          </Label>
          <Select
            onValueChange={(val) => updateFormData({ digitalSkillLevel: val })}
            defaultValue={formData.digitalSkillLevel}
          >
            <SelectTrigger className="font-noto-thai">
              <SelectValue placeholder="ประเมินตนเอง" />
            </SelectTrigger>
            <SelectContent className="font-noto-thai">
              <SelectItem value="EXCELLENT">
                ดีมาก (สามารถใช้งานเครื่องมือขั้นสูงหรือโปรแกรมมิ่งได้)
              </SelectItem>
              <SelectItem value="GOOD">
                ดี (สามารถใช้งานคอมพิวเตอร์และอินเทอร์เน็ตได้คล่องแคล่ว)
              </SelectItem>
              <SelectItem value="AVERAGE">
                ปานกลาง (ใช้งาน LINE, Facebook, และ App พื้นฐานได้)
              </SelectItem>
              <SelectItem value="LOW">
                น้อย (แทบไม่ได้ใช้งานคอมพิวเตอร์เลย)
              </SelectItem>
              <SelectItem value="NONE">ไม่มีพื้นฐานเลย</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="font-noto-thai font-bold">
            สิ่งที่คาดหวังจากโครงการ (เลือกได้มากกว่า 1 ข้อ)
          </Label>
          <div className="grid grid-cols-1 gap-3">
            {expectationOptions.map((opt) => (
              <div
                key={opt.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={opt.id}
                  checked={(
                    (formData.expectations as unknown as string[]) || []
                  ).includes(opt.id)}
                  onCheckedChange={() => toggleExpectation(opt.id)}
                />
                <label
                  htmlFor={opt.id}
                  className="text-sm font-medium font-noto-thai cursor-pointer flex-1"
                >
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {((formData.expectations as unknown as string[]) || []).includes(
          "OTHER_EXP",
        ) && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="expectationsOther" className="font-noto-thai">
              โปรดระบุความคาดหวังเพิ่มเติม
            </Label>
            <Textarea
              id="expectationsOther"
              placeholder="เช่น อยากหาคู่ค้าในต่างประเทศ..."
              className="min-h-[100px] font-noto-thai"
              value={formData.expectationsOther || ""}
              onChange={(e) =>
                updateFormData({ expectationsOther: e.target.value })
              }
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="font-noto-thai font-bold">
            ความพร้อมด้านเวลา (ตลอด 16-20 สัปดาห์)
          </Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={formData.canCommitTime === true ? "default" : "outline"}
              className={`flex-1 font-noto-thai ${formData.canCommitTime === true ? "bg-[#1B5E20]" : ""}`}
              onClick={() => updateFormData({ canCommitTime: true })}
            >
              พร้อมเข้าร่วม (100%)
            </Button>
            <Button
              type="button"
              variant={formData.canCommitTime === false ? "default" : "outline"}
              className={`flex-1 font-noto-thai ${formData.canCommitTime === false ? "bg-[#1B5E20]" : ""}`}
              onClick={() => updateFormData({ canCommitTime: false })}
            >
              ไม่แน่ใจ
            </Button>
          </div>
        </div>
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
          onClick={nextStep}
          className="bg-[#1B5E20] hover:bg-[#154a19] text-white px-8 font-noto-thai"
        >
          ตรวจสอบข้อมูล
        </Button>
      </div>
    </div>
  );
};

export default StepReadiness;
