const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const fs = require("fs");

// Manual simple parser for .env
function loadEnv() {
  try {
    const envFile = fs.readFileSync(".env", "utf8");
    envFile.split("\n").forEach((line) => {
      if (line.trim().startsWith("#") || !line.includes("=")) return;
      const [key, ...valueParts] = line.split("=");
      if (key && valueParts.length > 0) {
        let value = valueParts.join("=").trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        process.env[key.trim()] = value;
      }
    });
    console.log("Loaded environment variables from .env");
  } catch (e) {
    console.log("No .env file found or failed to read");
  }
}

loadEnv();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const apps = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    console.log("Recent applications:");
    apps.forEach((app) => {
      console.log(
        `- ID: ${app.id}, Name: ${app.firstNameTh} ${app.lastNameTh}, Email: ${app.email}`,
      );
    });
  } catch (e) {
    console.error("Failed to query DB:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
