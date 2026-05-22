import prisma from "../src/lib/db";

async function main() {
  console.log("Seeding missing enrollments for existing students...");

  // Find all STUDENT users who don't have an enrollment
  const studentsWithoutEnrollment = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      enrollment: null,
    },
  });

  console.log(
    `Found ${studentsWithoutEnrollment.length} students without enrollment.`,
  );

  let createdCount = 0;
  for (const student of studentsWithoutEnrollment) {
    try {
      await prisma.enrollment.create({
        data: {
          userId: student.id,
          status: "ACTIVE",
        },
      });
      createdCount++;
    } catch (e) {
      console.error(
        `Failed to create enrollment for student ${student.id}:`,
        e,
      );
    }
  }

  console.log(`Successfully created ${createdCount} enrollments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
