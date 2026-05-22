import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protect all dashboard interfaces and API routes under admin/staff/portal
  matcher: ["/admin/:path*", "/staff/:path*", "/portal/:path*", "/admin/login"],
};
