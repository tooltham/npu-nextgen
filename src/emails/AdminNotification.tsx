import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Link,
  Preview,
  Tailwind,
  Head,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface AdminNotificationEmailProps {
  applicantName: string;
  applicationId: string;
}

export const AdminNotificationEmail = ({
  applicantName,
  applicationId,
}: AdminNotificationEmailProps) => {
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin?id=${applicationId}`;

  return (
    <Html>
      <Preview>มีใบสมัครใหม่เข้ามาในระบบ - {applicantName}</Preview>
      <Tailwind>
        <Head />
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto py-10 px-6 max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 my-8">
            <Heading className="text-slate-900 text-2xl font-bold mb-6 tracking-tight">
              แจ้งเตือนใบสมัครใหม่โครงการ NPU NextGen
            </Heading>

            <Text className="text-slate-700 text-base mb-4 leading-relaxed">
              ระบบได้รับข้อมูลใบสมัครเข้าร่วมโครงการ Smart Integrated Farm
              Manager Application System ส่งเข้ามาใหม่จากผู้สมัครในระบบ
              มีรายละเอียดเบื้องต้นดังนี้:
            </Text>

            <Section className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100">
              <Text className="text-slate-600 text-sm mb-2 m-0">
                <strong>ชื่อ-นามสกุล ผู้สมัคร:</strong> {applicantName}
              </Text>
              <Text className="text-slate-600 text-sm m-0">
                <strong>หมายเลขใบสมัคร (Application ID):</strong>{" "}
                {applicationId}
              </Text>
            </Section>

            <Section className="text-center mb-8">
              <Link
                href={adminUrl}
                className="bg-slate-900 text-white font-medium text-sm px-6 py-3.5 rounded-full shadow-sm transition-all text-center inline-block"
              >
                ดูรายละเอียดใบสมัครในระบบ
              </Link>
            </Section>

            <Hr className="border-slate-200 my-8" />

            <Text className="text-slate-500 text-xs italic leading-relaxed">
              อีเมลแจ้งเตือนฉบับนี้ส่งโดยระบบอัตโนมัติของ NPU NextGen IoTES
              Research Lab มหาวิทยาลัยนครพนม
              เพื่อแจ้งให้ผู้รับผิดชอบระบบรับทราบข้อมูลใบสมัครเข้ามาใหม่
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AdminNotificationEmail;
