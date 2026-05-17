import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "หลักสูตรนี้มีค่าใช้จ่ายหรือไม่?",
      answer:
        "หลักสูตรนี้ได้รับการสนับสนุนงบประมาณจากโครงการรัฐบาล ผู้เข้ารับการอบรมที่ผ่านการคัดเลือกจะไม่เสียค่าใช้จ่ายในการลงทะเบียน",
    },
    {
      question: "การอบรมจัดขึ้นที่ไหน?",
      answer:
        "มีการจัดการอบรมแบบ Hybrid ทั้งในรูปแบบออนไลน์และออนไซต์ ณ มหาวิทยาลัยนครพนม และศูนย์เรียนรู้เครือข่าย",
    },
    {
      question: "ต้องมีความรู้ด้านคอมพิวเตอร์มาก่อนหรือไม่?",
      answer:
        "ไม่จำเป็นต้องมีทักษะระดับสูง แต่ควรสามารถใช้งานคอมพิวเตอร์และอินเทอร์เน็ตพื้นฐานได้ โดยเราจะมีการปูพื้นฐานให้ในช่วงเริ่มต้น",
    },
    {
      question: "เรียนจบแล้วได้รับใบประกาศนียบัตรหรือไม่?",
      answer:
        "ผู้ที่มีเวลาเข้าเรียนไม่น้อยกว่า 80% และผ่านการประเมินโครงการ จะได้รับวุฒิบัตรรับรองจากมหาวิทยาลัยนครพนม",
    },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-[#1d1d1f] tracking-tight">
          คำถามที่พบบ่อย
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full border-t border-black/5"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-black/5 py-4"
            >
              <AccordionTrigger className="text-left font-bold text-xl hover:no-underline text-[#1d1d1f] py-4 transition-all hover:opacity-70">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-black/60 text-lg leading-relaxed pt-2 pb-6 font-medium">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
