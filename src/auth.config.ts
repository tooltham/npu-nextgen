import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Merged in route.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as { role?: string })?.role;

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
        token.role = (user as { role?: string }).role;
        token.id = user.id;
        token.mustChangePassword = (
          user as { mustChangePassword?: boolean }
        ).mustChangePassword;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; id?: string }).role =
          token.role as string;
        (session.user as { role?: string; id?: string }).id =
          token.id as string;
        (session.user as { mustChangePassword?: boolean }).mustChangePassword =
          token.mustChangePassword as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
} satisfies NextAuthConfig;
