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

interface ApplicantConfirmationEmailProps {
  name: string;
  applicationId: string;
  course: string;
  nationalId: string;
}

export const ApplicantConfirmationEmail = ({
  name,
  applicationId,
  course,
  nationalId,
}: ApplicantConfirmationEmailProps) => {
  return (
    <Html>
      <Preview>ยืนยันการรับใบสมัครโครงการ NPU NextGen — {course}</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto py-10 px-6 max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 my-8">
            <Heading className="text-slate-900 text-2xl font-bold mb-6 tracking-tight">
              ยืนยันการรับใบสมัครโครงการ NPU NextGen
            </Heading>

            <Text className="text-slate-700 text-base mb-4">
              เรียน คุณ <strong>{name}</strong>,
            </Text>

            <Text className="text-slate-700 text-base mb-6 leading-relaxed">
              คณะทำงานโครงการ Smart Integrated Farm Manager Application System
              มหาวิทยาลัยนครพนม
              ได้รับข้อมูลใบสมัครเข้าร่วมโครงการของคุณเรียบร้อยแล้ว
              สำหรับหลักสูตร:
            </Text>

            <Section className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 text-center">
              <Text className="text-slate-800 font-bold text-lg m-0">
                {course}
              </Text>
            </Section>

            <Text className="text-slate-900 font-semibold text-base mb-3">
              ข้อมูลรายละเอียดการสมัครของคุณในระบบ:
            </Text>

            <Section className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100">
              <Text className="text-slate-600 text-sm mb-2 m-0">
                <strong>หมายเลขใบสมัคร:</strong> {applicationId}
              </Text>
              <Text className="text-slate-600 text-sm m-0">
                <strong>เลขประจำตัวประชาชน (National ID):</strong> {nationalId}
              </Text>
            </Section>

            <Hr className="border-slate-200 my-8" />

            <Text className="text-slate-500 text-xs italic leading-relaxed">
              ผู้ประสานงานการรับสมัครจะดำเนินการติดต่อกลับทางหมายเลขโทรศัพท์
              หรืออีเมลที่คุณให้ไว้ภายใน 7 วันทำการ
              หากมีข้อมูลเพิ่มเติมหรือเอกสารที่จำเป็นสำหรับการพิจารณาใบสมัครของคุณ
              สามารถติดต่อสอบถามรายละเอียดได้ที่ คุณปริศนา แสงสุวรรณ โทร.
              062-464-9642 ในวันและเวลาราชการ
              <br />
              <br />*
              ข้อมูลส่วนบุคคลของคุณได้รับการคุ้มครองอย่างเข้มงวดตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล
              (PDPA)
              และจะถูกนำมาใช้เพื่อวัตถุประสงค์ในการพิจารณาคัดเลือกเข้าร่วมโครงการนี้เท่านั้น
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ApplicantConfirmationEmail;
