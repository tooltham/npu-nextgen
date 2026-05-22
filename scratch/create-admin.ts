import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "apirak@npu.ac.th";
  const rawPassword = process.env.ADMIN_PASSWORD || "adminpassword123";
  const name = "Dr. Apirak (Admin)";

  console.log(`Creating Admin user in real Database...`);
  console.log(`Email: ${email}`);

  // Generate bcrypt hash for the password
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  // Clear any existing user with this email to prevent conflict
  await prisma.user.deleteMany({
    where: { email },
  });

  // Create the admin user
  const admin = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
      lastLoginAt: new Date(),
    },
  });

  console.log(`✅ Success! Created Admin User in DB:`);
  console.log(`- ID: ${admin.id}`);
  console.log(`- Email: ${admin.email}`);
  console.log(`- Role: ${admin.role}`);
  console.log(`- Password (raw): ${rawPassword}`);
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
