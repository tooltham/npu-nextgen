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
      <Preview>ยืนยันการรับใบสมัคร - {course}</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto py-10 px-6 max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 my-8">
            <Heading className="text-slate-900 text-2xl font-bold mb-6 tracking-tight">
              สวัสดีคุณ {name}
            </Heading>
            <Text className="text-slate-700 text-base mb-4 leading-relaxed">
              มหาวิทยาลัยนครพนมได้รับใบสมัครของคุณเรียบร้อยแล้ว สำหรับหลักสูตร:
            </Text>
            <Section className="bg-emerald-50/50 p-6 rounded-2xl mb-8 border border-emerald-100/50 text-center">
              <Text className="text-emerald-800 font-bold text-lg m-0">
                {course}
              </Text>
            </Section>
            <Text className="text-slate-700 text-base mb-2">
              <strong>หมายเลขใบสมัคร:</strong> {applicationId}
            </Text>
            <Text className="text-slate-700 text-base mb-6">
              <strong>เลขประจำตัวประชาชน:</strong> {nationalId}
            </Text>
            <Hr className="border-slate-200 my-8" />
            <Text className="text-slate-500 text-xs italic leading-relaxed">
              ผู้ประสานงานการรับสมัครจะดำเนินการติดต่อทางหมายเลขโทรศัพท์
              หรืออีเมลที่คุณให้ไว้ภายใน 7 วันทำการ
              หากมีข้อมูลเพิ่มเติมที่จำเป็นต้องใช้ในการพิจารณาใบสมัครของคุณ
              สามารถติดต่อได้ที่{" "}
              <strong>คุณปริศนา แสงสุวรรณ โทร. 062-464-9642</strong>{" "}
              ในวันและเวลาราชการ
              <br />
              <br />
              *ข้อมูลของคุณได้รับการคุ้มครองตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล
              (PDPA) และจะถูกใช้เพื่อการพิจารณาคัดเลือกเท่านั้น
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ApplicantConfirmationEmail;
