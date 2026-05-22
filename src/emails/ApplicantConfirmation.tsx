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
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-10 px-6">
            <Heading className="text-[#1B5E20] text-2xl font-bold mb-6">
              สวัสดีคุณ {name}
            </Heading>
            <Text className="text-gray-700 text-lg mb-4">
              มหาวิทยาลัยนครพนมได้รับใบสมัครของคุณเรียบร้อยแล้ว สำหรับหลักสูตร:
            </Text>
            <Section className="bg-green-50 p-4 rounded-lg mb-6 border border-green-100">
              <Text className="text-[#1B5E20] font-bold text-xl m-0">
                {course}
              </Text>
            </Section>
            <Text className="text-gray-600 mb-2">
              <strong>หมายเลขใบสมัคร:</strong> {applicationId}
            </Text>
            <Text className="text-gray-600 mb-6">
              <strong>เลขประจำตัวประชาชน:</strong> {nationalId}
            </Text>
            <Hr className="border-gray-200 my-6" />
            <Text className="text-gray-600 text-sm italic">
              ผู้ประสานงานการรับสมัครจะดำเนินการติดต่อทางหมายเลขโทรศัพท์
              หรืออีเมลที่คุณให้ไว้ภายใน 7 วันทำการ
              หากมีข้อมูลเพิ่มเติมที่จำเป็นต้องใช้ในการพิจารณาใบสมัครของคุณ
              สามารถติดต่อได้ที่{" "}
              <strong>คุณปริศนา แสงสุวรรณ โทร. 062-464-9642</strong>{" "}
              ในวันและเวลาราชการ
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
