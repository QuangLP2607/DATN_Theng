import { Prisma } from "../../generated/prisma/client";
import { ContentStatus } from "../../generated/prisma/enums";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import { AccessAction } from "../access/actions";
import { accessibleBy } from "../access/casl-prisma";
import type { AppAbility } from "../access/casl-prisma";

import type { ListChaptersQueryDto } from "./dto/listChapters";
import type { CreateChapterDto } from "./dto/createChapter";
import type { UpdateChapterDto } from "./dto/updateChapter";

/*
 * -------------------- SELECT --------------------
 */

const chapterSelect = {
  id: true,
  courseId: true,
  title: true,
  description: true,
  position: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ChapterSelect;

export type ChapterResponse = Prisma.ChapterGetPayload<{
  select: typeof chapterSelect;
}>;

const chapterListSelect = {
  ...chapterSelect,

  _count: {
    select: {
      lessons: true,
      questions: true,
    },
  },
} satisfies Prisma.ChapterSelect;

export type ChapterListItemResponse = Prisma.ChapterGetPayload<{
  select: typeof chapterListSelect;
}>;

const chapterDetailSelect = {
  ...chapterListSelect,

  lessons: {
    orderBy: [{ position: "asc" }, { id: "asc" }],
    select: {
      id: true,
      title: true,
      type: true,
      duration: true,
      position: true,
      status: true,
    },
  },
} satisfies Prisma.ChapterSelect;

export type ChapterDetailResponse = Prisma.ChapterGetPayload<{
  select: typeof chapterDetailSelect;
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

const validateCourseAccess = async (
  ability: AppAbility,
  courseId: string,
  action: AccessAction,
): Promise<void> => {
  const course = await prisma.course.findFirst({
    where: {
      AND: [{ id: courseId }, getCourseAccessWhere(ability, action)],
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw AppError.notFound("Course not found");
  }
};

/*
 * -------------------- HELPERS --------------------
 */

const handlePositionConflict = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw AppError.conflict("Chapter position already exists in this course");
  }

  throw error;
};

const findChapter = async (
  id: string,
  ability: AppAbility,
  action: AccessAction,
) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id },
    select: {
      id: true,
      courseId: true,
    },
  });

  if (!chapter) {
    throw AppError.notFound("Chapter not found");
  }

  await validateCourseAccess(ability, chapter.courseId, action);

  return chapter;
};

/*
 * -------------------- GET CHAPTERS --------------------
 */

export const getChapters = async (
  ability: AppAbility,
  courseId: string,
  query: ListChaptersQueryDto,
): Promise<ChapterListItemResponse[]> => {
  await validateCourseAccess(ability, courseId, AccessAction.READ);

  const where: Prisma.ChapterWhereInput = {
    courseId,
    ...(query.status ? { status: query.status } : {}),
  };

  return prisma.chapter.findMany({
    where,
    select: chapterListSelect,
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });
};

/*
 * -------------------- GET CHAPTER BY ID --------------------
 */

export const getChapterById = async (
  ability: AppAbility,
  id: string,
): Promise<ChapterDetailResponse> => {
  const chapter = await findChapter(id, ability, AccessAction.READ);

  const result = await prisma.chapter.findUnique({
    where: {
      id: chapter.id,
    },
    select: chapterDetailSelect,
  });

  if (!result) {
    throw AppError.notFound("Chapter not found");
  }

  return result;
};

/*
 * -------------------- CREATE CHAPTER --------------------
 */

export const createChapter = async (
  ability: AppAbility,
  courseId: string,
  input: CreateChapterDto,
): Promise<ChapterResponse> => {
  await validateCourseAccess(ability, courseId, AccessAction.UPDATE);

  try {
    return await prisma.chapter.create({
      data: {
        courseId,
        title: input.title,
        description: input.description ?? null,
        position: input.position,
        status: ContentStatus.DRAFT,
      },
      select: chapterSelect,
    });
  } catch (error) {
    return handlePositionConflict(error);
  }
};

/*
 * -------------------- UPDATE CHAPTER --------------------
 */

export const updateChapter = async (
  ability: AppAbility,
  id: string,
  input: UpdateChapterDto,
): Promise<ChapterResponse> => {
  const chapter = await findChapter(id, ability, AccessAction.UPDATE);

  try {
    return await prisma.chapter.update({
      where: {
        id: chapter.id,
      },
      data: input,
      select: chapterSelect,
    });
  } catch (error) {
    return handlePositionConflict(error);
  }
};
/*
 * -------------------- DELETE CHAPTER --------------------
 */

export const deleteChapter = async (
  ability: AppAbility,
  id: string,
): Promise<void> => {
  const chapter = await findChapter(id, ability, AccessAction.DELETE);

  const chapterWithCounts = await prisma.chapter.findUnique({
    where: {
      id: chapter.id,
    },
    select: {
      id: true,

      _count: {
        select: {
          lessons: true,
          questions: true,
        },
      },
    },
  });

  if (!chapterWithCounts) {
    throw AppError.notFound("Chapter not found");
  }

  if (chapterWithCounts._count.lessons > 0) {
    throw AppError.conflict(
      "Please delete all lessons before deleting this chapter",
    );
  }

  if (chapterWithCounts._count.questions > 0) {
    throw AppError.conflict("Cannot delete a chapter that contains questions");
  }

  await prisma.chapter.delete({
    where: {
      id: chapter.id,
    },
  });
};
