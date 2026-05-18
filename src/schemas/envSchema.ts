import { z } from "zod";

export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Security
  ENCRYPTION_KEY: z
    .string()
    .length(64, "ENCRYPTION_KEY must be a 64-character hex string (256 bits)"),
  NEXTAUTH_SECRET: z.string().min(32),
  ADMIN_PASSWORD: z.string().min(8),

  // Email
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  ADMIN_NOTIFY_EMAIL: z.string().email(),
  RESEND_FROM: z.string().optional(),

  // SMTP (Google Workspace)
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.string().default("465"),
  SMTP_SECURE: z.string().default("true"),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),

  // Rate Limiting (Optional in dev/test)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // App
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_COURSE_NAME: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
