import { Prisma } from "../../generated/prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import { AccessAction } from "../access/actions";
import { accessibleBy } from "../access/casl-prisma";
import type { AppAbility } from "../access/casl-prisma";

import type { ListSubjectGradesQueryDto } from "./dto/listSubjectGrades";

/*
 * -------------------- SELECT --------------------
 */

const subjectGradeSelect = {
  id: true,
  subjectId: true,
  grade: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SubjectGradeSelect;

export type SubjectGradeResponse = Prisma.SubjectGradeGetPayload<{
  select: typeof subjectGradeSelect;
}>;

const subjectGradeDetailSelect = {
  ...subjectGradeSelect,

  subject: {
    select: {
      id: true,
      code: true,
      title: true,
      icon: true,
    },
  },

  _count: {
    select: {
      courses: true,
      questions: true,
    },
  },
} satisfies Prisma.SubjectGradeSelect;

export type SubjectGradeDetailResponse = Prisma.SubjectGradeGetPayload<{
  select: typeof subjectGradeDetailSelect;
}>;

/*
 * -------------------- ACCESS --------------------
 */

const getSubjectAccessWhere = (
  ability: AppAbility,
): Prisma.SubjectWhereInput => {
  return accessibleBy(ability, AccessAction.READ).ofType("Subject");
};

/*
 * -------------------- LIST SUBJECT GRADES --------------------
 */

export const getSubjectGrades = async (
  ability: AppAbility,
  query: ListSubjectGradesQueryDto,
): Promise<SubjectGradeResponse[]> => {
  const subjectAccessWhere = getSubjectAccessWhere(ability);

  const subject = await prisma.subject.findFirst({
    where: {
      AND: [{ id: query.subjectId }, subjectAccessWhere],
    },
    select: {
      id: true,
    },
  });

  if (!subject) {
    throw AppError.notFound("Subject not found");
  }

  return prisma.subjectGrade.findMany({
    where: {
      subjectId: subject.id,
    },
    select: subjectGradeSelect,
    orderBy: {
      grade: "asc",
    },
  });
};

/*
 * -------------------- GET SUBJECT GRADE BY ID --------------------
 */

export const getSubjectGradeById = async (
  ability: AppAbility,
  id: string,
): Promise<SubjectGradeDetailResponse> => {
  const subjectAccessWhere = getSubjectAccessWhere(ability);

  const subjectGrade = await prisma.subjectGrade.findFirst({
    where: {
      AND: [
        { id },
        {
          subject: {
            is: subjectAccessWhere,
          },
        },
      ],
    },
    select: subjectGradeDetailSelect,
  });

  if (!subjectGrade) {
    throw AppError.notFound("Subject grade not found");
  }

  return subjectGrade;
};
