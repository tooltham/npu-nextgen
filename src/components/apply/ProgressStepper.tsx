import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressStepper({
  steps,
  currentStep,
}: ProgressStepperProps) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full py-4">
      <div className="flex justify-between mb-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-[#1B5E20] -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted
                    ? "bg-[#1B5E20] border-[#1B5E20] text-white"
                    : isActive
                      ? "bg-white border-[#1B5E20] text-[#1B5E20] ring-4 ring-green-50"
                      : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium font-noto-thai hidden md:block ${
                  isActive ? "text-[#1B5E20]" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
      <Progress value={progress} className="h-1 md:hidden" />
    </div>
  );
}
