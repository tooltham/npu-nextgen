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
  Tailwind,
  Hr,
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
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto py-10 px-6 max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 my-8">
            <Heading className="text-slate-900 text-2xl font-bold mb-6 tracking-tight">
              รีเซ็ตรหัสผ่าน NPU NextGen
            </Heading>
            <Text className="text-slate-700 text-base mb-4 leading-relaxed">
              สวัสดี คุณ <strong>{name}</strong>,
            </Text>
            <Text className="text-slate-700 text-base mb-6 leading-relaxed">
              เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชี NPU NextGen ของคุณ
              หากคุณเป็นผู้ร้องขอ
              กรุณาคลิกที่ปุ่มด้านล่างนี้เพื่อตั้งรหัสผ่านใหม่
              โดยลิงก์นี้จะมีอายุการใช้งานจำกัดและหมดอายุภายใน 1 ชั่วโมง
            </Text>

            <Section className="text-center mb-8">
              <Button
                className="bg-slate-900 text-white font-medium text-sm px-6 py-3.5 rounded-full shadow-sm transition-all text-center inline-block font-semibold"
                href={resetLink}
              >
                ตั้งรหัสผ่านใหม่
              </Button>
            </Section>

            <Text className="text-slate-700 text-base mb-6 leading-relaxed">
              หากปุ่มด้านบนใช้งานไม่ได้
              คุณสามารถคัดลอกลิงก์ด้านล่างนี้ไปวางในเว็บเบราว์เซอร์ของคุณได้โดยตรงค่ะ:
              <br />
              <Link
                href={resetLink}
                className="text-indigo-600 font-bold hover:underline break-all text-sm"
              >
                {resetLink}
              </Link>
            </Text>

            <Text className="text-slate-500 text-sm leading-relaxed mb-6">
              หากคุณไม่ได้เป็นผู้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลฉบับนี้
              รหัสผ่านของคุณจะยังคงเหมือนเดิมโดยไม่มีการเปลี่ยนแปลงใดๆ ค่ะ
            </Text>

            <Hr className="border-slate-200 my-8" />

            <Text className="text-slate-400 text-xs italic leading-relaxed">
              อีเมลฉบับนี้ส่งโดยระบบอัตโนมัติของ NPU NextGen IoTES Research Lab
              มหาวิทยาลัยนครพนม
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
