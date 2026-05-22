import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Merged in route.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as any)?.role;

      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isStaffRoute = nextUrl.pathname.startsWith("/staff");
      const isPortalRoute = nextUrl.pathname.startsWith("/portal");

      // Handle redirect if already logged in on login page
      if (nextUrl.pathname === "/admin/login") {
        if (isLoggedIn) {
          if (userRole === "ADMIN") {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          if (userRole === "STAFF") {
            return Response.redirect(new URL("/staff/grading", nextUrl));
          }
          if (userRole === "STUDENT") {
            return Response.redirect(new URL("/portal", nextUrl));
          }
        }
        return true;
      }

      // Role check protection
      if (isAdminRoute) {
        return isLoggedIn && userRole === "ADMIN";
      }

      if (isStaffRoute) {
        return isLoggedIn && (userRole === "STAFF" || userRole === "ADMIN");
      }

      if (isPortalRoute) {
        return isLoggedIn && (userRole === "STUDENT" || userRole === "ADMIN");
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
} satisfies NextAuthConfig;
