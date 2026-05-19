interface ProgressStepperProps {
  currentStep: number;
  steps: string[];
}

const stepLabels: Record<string, string> = {
  Consent: "ยินยอม",
  Personal: "ข้อมูลส่วนตัว",
  Background: "ภูมิหลัง",
  Readiness: "ความพร้อม",
  Review: "ตรวจสอบ",
};

export default function ProgressStepper({
  currentStep,
  steps,
}: ProgressStepperProps) {
  const totalSteps = steps.length;
  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="mx-auto max-w-lg py-12 px-6">
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-4 left-0 right-0 h-[2px] bg-black/5 rounded-full" />

        {/* Progress Line */}
        <div
          className="absolute top-4 left-0 h-[2px] bg-[#1B5E20] rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive = i === currentStep;

            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    isCompleted
                      ? "bg-[#1B5E20] text-white shadow-md shadow-green-900/20"
                      : isActive
                        ? "bg-[#1B5E20] text-white scale-110 shadow-lg shadow-green-900/30 ring-4 ring-[#1B5E20]/20"
                        : "bg-gray-100 text-black/30 border border-black/5"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`mt-3 text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
                    isActive
                      ? "text-[#1B5E20]"
                      : isCompleted
                        ? "text-[#1B5E20]/60"
                        : "text-black/20"
                  }`}
                >
                  {stepLabels[step] || step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-black/20">
        ขั้นตอนที่ {currentStep + 1} จาก {totalSteps}
      </p>
    </div>
  );
}
