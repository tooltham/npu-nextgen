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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1B5E20] font-noto-thai">
          คำถามที่พบบ่อย (FAQ)
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-lg hover:text-[#1B5E20] font-noto-thai">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed font-noto-thai">
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
