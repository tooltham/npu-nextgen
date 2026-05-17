"use client";

import React, { useState } from "react";
import { useFormContext } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const StepConsent = () => {
  const { nextStep } = useFormContext();
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Buffer for small devices
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 20;
    if (isAtBottom) setIsScrolledToBottom(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1B5E20] font-noto-thai">
          ข้อตกลงและเงื่อนไข (PDPA)
        </h2>
        <p className="text-gray-600 font-noto-thai">
          โปรดอ่านและทำความเข้าใจก่อนเริ่มการสมัคร
        </p>
      </div>

      <div className="border rounded-md overflow-hidden bg-gray-50">
        <ScrollArea
          className="h-[400px] w-full p-6"
          onScrollCapture={handleScroll}
        >
          <div className="space-y-4 text-gray-700 font-noto-thai text-sm md:text-base">
            <h3 className="font-bold text-lg">นโยบายคุ้มครองข้อมูลส่วนบุคคล</h3>
            <p>
              มหาวิทยาลัยนครพนม ในฐานะผู้ควบคุมข้อมูลส่วนบุคคล จะเก็บรวบรวม ใช้
              และเปิดเผยข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ต่อไปนี้เท่านั้น:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>การคัดเลือกผู้สมัครเข้าร่วมหลักสูตร</li>
              <li>
                การรายงานผลต่อสำนักงานปลัดกระทรวงการอุดมศึกษา วิทยาศาสตร์
                วิจัยและนวัตกรรม (สป.อว.)
              </li>
              <li>การจัดทำประกาศนียบัตร</li>
              <li>การติดต่อประสานงานที่เกี่ยวข้องกับโครงการ</li>
            </ol>
            <p>
              <strong>ประเภทข้อมูลที่จัดเก็บ:</strong> ชื่อ-นามสกุล,
              เลขประจำตัวประชาชน, ข้อมูลการติดต่อ, ประวัติการศึกษา
              และข้อมูลพื้นฐานทางการเกษตร
            </p>
            <p>
              <strong>ระยะเวลาการจัดเก็บ:</strong> เราจะจัดเก็บข้อมูลไว้เป็นเวลา
              5 ปี นับจากวันที่ยินยอมตามระเบียบของโครงการ
            </p>
            <p>
              <strong>สิทธิของเจ้าของข้อมูล:</strong> ท่านมีสิทธิขอเข้าถึง แก้ไข
              ลบ หรือระงับการใช้ข้อมูลได้โดยติดต่อ apirak@npu.ac.th
            </p>
            <div className="h-40"></div>
            <p className="font-bold text-[#1B5E20] text-center">
              --- ขอบคุณที่กรุณาอ่านจนจบเพื่อสิทธิของท่าน ---
            </p>
          </div>
        </ScrollArea>
      </div>

      <div
        className={`flex items-center space-x-2 p-4 rounded-lg border transition-colors ${agreed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
      >
        <Checkbox
          id="terms"
          disabled={!isScrolledToBottom}
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className={`text-sm font-medium leading-none font-noto-thai ${!isScrolledToBottom ? "text-gray-400 cursor-not-allowed" : "text-gray-800 cursor-pointer"}`}
        >
          {isScrolledToBottom
            ? "ฉันได้อ่านและยอมรับเงื่อนไขทั้งหมดแล้ว"
            : "กรุณาเลื่อนอ่านข้อความให้จบเพื่อกดยอมรับ"}
        </label>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          disabled={!agreed}
          className="bg-[#1B5E20] hover:bg-[#154a19] text-white px-10 py-6 text-lg font-noto-thai"
        >
          ขั้นตอนถัดไป
        </Button>
      </div>
    </div>
  );
};

export default StepConsent;
