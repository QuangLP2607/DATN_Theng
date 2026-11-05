import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

/**
 * Get an active user and their current role from database.
 * Do not rely on role stored in JWT.
 */
export const getActiveUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw AppError.unauthorized("User account not found");
  }

  if (user.status !== "ACTIVE") {
    throw AppError.forbidden("Your account is not active");
  }

  return user;
};

/**
 * Check whether a user has ADMIN role.
 */
export const assertAdminAccess = async (userId: string): Promise<void> => {
  const user = await getActiveUser(userId);

  if (user.role !== UserRole.ADMIN) {
    throw AppError.forbidden("Admin permission required");
  }
};
