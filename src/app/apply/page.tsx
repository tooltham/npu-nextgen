"use client";

import React from "react";
import { FormProvider, useFormContext } from "@/context/FormContext";
import ProgressStepper from "@/components/apply/ProgressStepper";
import StepConsent from "@/components/apply/StepConsent";
import StepPersonalInfo from "@/components/apply/StepPersonalInfo";
import StepBackground from "@/components/apply/StepBackground";
import StepReadiness from "@/components/apply/StepReadiness";
import ReviewSummary from "@/components/apply/ReviewSummary";
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

  const steps = ["Consent", "Personal", "Background", "Readiness", "Review"];

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#1d1d1f]">
      {/* Minimalist Navigation for Form */}
      <nav className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tighter hover:opacity-70 transition-opacity"
          >
            NPU NextGen
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
            Smart Agriculture Program
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-12 md:py-24">
        <div className="mb-16">
          <ProgressStepper steps={steps} currentStep={currentStep} />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          {renderStep()}
        </div>
      </div>

      <footer className="py-20 border-t border-black/5 text-center">
        <p className="text-[11px] font-bold text-black/20 uppercase tracking-widest">
          Secured by NPU IoTES Infrastructure
        </p>
      </footer>
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
