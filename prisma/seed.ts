import "dotenv/config";
import { encrypt } from "../src/lib/encrypt";
import {
  PrismaClient,
  Education,
  DigitalSkill,
  AppStatus,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Clearing existing data...");
  await prisma.consent.deleteMany();
  await prisma.application.deleteMany();
  await prisma.courseModule.deleteMany();

  const statuses: AppStatus[] = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"];
  const educations: Education[] = [
    "HIGH_SCHOOL_OR_VOC",
    "DIPLOMA",
    "BACHELOR",
    "ABOVE_BACHELOR",
  ];
  const digitalSkills: DigitalSkill[] = [
    "EXCELLENT",
    "GOOD",
    "AVERAGE",
    "LOW",
    "NONE",
  ];

  const names = [
    { th: ["สมชาย", "ใจดี"], en: ["Somchai", "Jaidee"] },
    { th: ["สมหญิง", "รักสงบ"], en: ["Somying", "Raksangob"] },
    { th: ["มานะ", "อดทน"], en: ["Mana", "Aodthon"] },
    { th: ["มานี", "มีนา"], en: ["Manee", "Meena"] },
    { th: ["ปิติ", "ยินดี"], en: ["Piti", "Yindee"] },
    { th: ["ชูใจ", "รักเรียน"], en: ["Choojai", "Rakrean"] },
    { th: ["วีระ", "กล้าหาญ"], en: ["Weera", "Glahan"] },
    { th: ["เพชร", "กล้า"], en: ["Petch", "Gla"] },
    { th: ["ตะวัน", "ฉายแสง"], en: ["Tawan", "Chaysaeng"] },
    { th: ["นภา", "แจ่มใส"], en: ["Napa", "Jamsai"] },
  ];

  console.log("Seeding 20 mock applications...");

  for (let i = 0; i < 20; i++) {
    const nameIndex = i % names.length;
    const { th, en } = names[nameIndex];

    // Encrypt dummy national ID logic using standard AES-256-GCM
    const rawId = `111111111111${i % 10}`;
    const dummyNationalId = encrypt(rawId);

    const app = await prisma.application.create({
      data: {
        email: `user${i}@example.com`,
        titleTh: i % 2 === 0 ? "นาย" : "นางสาว",
        firstNameTh: th[0],
        lastNameTh: th[1],
        firstNameEn: en[0],
        lastNameEn: en[1],
        nationalId: dummyNationalId,
        phone: `081234567${i % 10}`,
        lineId: `line_id_${i}`,
        address: `บ้านเลขที่ ${i + 1}/${i + 10} หมู่ที่ ${i % 10 || 1} ถนนทดสอบ ตำบลจำลอง อำเภอเมือง จังหวัดนครพนม 48000`,
        education: educations[i % educations.length],
        targetGroup: ["เกษตรกร", "นักศึกษา"],
        hasAgriExperience: i % 2 === 0,
        agriExperienceYears:
          i % 2 === 0 ? Math.floor(Math.random() * 10) + 1 : null,
        farmName: i % 2 === 0 ? `ฟาร์ม${th[0]}` : null,
        farmLocation: i % 2 === 0 ? "นครพนม" : null,
        digitalSkillLevel: digitalSkills[i % digitalSkills.length],
        expectations: ["อยากนำเทคโนโลยีมาใช้"],
        canCommitTime: true,
        status: statuses[i % statuses.length],
        ipAddress: `192.168.1.${i}`,
        userAgent: "Mozilla/5.0 DummyAgent",
        consent: {
          create: {
            granted: true,
            consentText: "PDPA Terms v1.0 mock text",
            consentVersion: "v1.0",
            ipAddress: `192.168.1.${i}`,
          },
        },
      },
    });
    console.log(
      `Created application for ${app.firstNameTh} ${app.lastNameTh} with status ${app.status}`,
    );
  }

  console.log("Seeding Course Modules, Lessons, and Quizzes...");

  const m1 = await prisma.courseModule.create({
    data: {
      title: "Module 1: เทคโนโลยีฟาร์มอัจฉริยะพื้นฐาน",
      description:
        "เรียนรู้แนวคิดและเครื่องมือพื้นฐานสำหรับการทำฟาร์มอัจฉริยะด้วยเทคโนโลยี IoT",
      order: 1,
      lessons: {
        create: [
          {
            title: "บทเรียนที่ 1.1: แนะนำ IoT และ Smart Farm",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            documentUrl: "https://example.com/docs/intro-to-smart-farm.pdf",
            order: 1,
            quizzes: {
              create: [
                {
                  question: "ข้อใดคือองค์ประกอบหลักของระบบ Smart Farm?",
                  options: [
                    "การใช้แรงงานคนมากขึ้น",
                    "เซ็นเซอร์และการควบคุมอัตโนมัติ",
                    "การเพาะปลูกแบบดั้งเดิม",
                    "การพึ่งพาฟ้าฝนเพียงอย่างเดียว",
                  ],
                  correctIdx: 1,
                },
              ],
            },
          },
          {
            title: "บทเรียนที่ 1.2: การวิเคราะห์ข้อมูลความชื้นในดิน",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            documentUrl: "https://example.com/docs/soil-moisture-analysis.pdf",
            order: 2,
            quizzes: {
              create: [
                {
                  question:
                    "เซ็นเซอร์ชนิดใดเหมาะสมที่สุดสำหรับใช้วัดปริมาณน้ำในดิน?",
                  options: [
                    "DHT11 (เซ็นเซอร์อุณหภูมิ/ความชื้นในอากาศ)",
                    "Soil Moisture Sensor (เซ็นเซอร์วัดความชื้นดิน)",
                    "LDR (เซ็นเซอร์แสง)",
                    "Ultrasonic Sensor (เซ็นเซอร์อัลตราโซนิก)",
                  ],
                  correctIdx: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const m2 = await prisma.courseModule.create({
    data: {
      title: "Module 2: ปัญญาประดิษฐ์ในงานเกษตรกรรม",
      description:
        "ทำความเข้าใจและนำโมเดล AI มาประยุกต์ใช้ในการทำนายผลผลิตและตรวจจับโรคพืช",
      order: 2,
      lessons: {
        create: [
          {
            title:
              "บทเรียนที่ 2.1: การวิเคราะห์ภาพถ่ายโรคพืชด้วย Computer Vision",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            documentUrl: "https://example.com/docs/computer-vision-plants.pdf",
            order: 1,
            quizzes: {
              create: [
                {
                  question:
                    "เทคนิคใดใน AI เหมาะสมที่สุดสำหรับใช้ตรวจโรคพืชจากภาพถ่ายใบไม้?",
                  options: [
                    "Linear Regression",
                    "Computer Vision (Image Classification)",
                    "Natural Language Processing",
                    "K-Means Clustering",
                  ],
                  correctIdx: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Course Modules seeded successfully!");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
