import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Hr,
  Preview,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface RejectionEmailProps {
  name: string;
  course?: string;
}

export const RejectionEmail = ({
  name,
  course = "นักจัดการฟาร์มเกษตรแบบผสมผสานอัจฉริยะ",
}: RejectionEmailProps) => {
  return (
    <Html>
      <Preview>แจ้งผลการพิจารณาใบสมัครโครงการ NPU NextGen — {course}</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto py-10 px-6 max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 my-8">
            <Heading className="text-slate-900 text-2xl font-bold mb-6 tracking-tight">
              แจ้งผลการพิจารณาใบสมัครโครงการ NPU NextGen
            </Heading>

            <Text className="text-slate-700 text-base mb-4">
              เรียน คุณ <strong>{name}</strong>,
            </Text>

            <Text className="text-slate-700 text-base mb-6 leading-relaxed">
              คณะทำงานโครงการ Smart Integrated Farm Manager Application System
              มหาวิทยาลัยนครพนม
              ขอขอบคุณเป็นอย่างยิ่งที่คุณให้ความสนใจสมัครเข้าร่วมโครงการ
              และส่งเอกสารใบสมัครเพื่อรับการพิจารณาในหลักสูตร:
            </Text>

            <Section className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 text-center">
              <Text className="text-slate-800 font-bold text-lg m-0">
                {course}
              </Text>
            </Section>

            <Text className="text-slate-700 text-base mb-6 leading-relaxed">
              คณะกรรมการได้ดำเนินการพิจารณาคุณสมบัติและเอกสารประกอบใบสมัครของคุณอย่างละเอียดรอบคอบแล้ว
              ทางโครงการเสียใจเป็นอย่างยิ่งที่ต้องแจ้งให้ทราบว่า
              **ในรอบการรับสมัครนี้ ใบสมัครของคุณยังไม่ผ่านการคัดเลือก**
              เนื่องจากมีผู้สมัครเป็นจำนวนมากและข้อจำกัดในเรื่องสัดส่วนผู้เข้าร่วมโครงการ
            </Text>

            <Text className="text-slate-700 text-base mb-6 leading-relaxed">
              อย่างไรก็ตาม ข้อมูลใบสมัครของคุณจะได้รับการบันทึกอยู่ในระบบสำรอง
              (Waitlist) ของทางโครงการ และหากมีการเปิดรับสมัครในรอบถัดไป
              หรือมีการจัดกิจกรรมอบรมเพิ่มเติม
              ทางโครงการจะติดต่อประชาสัมพันธ์ข้อมูลให้คุณทราบเป็นลำดับแรก
            </Text>

            <Text className="text-slate-700 text-base mb-8 leading-relaxed">
              คณะทำงานขอขอบคุณในความมุ่งมั่นและความสนใจของคุณอีกครั้ง
              และขอเป็นกำลังใจให้คุณประสบความสำเร็จในด้านการเกษตรอัจฉริยะและการพัฒนาฟาร์มต่อไปค่ะ
            </Text>

            <Hr className="border-slate-200 my-8" />

            <Text className="text-slate-500 text-xs italic leading-relaxed">
              หากมีข้อสงสัยหรือต้องการสอบถามรายละเอียดเพิ่มเติมเกี่ยวกับการพิจารณาใบสมัคร
              สามารถติดต่อผู้ประสานงานโครงการได้ที่ คุณปริศนา แสงสุวรรณ โทร.
              062-464-9642 ในวันและเวลาราชการ
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RejectionEmail;
