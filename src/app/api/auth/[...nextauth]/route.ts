import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // In a real lab environment, these would be in a DB or env
        // For simplicity as requested in the sub-agent prompt
        if (
          credentials?.email === env.ADMIN_NOTIFY_EMAIL &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            name: "Dr. Puy",
            email: env.ADMIN_NOTIFY_EMAIL,
            role: "ADMIN",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});

export const { GET, POST } = handlers;
