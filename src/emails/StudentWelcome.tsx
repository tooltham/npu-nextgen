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
  Button,
} from "@react-email/components";
import * as React from "react";

interface StudentWelcomeEmailProps {
  name: string;
  email: string;
  password?: string;
  course?: string;
  loginUrl?: string;
}

export const StudentWelcomeEmail = ({
  name,
  email,
  password,
  course = "นักจัดการฟาร์มเกษตรแบบผสมผสานอัจฉริยะ",
  loginUrl = "http://localhost:3000/admin/login",
}: StudentWelcomeEmailProps) => {
  return (
    <Html>
      <Preview>
        ขอแสดงความยินดี! คุณได้รับสิทธิ์เข้าเรียนโครงการ NPU NextGen
      </Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto py-10 px-6 max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 my-8">
            <Heading className="text-slate-900 text-2xl font-bold mb-6 tracking-tight">
              ขอแสดงความยินดีและต้อนรับสู่โครงการ NPU NextGen
            </Heading>

            <Text className="text-slate-700 text-base mb-4">
              เรียน คุณ <strong>{name}</strong>,
            </Text>

            <Text className="text-slate-700 text-base mb-6 leading-relaxed">
              คณะทำงานโครงการ Smart Integrated Farm Manager Application System
              มหาวิทยาลัยนครพนม
              ขอแจ้งให้ทราบว่าใบสมัครของคุณได้รับการอนุมัติเรียบร้อยแล้ว
              โดยคุณได้รับสิทธิ์เข้าเรียนในหลักสูตร:
            </Text>

            <Section className="bg-emerald-50/50 p-6 rounded-2xl mb-8 border border-emerald-100/50 text-center">
              <Text className="text-emerald-800 font-bold text-lg m-0">
                {course}
              </Text>
            </Section>

            <Text className="text-slate-900 font-semibold text-base mb-3">
              ข้อมูลบัญชีผู้ใช้งานสำหรับเข้าสู่ห้องเรียนออนไลน์:
            </Text>

            <Section className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100">
              <Text className="text-slate-600 text-sm mb-2 m-0">
                <strong>อีเมลเข้าสู่ระบบ (Username):</strong> {email}
              </Text>
              <Text className="text-slate-600 text-sm m-0">
                <strong>รหัสผ่านชั่วคราว (Password):</strong>{" "}
                <code className="bg-slate-200/60 px-2 py-0.5 rounded font-mono text-slate-800 font-semibold">
                  {password}
                </code>
              </Text>
            </Section>

            <Section className="text-center mb-8">
              <Button
                href={loginUrl}
                className="bg-slate-900 text-white font-medium text-sm px-6 py-3.5 rounded-full shadow-sm transition-all text-center inline-block"
              >
                เข้าสู่ระบบห้องเรียนออนไลน์
              </Button>
            </Section>

            <Hr className="border-slate-200 my-8" />

            <Text className="text-slate-500 text-xs italic leading-relaxed">
              * เพื่อความปลอดภัย
              โปรดทำการเปลี่ยนรหัสผ่านทันทีหลังจากเข้าสู่ระบบครั้งแรกในส่วนของการตั้งค่าบัญชีส่วนตัว
              <br />
              หากมีปัญหาในการเข้าสู่ระบบหรือมีข้อสงสัยเพิ่มเติม
              สามารถติดต่อผู้ประสานงานโครงการได้ที่ คุณปริศนา แสงสุวรรณ โทร.
              062-464-9642 ในวันและเวลาราชการ
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default StudentWelcomeEmail;
