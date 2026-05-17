import React from "react";

const PartnersSection = () => {
  const partners = ["NPU", "DOA", "MOC", "YSF"];

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-sm font-bold text-black/30 uppercase tracking-[0.3em] mb-16">
          เครือข่ายความร่วมมือเชิงยุทธศาสตร์
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000 ease-in-out">
          {partners.map((partner) => (
            <div
              key={partner}
              className="text-4xl md:text-5xl font-black tracking-tighter text-black"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
