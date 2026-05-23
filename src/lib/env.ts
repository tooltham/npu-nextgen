import { envSchema } from "@/schemas/envSchema";

const result = envSchema.safeParse(process.env);

if (
  !result.success &&
  process.env.NODE_ENV !== "test" &&
  process.env.SKIP_ENV_VALIDATION !== "true"
) {
  console.error("❌ Invalid environment variables:", result.error.format());
  throw new Error("Invalid environment variables");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const env = result.success ? result.data : (process.env as any);
