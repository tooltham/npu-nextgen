import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "@/auth.config";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // 1. Fallback developer/seed login to prevent lockout (from env settings)
        if (
          email === env.ADMIN_NOTIFY_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "dev-admin-id",
            name: "Dr. Puy (Dev)",
            email: env.ADMIN_NOTIFY_EMAIL,
            role: "ADMIN",
          };
        }

        // 2. Production Database Authentication
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash || !user.isActive) {
            return null;
          }

          // Compare password using bcryptjs
          const isValidPassword = await bcrypt.compare(
            password,
            user.passwordHash,
          );

          if (!isValidPassword) {
            return null;
          }

          // Update last login timestamp in background
          prisma.user
            .update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() },
            })
            .catch((e) => console.error("Failed to update lastLoginAt:", e));

          return {
            id: user.id,
            name: user.name || user.email.split("@")[0],
            email: user.email,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
          };
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // Secure check for Google SSO providers (Admin & Staff must use @npu.ac.th)
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }

        const isNpuDomain = user.email.endsWith("@npu.ac.th");

        try {
          // Check database if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            if (!existingUser.isActive) {
              return false;
            }
            // Update role if changed or update login time
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { lastLoginAt: new Date() },
            });
            // Assign db role to next-auth user object so JWT callback picks it up
            (user as { role?: string }).role = existingUser.role;
            return true;
          }

          // If it's @npu.ac.th, automatically provision a STAFF account by default
          if (isNpuDomain) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split("@")[0],
                role: "STAFF", // Default role for @npu.ac.th domain is STAFF
                isActive: true,
                lastLoginAt: new Date(),
              },
            });
            (user as { role?: string }).role = newUser.role;
            return true;
          }

          // Any other domains trying to login via Google are forbidden
          return false;
        } catch (err) {
          console.error("SignIn callback database error:", err);
          return false;
        }
      }

      // Credentials sign-in already validated in authorize block
      return true;
    },
  },
});

export const { GET, POST } = handlers;
