import { Prisma } from "../../generated/prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import type { Pagination } from "../../utils/zod";

import type { ListSubjectsQueryDto } from "./dto/listSubjects";
import type { CreateSubjectDto } from "./dto/createSubject";
import type { UpdateSubjectDto } from "./dto/updateSubject";

const subjectSelect = {
  id: true,
  code: true,
  title: true,
  description: true,
  icon: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      classes: true,
      chapters: true,
    },
  },
} satisfies Prisma.SubjectSelect;

export type SubjectResponse = Prisma.SubjectGetPayload<{
  select: typeof subjectSelect;
}>;

/*
 * -------------------- LIST SUBJECTS --------------------
 */

export const getSubjects = async (query: ListSubjectsQueryDto) => {
  const { page, limit, search, sortBy, order } = query;

  const where: Prisma.SubjectWhereInput = {
    ...(search && {
      OR: [
        {
          code: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const skip = (page - 1) * limit;

  const orderBy: Prisma.SubjectOrderByWithRelationInput = {
    [sortBy]: order,
  };

  const [subjects, total] = await prisma.$transaction([
    prisma.subject.findMany({
      where,
      select: subjectSelect,
      orderBy: [orderBy, { id: "asc" }],
      skip,
      take: limit,
    }),

    prisma.subject.count({
      where,
    }),
  ]);

  const pagination: Pagination = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return {
    subjects,
    pagination,
  };
};

/*
 * -------------------- GET SUBJECT BY ID --------------------
 */

export const getSubjectById = async (id: string): Promise<SubjectResponse> => {
  const subject = await prisma.subject.findUnique({
    where: { id },
    select: subjectSelect,
  });

  if (!subject) {
    throw AppError.notFound("Subject not found");
  }

  return subject;
};

/*
 * -------------------- CREATE SUBJECT --------------------
 */

export const createSubject = async (
  data: CreateSubjectDto,
): Promise<SubjectResponse> => {
  return prisma.subject.create({
    data,
    select: subjectSelect,
  });
};

/*
 * -------------------- UPDATE SUBJECT --------------------
 */

export const updateSubject = async (
  id: string,
  data: UpdateSubjectDto,
): Promise<SubjectResponse> => {
  const existingSubject = await prisma.subject.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingSubject) {
    throw AppError.notFound("Subject not found");
  }

  return prisma.subject.update({
    where: { id },
    data,
    select: subjectSelect,
  });
};

/*
 * -------------------- DELETE SUBJECT --------------------
 */

export const deleteSubject = async (id: string) => {
  const existingSubject = await prisma.subject.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingSubject) {
    throw AppError.notFound("Subject not found");
  }

  return prisma.subject.delete({
    where: { id },
    select: {
      id: true,
    },
  });
};
