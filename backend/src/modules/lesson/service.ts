import { Prisma } from "../../generated/prisma/client";
import { ContentStatus } from "../../generated/prisma/enums";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import { handlePrismaError } from "../../core/prisma-error";

import { AccessAction } from "../access/actions";
import { accessibleBy } from "../access/casl-prisma";
import type { AppAbility } from "../access/casl-prisma";

import type { ListLessonsQueryDto } from "./dto/listLessons";
import type { CreateLessonDto } from "./dto/createLesson";
import type { UpdateLessonDto } from "./dto/updateLesson";

/*
 * -------------------- SELECT --------------------
 */

const lessonSelect = {
  id: true,
  chapterId: true,
  title: true,
  type: true,
  content: true,
  duration: true,
  position: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.LessonSelect;

export type LessonResponse = Prisma.LessonGetPayload<{
  select: typeof lessonSelect;
}>;

const lessonListSelect = {
  ...lessonSelect,

  _count: {
    select: {
      attachments: true,
      progress: true,
    },
  },
} satisfies Prisma.LessonSelect;

export type LessonListItemResponse = Prisma.LessonGetPayload<{
  select: typeof lessonListSelect;
}>;

const lessonDetailSelect = {
  ...lessonListSelect,

  attachments: {
    orderBy: [{ position: "asc" }, { id: "asc" }],
    select: {
      id: true,
      title: true,
      type: true,
      fileName: true,
      mimeType: true,
      size: true,
      externalUrl: true,
      position: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.LessonSelect;

export type LessonDetailResponse = Prisma.LessonGetPayload<{
  select: typeof lessonDetailSelect;
}>;

/*
 * -------------------- ACCESS --------------------
 */

const getCourseAccessWhere = (
  ability: AppAbility,
  action: AccessAction,
): Prisma.CourseWhereInput => {
  return accessibleBy(ability, action).ofType("Course");
};

const validateChapterAccess = async (
  ability: AppAbility,
  chapterId: string,
  action: AccessAction,
) => {
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
    select: {
      id: true,
      courseId: true,
    },
  });

  if (!chapter) {
    throw AppError.notFound("Chapter not found");
  }

  const course = await prisma.course.findFirst({
    where: {
      AND: [
        {
          id: chapter.courseId,
        },
        getCourseAccessWhere(ability, action),
      ],
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw AppError.notFound("Chapter not found");
  }

  return chapter;
};

/*
 * -------------------- HELPERS --------------------
 */

const findLesson = async (
  id: string,
  ability: AppAbility,
  action: AccessAction,
) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      chapterId: true,
    },
  });

  if (!lesson) {
    throw AppError.notFound("Lesson not found");
  }

  await validateChapterAccess(ability, lesson.chapterId, action);

  return lesson;
};

/*
 * -------------------- GET LESSONS --------------------
 */

export const getLessons = async (
  ability: AppAbility,
  chapterId: string,
  query: ListLessonsQueryDto,
): Promise<LessonListItemResponse[]> => {
  await validateChapterAccess(ability, chapterId, AccessAction.READ);

  const where: Prisma.LessonWhereInput = {
    chapterId,
    ...(query.status ? { status: query.status } : {}),
  };

  return prisma.lesson.findMany({
    where,
    select: lessonListSelect,
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });
};

/*
 * -------------------- GET LESSON BY ID --------------------
 */

export const getLessonById = async (
  ability: AppAbility,
  id: string,
): Promise<LessonDetailResponse> => {
  const lesson = await findLesson(id, ability, AccessAction.READ);

  const result = await prisma.lesson.findUnique({
    where: {
      id: lesson.id,
    },
    select: lessonDetailSelect,
  });

  if (!result) {
    throw AppError.notFound("Lesson not found");
  }

  return result;
};

/*
 * -------------------- CREATE LESSON --------------------
 */

export const createLesson = async (
  ability: AppAbility,
  chapterId: string,
  input: CreateLessonDto,
): Promise<LessonResponse> => {
  await validateChapterAccess(ability, chapterId, AccessAction.UPDATE);

  try {
    return await prisma.lesson.create({
      data: {
        chapterId,
        title: input.title,
        type: input.type,
        content: input.content ?? null,
        duration: input.duration ?? null,
        position: input.position,
        status: ContentStatus.DRAFT,
      },
      select: lessonSelect,
    });
  } catch (error) {
    return handlePrismaError(error, {
      uniqueFieldMessages: {
        position: "Vị trí bài học đã tồn tại.",
      },
      uniqueConflictMessage: "Vị trí bài học đã tồn tại trong chương này.",
    });
  }
};

/*
 * -------------------- UPDATE LESSON --------------------
 */

export const updateLesson = async (
  ability: AppAbility,
  id: string,
  input: UpdateLessonDto,
): Promise<LessonResponse> => {
  const lesson = await findLesson(id, ability, AccessAction.UPDATE);

  try {
    return await prisma.lesson.update({
      where: {
        id: lesson.id,
      },
      data: input,
      select: lessonSelect,
    });
  } catch (error) {
    return handlePrismaError(error, {
      uniqueFieldMessages: {
        position: "Vị trí bài học đã tồn tại.",
      },
      uniqueConflictMessage: "Vị trí bài học đã tồn tại trong chương này.",
    });
  }
};

/*
 * -------------------- DELETE LESSON --------------------
 */

export const deleteLesson = async (
  ability: AppAbility,
  id: string,
): Promise<void> => {
  const lesson = await findLesson(id, ability, AccessAction.DELETE);

  const lessonWithCounts = await prisma.lesson.findUnique({
    where: {
      id: lesson.id,
    },
    select: {
      id: true,

      _count: {
        select: {
          attachments: true,
          progress: true,
        },
      },
    },
  });

  if (!lessonWithCounts) {
    throw AppError.notFound("Lesson not found");
  }

  if (lessonWithCounts._count.attachments > 0) {
    throw AppError.conflict(
      "Please delete all attachments before deleting this lesson",
    );
  }

  if (lessonWithCounts._count.progress > 0) {
    throw AppError.conflict(
      "Cannot delete a lesson that has learning progress",
    );
  }

  await prisma.lesson.delete({
    where: {
      id: lesson.id,
    },
  });
};
