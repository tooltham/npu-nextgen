import "dotenv/config";
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

    // Encrypt dummy national ID logic normally goes here, but we'll just put a dummy string
    const dummyNationalId = Buffer.from(`111111111111${i}`).toString("base64");

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
