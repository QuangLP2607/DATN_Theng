import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../../config/prisma";
import { AppError } from "../../../core/error";

import { getActiveUser } from "../helpers";
import type { SubjectAccessParams } from "../types";

/**
 * Check Student enrollment in an active class of a subject.
 */
export const assertStudentSubjectAccess = async ({
  subjectId,
  userId,
}: SubjectAccessParams): Promise<void> => {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: userId,
      status: "ACTIVE",
      class: {
        is: {
          subjectId,
          status: "ACTIVE",
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!enrollment) {
    throw AppError.forbidden("You do not have access to this subject");
  }
};

/**
 * Check Teacher assignment to an active class of a subject.
 */
export const assertTeacherSubjectAccess = async ({
  subjectId,
  userId,
}: SubjectAccessParams): Promise<void> => {
  const assignment = await prisma.classTeacher.findFirst({
    where: {
      teacherId: userId,
      class: {
        is: {
          subjectId,
          status: "ACTIVE",
        },
      },
    },
    select: {
      classId: true,
    },
  });

  if (!assignment) {
    throw AppError.forbidden("You are not assigned to teach this subject");
  }
};

/**
 * General Subject access policy.
 *
 * ADMIN: access all subjects.
 * TEACHER: must be assigned to an active class.
 * STUDENT: must have an active enrollment in an active class.
 */
export const assertSubjectAccess = async ({
  subjectId,
  userId,
}: SubjectAccessParams): Promise<void> => {
  const user = await getActiveUser(userId);

  if (user.role === UserRole.ADMIN) {
    return;
  }

  if (user.role === UserRole.TEACHER) {
    await assertTeacherSubjectAccess({
      subjectId,
      userId,
    });

    return;
  }

  if (user.role === UserRole.STUDENT) {
    await assertStudentSubjectAccess({
      subjectId,
      userId,
    });

    return;
  }

  throw AppError.forbidden("You do not have permission to access this subject");
};

/**
 * Student-only Subject access policy.
 * Used by learning progress and other student-only operations.
 */
export const assertStudentSubjectAccessByUserId = async ({
  subjectId,
  userId,
}: SubjectAccessParams): Promise<void> => {
  const user = await getActiveUser(userId);

  if (user.role !== UserRole.STUDENT) {
    throw AppError.forbidden("Only students can perform this action");
  }

  await assertStudentSubjectAccess({
    subjectId,
    userId,
  });
};
