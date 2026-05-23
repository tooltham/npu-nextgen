import prisma from "../src/lib/db";

async function main() {
  console.log("Seeding dummy course data...");

  // Create Module 1
  const module1 = await prisma.courseModule.create({
    data: {
      title: "บทที่ 1: แนะนำ Smart Farming",
      description: "ทำความรู้จักกับแนวคิดเกษตรอัจฉริยะแบบผสมผสาน",
      order: 1,
      status: "PUBLISHED",
      lessons: {
        create: [
          {
            title: "1.1 ภาพรวมและเทคโนโลยี",
            order: 1,
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "วิดีโอแนะนำแนวคิดพื้นฐาน...",
          },
          {
            title: "1.2 แนวโน้มการเกษตรในอนาคต",
            order: 2,
            type: "TEXT",
            content: "<p>การนำเทคโนโลยีมาประยุกต์ใช้ในการเกษตร...</p>",
          },
          {
            title: "1.3 แบบทดสอบท้ายบทที่ 1",
            order: 3,
            type: "QUIZ",
            quizzes: {
              create: [
                {
                  question: "ข้อใดคือเป้าหมายหลักของ Smart Farming?",
                  options: JSON.stringify([
                    "เพิ่มผลผลิตโดยใช้แรงงานน้อยลง",
                    "เพิ่มการใช้สารเคมี",
                    "ทำฟาร์มในร่มเท่านั้น",
                    "เปลี่ยนพืชทุกชนิดเป็นพืชตัดต่อพันธุกรรม",
                  ]),
                  correctIdx: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Create Module 2
  const module2 = await prisma.courseModule.create({
    data: {
      title: "บทที่ 2: ระบบเซ็นเซอร์และ IoT",
      description: "การประยุกต์ใช้ IoT ในการวัดอุณหภูมิและความชื้น",
      order: 2,
      status: "PUBLISHED",
      lessons: {
        create: [
          {
            title: "2.1 แนะนำเซ็นเซอร์พื้นฐาน",
            order: 1,
            type: "VIDEO",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            content: "แนะนำเซ็นเซอร์ที่ใช้ในงานเกษตร...",
          },
        ],
      },
    },
  });

  console.log("Course seeded successfully!");
  console.log("Module 1 ID:", module1.id);
  console.log("Module 2 ID:", module2.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
