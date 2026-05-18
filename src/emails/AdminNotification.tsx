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
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin?id=${applicationId}`;

  return (
    <Html>
      <Preview>มีใบสมัครใหม่เข้ามาในระบบ - {applicantName}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-10 px-6 bg-white border border-gray-100 rounded-lg shadow-sm">
            <Heading className="text-gray-900 text-xl font-bold mb-6">
              แจ้งเตือนใบสมัครใหม่
            </Heading>
            <Text className="text-gray-700 mb-4">
              มีผู้สมัครใหม่ส่งข้อมูลเข้ามาในระบบ:
            </Text>
            <Section className="bg-gray-50 p-4 rounded-lg mb-6">
              <Text className="m-0 text-gray-900">
                <strong>ชื่อผู้สมัคร:</strong> {applicantName}
              </Text>
              <Text className="m-0 text-gray-900">
                <strong>ID:</strong> {applicationId}
              </Text>
            </Section>
            <Link
              href={adminUrl}
              className="bg-[#1B5E20] text-white px-6 py-3 rounded-lg font-bold text-center block"
            >
              ดูรายละเอียดใบสมัคร
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AdminNotificationEmail;
