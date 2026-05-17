"use client";

import React from "react";
import { useFormContext } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StepPersonalInfo = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1B5E20] font-noto-thai">
          ข้อมูลส่วนตัว
        </h2>
        <p className="text-gray-600 font-noto-thai">
          กรุณากรอกข้อมูลให้ครบถ้วนตามความเป็นจริง
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="titleTh" className="font-noto-thai">
            คำนำหน้า
          </Label>
          <Select
            onValueChange={(val) => updateFormData({ titleTh: val })}
            defaultValue={formData.titleTh}
          >
            <SelectTrigger className="font-noto-thai">
              <SelectValue placeholder="เลือก" />
            </SelectTrigger>
            <SelectContent className="font-noto-thai">
              <SelectItem value="นาย">นาย</SelectItem>
              <SelectItem value="นาง">นาง</SelectItem>
              <SelectItem value="นางสาว">นางสาว</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationalId" className="font-noto-thai">
            เลขประจำตัวประชาชน (13 หลัก)
          </Label>
          <Input
            id="nationalId"
            name="nationalId"
            maxLength={13}
            value={formData.nationalId || ""}
            onChange={handleInputChange}
            placeholder="X-XXXX-XXXXX-XX-X"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstNameTh" className="font-noto-thai">
            ชื่อ (ภาษาไทย)
          </Label>
          <Input
            id="firstNameTh"
            name="firstNameTh"
            value={formData.firstNameTh || ""}
            onChange={handleInputChange}
            placeholder="ชื่อจริง"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastNameTh" className="font-noto-thai">
            นามสกุล (ภาษาไทย)
          </Label>
          <Input
            id="lastNameTh"
            name="lastNameTh"
            value={formData.lastNameTh || ""}
            onChange={handleInputChange}
            placeholder="นามสกุล"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstNameEn" className="font-noto-thai">
            First Name (English)
          </Label>
          <Input
            id="firstNameEn"
            name="firstNameEn"
            value={formData.firstNameEn || ""}
            onChange={handleInputChange}
            placeholder="Ex. Somchai"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastNameEn" className="font-noto-thai">
            Last Name (English)
          </Label>
          <Input
            id="lastNameEn"
            name="lastNameEn"
            value={formData.lastNameEn || ""}
            onChange={handleInputChange}
            placeholder="Ex. Jaidee"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-noto-thai">
            อีเมล
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            placeholder="example@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="font-noto-thai">
            เบอร์โทรศัพท์ (10 หลัก)
          </Label>
          <Input
            id="phone"
            name="phone"
            maxLength={10}
            value={formData.phone || ""}
            onChange={handleInputChange}
            placeholder="08XXXXXXXX"
          />
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
          ขั้นตอนถัดไป
        </Button>
      </div>
    </div>
  );
};

export default StepPersonalInfo;
