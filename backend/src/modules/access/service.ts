import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import type { ResourceAccessParams } from "./types";

export {
  assertSubjectAccess,
  assertStudentSubjectAccessByUserId,
  assertStudentSubjectAccess,
  assertTeacherSubjectAccess,
} from "./policies/subject.policy";

export { assertClassAccess } from "./policies/class.policy";

export { assertAdminAccess } from "./helpers";

/**
 * Resolve Subject ID from a resource.
 *
 * Subject  -> Subject ID
 * Chapter -> Chapter.subjectId
 * Lesson  -> Lesson.chapter.subjectId
 */
export const getSubjectIdFromResource = async ({
  resource,
  resourceId,
}: ResourceAccessParams): Promise<string> => {
  if (resource === "subject") {
    const subject = await prisma.subject.findUnique({
      where: { id: resourceId },
      select: {
        id: true,
      },
    });

    if (!subject) {
      throw AppError.notFound("Subject not found");
    }

    return subject.id;
  }

  if (resource === "chapter") {
    const chapter = await prisma.chapter.findUnique({
      where: { id: resourceId },
      select: {
        subjectId: true,
      },
    });

    if (!chapter) {
      throw AppError.notFound("Chapter not found");
    }

    return chapter.subjectId;
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: resourceId },
    select: {
      chapter: {
        select: {
          subjectId: true,
        },
      },
    },
  });

  if (!lesson) {
    throw AppError.notFound("Lesson not found");
  }

  return lesson.chapter.subjectId;
};
