import React from "react";

const PartnersSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-10 font-noto-thai">
          ความร่วมมือโดย
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="h-16 w-32 bg-gray-200 border border-gray-300 rounded flex items-center justify-center font-bold text-gray-400">
            NPU
          </div>
          <div className="h-16 w-32 bg-gray-200 border border-gray-300 rounded flex items-center justify-center font-bold text-gray-400">
            DOA
          </div>
          <div className="h-16 w-32 bg-gray-200 border border-gray-300 rounded flex items-center justify-center font-bold text-gray-400">
            MOC
          </div>
          <div className="h-16 w-32 bg-gray-200 border border-gray-300 rounded flex items-center justify-center font-bold text-gray-400">
            YSF
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
