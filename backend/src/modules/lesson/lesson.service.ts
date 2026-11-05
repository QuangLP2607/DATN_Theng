import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import type { CreateLessonDto } from "./dto/createLesson";
import type { UpdateLessonDto } from "./dto/updateLesson";

const lessonSelect = {
  id: true,
  chapterId: true,
  title: true,
  type: true,
  content: true,
  fileUrl: true,
  duration: true,
  position: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.LessonSelect;

export type LessonResponse = Prisma.LessonGetPayload<{
  select: typeof lessonSelect;
}>;

export const getLessonsByChapter = async (chapterId: string) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: { id: true },
  });

  if (!chapter) {
    throw AppError.notFound("Chapter not found");
  }

  return prisma.lesson.findMany({
    where: { chapterId },
    select: lessonSelect,
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });
};

export const getLessonById = async (id: string): Promise<LessonResponse> => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: lessonSelect,
  });

  if (!lesson) {
    throw AppError.notFound("Lesson not found");
  }

  return lesson;
};

export const createLesson = async (
  chapterId: string,
  data: CreateLessonDto,
): Promise<LessonResponse> => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: { id: true },
  });

  if (!chapter) {
    throw AppError.notFound("Chapter not found");
  }

  try {
    return await prisma.lesson.create({
      data: {
        ...data,
        chapterId,
      },
      select: lessonSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw AppError.conflict("Lesson position already exists in this chapter");
    }

    throw error;
  }
};

export const updateLesson = async (
  id: string,
  data: UpdateLessonDto,
): Promise<LessonResponse> => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!lesson) {
    throw AppError.notFound("Lesson not found");
  }

  try {
    return await prisma.lesson.update({
      where: { id },
      data,
      select: lessonSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw AppError.conflict("Lesson position already exists in this chapter");
    }

    throw error;
  }
};
