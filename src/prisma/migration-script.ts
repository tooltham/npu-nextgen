import prisma from "../lib/db";
import { Role } from "@prisma/client";

/**
 * Migrate AdminUser data from the legacy table to the new role-based User table
 * Returns the count of migrated administrators.
 */
export async function migrateAdminUsers(): Promise<{
  success: boolean;
  migratedCount: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let migratedCount = 0;

  try {
    // 1. Fetch all legacy admin users
    const legacyAdmins = await prisma.adminUser.findMany();

    if (legacyAdmins.length === 0) {
      console.log("No legacy admin users found in the AdminUser table.");
      return { success: true, migratedCount: 0, errors: [] };
    }

    console.log(`Found ${legacyAdmins.length} legacy admin users to migrate.`);

    // 2. Iterate and migrate to the User table with ADMIN role
    for (const admin of legacyAdmins) {
      try {
        await prisma.user.upsert({
          where: { email: admin.email },
          update: {
            // If already exists, make sure they have ADMIN role and keep hash
            role: Role.ADMIN,
            passwordHash: admin.passwordHash,
          },
          create: {
            email: admin.email,
            passwordHash: admin.passwordHash,
            role: Role.ADMIN,
            isActive: true,
          },
        });
        migratedCount++;
      } catch (err: any) {
        const errMsg = `Failed to migrate ${admin.email}: ${err?.message || err}`;
        console.error(errMsg);
        errors.push(errMsg);
      }
    }

    console.log(`Successfully migrated ${migratedCount} admins.`);
    return {
      success: errors.length === 0,
      migratedCount,
      errors,
    };
  } catch (err: any) {
    const criticalError = `Critical migration failure: ${err?.message || err}`;
    console.error(criticalError);
    return {
      success: false,
      migratedCount,
      errors: [criticalError],
    };
  }
}
