import React from "react";

const PartnersSection = () => {
  const partners = [
    { id: "npu", name: "มหาวิทยาลัยนครพนม" },
    { id: "doa", name: "สำนักงานเกษตรจังหวัดนครพนม" },
    { id: "moc", name: "สำนักงานพาณิชย์จังหวัดนครพนม" },
    { id: "ysf", name: "Young Smart Farmer นครพนม" },
  ];

  return (
    <section className="py-32 bg-[#f5f5f7]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-sm font-bold text-[#1B5E20] uppercase tracking-[0.3em] mb-4">
            Strategic Partners
          </h2>
          <h3 className="text-3xl font-bold text-[#1d1d1f] md:text-4xl tracking-tight font-noto-thai">
            เครือข่ายความร่วมมือเชิงยุทธศาสตร์
          </h3>
          <p className="mt-4 text-lg text-black/50 font-medium font-noto-thai">
            ร่วมขับเคลื่อนนวัตกรรมเกษตรอัจฉริยะกับหน่วยงาน
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group relative bg-white rounded-3xl p-6 flex flex-col items-center justify-center h-64 border border-black/[0.03] shadow-sm hover:shadow-xl hover:shadow-green-900/5 transition-all duration-500 ease-out transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="h-32 flex items-center justify-center mb-4">
                <img
                  src={`/img/${partner.id}.png`}
                  alt={`${partner.id.toUpperCase()} Logo`}
                  className="h-24 w-auto object-contain relative z-10 transition-all duration-500"
                />
              </div>
              <p className="text-sm font-bold text-[#1B5E20] relative z-10 font-noto-thai text-center group-hover:text-[#154a19] transition-colors">
                {partner.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
