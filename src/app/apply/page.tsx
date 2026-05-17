"use client";

import React from "react";
import { FormProvider, useFormContext } from "@/context/FormContext";
import ProgressStepper from "@/components/apply/ProgressStepper";
import StepConsent from "@/components/apply/StepConsent";
import StepPersonalInfo from "@/components/apply/StepPersonalInfo";
import StepBackground from "@/components/apply/StepBackground";
import StepReadiness from "@/components/apply/StepReadiness";
import ReviewSummary from "@/components/apply/ReviewSummary";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const ApplicationForm = () => {
  const { currentStep } = useFormContext();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepConsent />;
      case 1:
        return <StepPersonalInfo />;
      case 2:
        return <StepBackground />;
      case 3:
        return <StepReadiness />;
      case 4:
        return <ReviewSummary />;
      default:
        return <StepConsent />;
    }
  };

  const steps = [
    "ความยินยอม",
    "ข้อมูลส่วนตัว",
    "ประวัติ",
    "ความพร้อม",
    "สรุปข้อมูล",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 font-noto-thai">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-[#1B5E20] font-bold flex items-center gap-2"
          >
            ← <span className="hidden md:inline">กลับหน้าหลัก</span>
          </Link>
          <div className="text-right">
            <h1 className="text-xl md:text-2xl font-bold text-[#1B5E20]">
              ใบสมัครเข้าร่วมโครงการ
            </h1>
            <p className="text-xs md:text-sm text-gray-500">
              NPU NextGen Smart Agriculture
            </p>
          </div>
        </div>

        <div className="mb-8">
          <ProgressStepper steps={steps} currentStep={currentStep} />
        </div>

        <Card className="shadow-xl border-none overflow-hidden">
          <div className="p-6 md:p-10">{renderStep()}</div>
        </Card>

        <p className="text-center text-gray-400 text-xs mt-8">
          © {new Date().getFullYear()} Nakhon Phanom University. Your data is
          protected by PDPA.
        </p>
      </div>
    </div>
  );
};

const ApplyPage = () => {
  return (
    <FormProvider>
      <ApplicationForm />
    </FormProvider>
  );
};

export default ApplyPage;
