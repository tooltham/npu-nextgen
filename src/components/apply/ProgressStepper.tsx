interface ProgressStepperProps {
  currentStep: number;
  steps: string[];
}

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
        <div className="absolute top-[3px] left-0 right-0 h-[2px] bg-black/5 rounded-full" />

        {/* Progress Line */}
        <div
          className="absolute top-[3px] left-0 h-[2px] bg-[#1B5E20] rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`h-2 w-2 rounded-full transition-all duration-500 delay-150 ${
                  i <= currentStep
                    ? "bg-[#1B5E20] scale-150 shadow-sm"
                    : "bg-black/10"
                }`}
              />
              <span
                className={`mt-4 text-[11px] font-bold uppercase tracking-widest transition-colors duration-500 ${
                  i === currentStep ? "text-[#1B5E20]" : "text-black/20"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-black/20">
        Phase {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
}
