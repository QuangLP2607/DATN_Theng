import { Prisma, GradeLevel } from "../../generated/prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import { handlePrismaError } from "../../core/prisma-error";

import type { Pagination } from "../../utils/zod";

import { AccessAction } from "../access/actions";
import { accessibleBy } from "../access/casl-prisma";
import type { AppAbility } from "../access/casl-prisma";

import type { ListSubjectsQueryDto } from "./dto/listSubjects";
import type { CreateSubjectDto } from "./dto/createSubject";
import type { UpdateSubjectDto } from "./dto/updateSubject";

/*
 * -------------------- SELECT --------------------
 */

const subjectSelect = {
  id: true,
  code: true,
  title: true,
  description: true,
  icon: true,

  subjectGrades: {
    select: {
      id: true,
      grade: true,
    },
    orderBy: {
      grade: "asc",
    },
  },

  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SubjectSelect;

export type SubjectResponse = Prisma.SubjectGetPayload<{
  select: typeof subjectSelect;
}>;

/*
 * -------------------- ACCESS --------------------
 */

type SubjectAccessAction =
  | typeof AccessAction.READ
  | typeof AccessAction.UPDATE;

const getSubjectAccessWhere = (
  ability: AppAbility,
  action: SubjectAccessAction,
): Prisma.SubjectWhereInput => {
  return accessibleBy(ability, action).ofType("Subject");
};

/*
 * -------------------- LIST SUBJECTS --------------------
 */

export const getSubjects = async (
  ability: AppAbility,
  query: ListSubjectsQueryDto,
) => {
  const { page, limit, search, sortBy, order } = query;

  const accessWhere = getSubjectAccessWhere(ability, AccessAction.READ);

  const conditions: Prisma.SubjectWhereInput[] = [accessWhere];

  if (search) {
    conditions.push({
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
    });
  }

  const where: Prisma.SubjectWhereInput = {
    AND: conditions,
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

export const getSubjectById = async (
  ability: AppAbility,
  id: string,
): Promise<SubjectResponse> => {
  const accessWhere = getSubjectAccessWhere(ability, AccessAction.READ);

  const subject = await prisma.subject.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
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

/*
 * -------------------- CREATE SUBJECT --------------------
 */

export const createSubject = async (
  data: CreateSubjectDto,
): Promise<SubjectResponse> => {
  try {
    return await prisma.$transaction(async (tx) => {
      const subject = await tx.subject.create({
        data,
        select: subjectSelect,
      });

      await tx.subjectGrade.createMany({
        data: [
          {
            subjectId: subject.id,
            grade: GradeLevel.GRADE_10,
          },
          {
            subjectId: subject.id,
            grade: GradeLevel.GRADE_11,
          },
          {
            subjectId: subject.id,
            grade: GradeLevel.GRADE_12,
          },
        ],
      });

      return subject;
    });
  } catch (error) {
    return handlePrismaError(error, {
      uniqueFieldMessages: {
        code: "Mã môn học đã tồn tại.",
      },
      uniqueConflictMessage: "Thông tin môn học đã tồn tại.",
    });
  }
};
/*
 * -------------------- UPDATE SUBJECT --------------------
 */

export const updateSubject = async (
  ability: AppAbility,
  id: string,
  data: UpdateSubjectDto,
): Promise<SubjectResponse> => {
  const accessWhere = getSubjectAccessWhere(ability, AccessAction.UPDATE);

  try {
    const result = await prisma.subject.updateMany({
      where: {
        AND: [{ id }, accessWhere],
      },
      data,
    });

    if (result.count !== 1) {
      throw AppError.notFound("Subject not found");
    }

    const updatedSubject = await prisma.subject.findFirst({
      where: {
        AND: [{ id }, accessWhere],
      },
      select: subjectSelect,
    });

    if (!updatedSubject) {
      throw AppError.notFound("Subject not found");
    }

    return updatedSubject;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    return handlePrismaError(error, {
      uniqueFieldMessages: {
        code: "Mã môn học đã tồn tại.",
      },
      uniqueConflictMessage: "Thông tin môn học đã tồn tại.",
    });
  }
};
