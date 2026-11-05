import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../../config/prisma";
import { AppError } from "../../../core/error";

import { getActiveUser } from "../helpers";
import type { ClassAccessParams } from "../types";

/**
 * General Class access policy.
 *
 * ADMIN: access all existing classes.
 * TEACHER: must be assigned to the class.
 * STUDENT: must have an active enrollment in the class.
 */
export const assertClassAccess = async ({
  classId,
  userId,
}: ClassAccessParams): Promise<void> => {
  const user = await getActiveUser(userId);

  // Check whether the class exists.
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!classData) {
    throw AppError.notFound("Class not found");
  }

  // ADMIN can access all existing classes.
  if (user.role === UserRole.ADMIN) {
    return;
  }

  // Non-admin users can only access active classes.
  if (classData.status !== "ACTIVE") {
    throw AppError.forbidden("This class is not active");
  }

  // TEACHER must be assigned to the class.
  if (user.role === UserRole.TEACHER) {
    const assignment = await prisma.classTeacher.findUnique({
      where: {
        classId_teacherId: {
          classId,
          teacherId: userId,
        },
      },
      select: {
        classId: true,
      },
    });

    if (!assignment) {
      throw AppError.forbidden("You are not assigned to this class");
    }

    return;
  }

  // STUDENT must have an active enrollment.
  if (user.role === UserRole.STUDENT) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_studentId: {
          classId,
          studentId: userId,
        },
      },
      select: {
        status: true,
      },
    });

    if (!enrollment || enrollment.status !== "ACTIVE") {
      throw AppError.forbidden("You are not enrolled in this class");
    }

    return;
  }

  throw AppError.forbidden("You do not have permission to access this class");
};
