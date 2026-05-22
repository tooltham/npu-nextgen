import { PrismaClient } from "@prisma/client";
import { decrypt } from "./src/lib/encrypt";
const prisma = new PrismaClient();
async function main() {
  const apps = await prisma.application.findMany({
    select: { id: true, nationalId: true },
  });
  console.log("Raw from DB:", apps);
  for (const app of apps) {
    try {
      console.log("Decrypted:", app.id, decrypt(app.nationalId));
    } catch (e) {
      console.log("Failed to decrypt", app.id, app.nationalId);
    }
  }
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
