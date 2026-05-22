import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ where: { role: "STUDENT" } });
  console.log("Students:", users.length);
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
