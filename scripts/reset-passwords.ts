import prisma from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.updateMany({
    where: {
      email: {
        in: ["apirak@npu.ac.th", "user19@example.com"],
      },
    },
    data: {
      passwordHash: hashedPassword,
    },
  });

  console.log(
    'Passwords reset to "password123" for apirak@npu.ac.th and user19@example.com',
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
