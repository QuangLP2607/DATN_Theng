import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import type { CreateChapterDto } from "./dto/createChapter";
import type { UpdateChapterDto } from "./dto/updateChapter";

const chapterSelect = {
  id: true,
  subjectId: true,
  title: true,
  description: true,
  position: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      lessons: true,
    },
  },
} satisfies Prisma.ChapterSelect;

export type ChapterResponse = Prisma.ChapterGetPayload<{
  select: typeof chapterSelect;
}>;

export const getChaptersBysubject = async (subjectId: string) => {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: { id: true },
  });

  if (!subject) {
    throw AppError.notFound("subject not found");
  }

  return prisma.chapter.findMany({
    where: { subjectId },
    select: chapterSelect,
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });
};

export const getChapterById = async (id: string): Promise<ChapterResponse> => {
  const chapter = await prisma.chapter.findUnique({
    where: { id },
    select: chapterSelect,
  });

  if (!chapter) {
    throw AppError.notFound("Chapter not found");
  }

  return chapter;
};

export const createChapter = async (
  subjectId: string,
  data: CreateChapterDto,
): Promise<ChapterResponse> => {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: { id: true },
  });

  if (!subject) {
    throw AppError.notFound("subject not found");
  }

  try {
    return await prisma.chapter.create({
      data: {
        ...data,
        subjectId,
      },
      select: chapterSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw AppError.conflict(
        "Chapter position already exists in this subject",
      );
    }

    throw error;
  }
};

export const updateChapter = async (
  id: string,
  data: UpdateChapterDto,
): Promise<ChapterResponse> => {
  const chapter = await prisma.chapter.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!chapter) {
    throw AppError.notFound("Chapter not found");
  }

  try {
    return await prisma.chapter.update({
      where: { id },
      data,
      select: chapterSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw AppError.conflict(
        "Chapter position already exists in this subject",
      );
    }

    throw error;
  }
};
