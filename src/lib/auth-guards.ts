import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { Role, Enrollment } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email: string;
  role: Role;
}

/**
 * Checks if the current session user has the required role.
 * If not authenticated, returns a Response with 401.
 * If unauthorized, returns a Response with 403.
 * Otherwise, returns the authenticated user data.
 */
export async function verifyUserRole(
  allowedRoles: Role[],
): Promise<
  | { success: true; user: AuthenticatedUser }
  | { success: false; response: NextResponse }
> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 },
      ),
    };
  }

  const user = session.user as {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  const userRole = user.role as Role;

  if (!allowedRoles.includes(userRole)) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, error: "Forbidden: Insufficient permissions" },
        { status: 403 },
      ),
    };
  }

  return {
    success: true,
    user: {
      id: user.id || "",
      name: user.name,
      email: user.email || "",
      role: userRole,
    },
  };
}

/**
 * Guard strictly requiring ADMIN role
 */
export async function verifyAdmin() {
  return verifyUserRole([Role.ADMIN]);
}

/**
 * Guard strictly requiring STAFF or ADMIN role
 */
export async function verifyStaff() {
  return verifyUserRole([Role.STAFF, Role.ADMIN]);
}

/**
 * Guard strictly requiring STUDENT or ADMIN role
 */
export async function verifyStudent() {
  return verifyUserRole([Role.STUDENT, Role.ADMIN]);
}

/**
 * Guard for Classroom access: User must have an ACTIVE enrollment.
 * Returns the enrollment if successful.
 */
export async function verifyEnrollment(): Promise<
  | { success: true; user: AuthenticatedUser; enrollment: Partial<Enrollment> }
  | { success: false; response: NextResponse }
> {
  const authResult = await verifyStudent();
  if (!authResult.success) return authResult;

  // ADMIN role can bypass enrollment check
  if (authResult.user.role === Role.ADMIN) {
    return {
      success: true,
      user: authResult.user,
      enrollment: { status: "ACTIVE" }, // Mock enrollment for admin
    };
  }

  const { default: prisma } = await import("@/lib/db");
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId: authResult.user.id },
  });

  if (!enrollment || enrollment.status !== "ACTIVE") {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, error: "Forbidden: No active enrollment" },
        { status: 403 },
      ),
    };
  }

  return {
    success: true,
    user: authResult.user,
    enrollment,
  };
}
