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
import { useStepValidation } from "@/hooks/useStepValidation";
import { personalInfoSchema } from "@/schemas/applicationSchema";

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-red-500 text-xs mt-1 font-noto-thai">{message}</p>
  ) : null;

const StepPersonalInfo = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  const { validate, errors } = useStepValidation(personalInfoSchema);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const isValid = validate({
      email: formData.email,
      titleTh: formData.titleTh,
      firstNameTh: formData.firstNameTh,
      lastNameTh: formData.lastNameTh,
      firstNameEn: formData.firstNameEn,
      lastNameEn: formData.lastNameEn,
      nationalId: formData.nationalId,
      phone: formData.phone,
      lineId: formData.lineId,
    });
    if (isValid) nextStep();
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
        <div className="space-y-1">
          <Label htmlFor="titleTh" className="font-noto-thai">
            คำนำหน้า <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(val) => {
              updateFormData({ titleTh: val ?? undefined });
              const prefixMap: Record<string, string> = {
                นาย: "Mr. ",
                นาง: "Mrs. ",
                นางสาว: "Ms. ",
              };
              const prefix = prefixMap[val || ""] || "";
              if (
                prefix &&
                (!formData.firstNameEn || formData.firstNameEn === "")
              ) {
                updateFormData({ firstNameEn: prefix });
              }
            }}
            value={formData.titleTh ?? ""}
          >
            <SelectTrigger
              className={`font-noto-thai ${errors.titleTh ? "border-red-400 ring-1 ring-red-400" : ""}`}
            >
              <SelectValue placeholder="เลือก" />
            </SelectTrigger>
            <SelectContent className="font-noto-thai">
              <SelectItem value="นาย">นาย</SelectItem>
              <SelectItem value="นาง">นาง</SelectItem>
              <SelectItem value="นางสาว">นางสาว</SelectItem>
            </SelectContent>
          </Select>
          <FieldError message={errors.titleTh} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="nationalId" className="font-noto-thai">
            เลขประจำตัวประชาชน (13 หลัก) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nationalId"
            name="nationalId"
            maxLength={13}
            value={formData.nationalId || ""}
            onChange={handleInputChange}
            placeholder="X-XXXX-XXXXX-XX-X"
            className={
              errors.nationalId ? "border-red-400 ring-1 ring-red-400" : ""
            }
          />
          <FieldError message={errors.nationalId} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="firstNameTh" className="font-noto-thai">
            ชื่อ (ภาษาไทย) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstNameTh"
            name="firstNameTh"
            value={formData.firstNameTh || ""}
            onChange={handleInputChange}
            placeholder="ชื่อจริง"
            className={
              errors.firstNameTh ? "border-red-400 ring-1 ring-red-400" : ""
            }
          />
          <FieldError message={errors.firstNameTh} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="lastNameTh" className="font-noto-thai">
            นามสกุล (ภาษาไทย) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastNameTh"
            name="lastNameTh"
            value={formData.lastNameTh || ""}
            onChange={handleInputChange}
            placeholder="นามสกุล"
            className={
              errors.lastNameTh ? "border-red-400 ring-1 ring-red-400" : ""
            }
          />
          <FieldError message={errors.lastNameTh} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="firstNameEn" className="font-noto-thai">
            First Name (English) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstNameEn"
            name="firstNameEn"
            value={formData.firstNameEn || ""}
            onChange={handleInputChange}
            placeholder="Ex. Somchai"
            className={
              errors.firstNameEn ? "border-red-400 ring-1 ring-red-400" : ""
            }
          />
          <FieldError message={errors.firstNameEn} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="lastNameEn" className="font-noto-thai">
            Last Name (English) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastNameEn"
            name="lastNameEn"
            value={formData.lastNameEn || ""}
            onChange={handleInputChange}
            placeholder="Ex. Jaidee"
            className={
              errors.lastNameEn ? "border-red-400 ring-1 ring-red-400" : ""
            }
          />
          <FieldError message={errors.lastNameEn} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="font-noto-thai">
            อีเมล <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            placeholder="example@email.com"
            className={errors.email ? "border-red-400 ring-1 ring-red-400" : ""}
          />
          <FieldError message={errors.email} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone" className="font-noto-thai">
            เบอร์โทรศัพท์ (10 หลัก) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            maxLength={10}
            value={formData.phone || ""}
            onChange={handleInputChange}
            placeholder="08XXXXXXXX"
            className={errors.phone ? "border-red-400 ring-1 ring-red-400" : ""}
          />
          <FieldError message={errors.phone} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="lineId" className="font-noto-thai">
            Line ID (ถ้ามี)
          </Label>
          <Input
            id="lineId"
            name="lineId"
            value={formData.lineId || ""}
            onChange={handleInputChange}
            placeholder="ระบุไอดีไลน์ (ไม่บังคับ)"
            className={
              errors.lineId ? "border-red-400 ring-1 ring-red-400" : ""
            }
          />
          <FieldError message={errors.lineId} />
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
          onClick={handleNext}
          className="bg-[#1B5E20] hover:bg-[#154a19] text-white px-8 font-noto-thai"
        >
          ขั้นตอนถัดไป
        </Button>
      </div>
    </div>
  );
};

export default StepPersonalInfo;
