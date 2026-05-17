import { envSchema } from "@/schemas/envSchema";

const result = envSchema.safeParse(process.env);

if (!result.success && process.env.NODE_ENV !== "test") {
  console.error("❌ Invalid environment variables:", result.error.format());
  throw new Error("Invalid environment variables");
}

export const env = result.success ? result.data : (process.env as any);
