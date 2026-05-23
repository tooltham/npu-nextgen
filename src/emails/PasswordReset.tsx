import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export const PasswordResetEmail = ({
  name = "คุณผู้ใช้",
  resetLink = "http://localhost:3000/reset-password?token=123",
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>รีเซ็ตรหัสผ่านบัญชี NPU NextGen ของคุณ</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>รีเซ็ตรหัสผ่าน NPU NextGen</Heading>
          <Text style={text}>สวัสดี {name},</Text>
          <Text style={text}>
            เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชี NPU NextGen ของคุณ
            หากคุณเป็นผู้ร้องขอ กรุณาคลิกที่ปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่
            ลิงก์นี้จะหมดอายุภายใน 1 ชั่วโมง
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              ตั้งรหัสผ่านใหม่
            </Button>
          </Section>

          <Text style={text}>
            หากปุ่มใช้งานไม่ได้ คุณสามารถคัดลอกลิงก์ด้านล่างไปวางในเบราว์เซอร์:
            <br />
            <Link href={resetLink} style={anchor}>
              {resetLink}
            </Link>
          </Text>

          <Text style={text}>
            หากคุณไม่ได้เป็นผู้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลฉบับนี้
            รหัสผ่านของคุณจะยังคงเหมือนเดิม
          </Text>

          <Text style={footer}>— ทีมงาน NPU NextGen IoTES Research Lab</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "64px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const h1 = {
  color: "#1B5E20",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
};

const text = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#1B5E20",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
};

const anchor = {
  color: "#3182ce",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const footer = {
  color: "#718096",
  fontSize: "14px",
  margin: "32px 0 0 0",
  borderTop: "1px solid #e2e8f0",
  paddingTop: "16px",
};
