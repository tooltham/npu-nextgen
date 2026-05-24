try {
  require("dotenv").config();
} catch (e) {
  // Optional dotenv package may not be present in production standalone runner,
  // but env variables are already populated by Docker Compose.
}

module.exports = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
