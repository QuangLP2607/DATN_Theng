import { Prisma } from "../../generated/prisma/client";
import { CourseStatus } from "../../generated/prisma/enums";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import { handlePrismaError } from "../../core/prisma-error";

import type { Pagination } from "../../utils/zod";

import { AccessAction } from "../access/actions";
import { accessibleBy } from "../access/casl-prisma";
import type { AppAbility } from "../access/casl-prisma";

import type { ListCoursesQueryDto } from "./dto/listCourses";
import type { CreateCourseDto } from "./dto/createCourse";
import type { UpdateCourseDto } from "./dto/updateCourse";

/*
 * -------------------- SELECT --------------------
 */

const courseSelect = {
  id: true,
  subjectGradeId: true,
  title: true,
  code: true,
  description: true,
  thumbnailKey: true,
  targetYear: true,
  status: true,
  createdById: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CourseSelect;

export type CourseResponse = Prisma.CourseGetPayload<{
  select: typeof courseSelect;
}>;

const courseListSelect = {
  ...courseSelect,

  subjectGrade: {
    select: {
      id: true,
      grade: true,

      subject: {
        select: {
          id: true,
          code: true,
          title: true,
          icon: true,
        },
      },
    },
  },

  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },

  _count: {
    select: {
      chapters: true,
      classes: true,
    },
  },
} satisfies Prisma.CourseSelect;

export type CourseListItemResponse = Prisma.CourseGetPayload<{
  select: typeof courseListSelect;
}>;

const courseDetailSelect = {
  ...courseListSelect,
} satisfies Prisma.CourseSelect;

export type CourseDetailResponse = Prisma.CourseGetPayload<{
  select: typeof courseDetailSelect;
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

const getSubjectGradeAccessWhere = (
  ability: AppAbility,
): Prisma.SubjectGradeWhereInput => {
  return accessibleBy(ability, AccessAction.READ).ofType("SubjectGrade");
};

/*
 * -------------------- PAGINATION --------------------
 */

export interface GetCoursesResponse {
  courses: CourseListItemResponse[];
  pagination: Pagination;
}

/*
 * -------------------- LIST COURSES --------------------
 */

export const getCourses = async (
  ability: AppAbility,
  query: ListCoursesQueryDto,
): Promise<GetCoursesResponse> => {
  const {
    page,
    limit,
    search,
    subjectGradeId,
    status,
    targetYear,
    sortBy,
    order,
  } = query;

  const accessWhere = getCourseAccessWhere(ability, AccessAction.READ);

  const conditions: Prisma.CourseWhereInput[] = [accessWhere];

  if (subjectGradeId) {
    conditions.push({
      subjectGradeId,
    });
  }

  if (status) {
    conditions.push({
      status,
    });
  }

  if (targetYear !== undefined) {
    conditions.push({
      targetYear,
    });
  }

  if (search) {
    conditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          code: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const where: Prisma.CourseWhereInput = {
    AND: conditions,
  };

  const skip = (page - 1) * limit;

  const orderBy: Prisma.CourseOrderByWithRelationInput = {
    [sortBy]: order,
  };

  const [courses, total] = await prisma.$transaction([
    prisma.course.findMany({
      where,
      select: courseListSelect,
      orderBy: [orderBy, { id: "asc" }],
      skip,
      take: limit,
    }),

    prisma.course.count({
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
    courses,
    pagination,
  };
};

/*
 * -------------------- GET COURSE BY ID --------------------
 */

export const getCourseById = async (
  ability: AppAbility,
  id: string,
): Promise<CourseDetailResponse> => {
  const accessWhere = getCourseAccessWhere(ability, AccessAction.READ);

  const course = await prisma.course.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
    select: courseDetailSelect,
  });

  if (!course) {
    throw AppError.notFound("Course not found");
  }

  return course;
};

/*
 * -------------------- VALIDATE SUBJECT GRADE --------------------
 */

const validateSubjectGrade = async (
  ability: AppAbility,
  subjectGradeId: string,
): Promise<void> => {
  const subjectGrade = await prisma.subjectGrade.findFirst({
    where: {
      AND: [{ id: subjectGradeId }, getSubjectGradeAccessWhere(ability)],
    },
    select: {
      id: true,
    },
  });

  if (!subjectGrade) {
    throw AppError.notFound("Subject grade not found");
  }
};

/*
 * -------------------- CREATE COURSE --------------------
 */

export const createCourse = async (
  ability: AppAbility,
  userId: string,
  input: CreateCourseDto,
): Promise<CourseResponse> => {
  if (!ability.can(AccessAction.CREATE, "Course")) {
    throw AppError.forbidden("You do not have permission to create courses");
  }

  await validateSubjectGrade(ability, input.subjectGradeId);

  try {
    return await prisma.course.create({
      data: {
        ...input,
        createdById: userId,
        status: CourseStatus.DRAFT,
      },
      select: courseSelect,
    });
  } catch (error) {
    return handlePrismaError(error, {
      uniqueFieldMessages: {
        code: "Mã khóa học đã tồn tại.",
      },
      uniqueConflictMessage: "Thông tin khóa học đã tồn tại.",
    });
  }
};

/*
 * -------------------- UPDATE COURSE --------------------
 */

export const updateCourse = async (
  ability: AppAbility,
  id: string,
  input: UpdateCourseDto,
): Promise<CourseResponse> => {
  const accessWhere = getCourseAccessWhere(ability, AccessAction.UPDATE);

  const course = await prisma.course.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!course) {
    throw AppError.notFound("Course not found");
  }

  if (course.status === CourseStatus.PUBLISHED) {
    throw AppError.conflict("Please unpublish the course before updating it");
  }

  if (input.subjectGradeId) {
    await validateSubjectGrade(ability, input.subjectGradeId);
  }

  try {
    const result = await prisma.course.updateMany({
      where: {
        AND: [{ id }, accessWhere],
      },
      data: input,
    });

    if (result.count !== 1) {
      throw AppError.notFound("Course not found");
    }

    const updatedCourse = await prisma.course.findFirst({
      where: {
        AND: [{ id }, accessWhere],
      },
      select: courseSelect,
    });

    if (!updatedCourse) {
      throw AppError.notFound("Course not found");
    }

    return updatedCourse;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    return handlePrismaError(error, {
      uniqueFieldMessages: {
        code: "Mã khóa học đã tồn tại.",
      },
      uniqueConflictMessage: "Thông tin khóa học đã tồn tại.",
    });
  }
};

/*
 * -------------------- DELETE COURSE --------------------
 */

export const deleteCourse = async (
  ability: AppAbility,
  id: string,
): Promise<void> => {
  const accessWhere = getCourseAccessWhere(ability, AccessAction.DELETE);

  const course = await prisma.course.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
    select: {
      id: true,

      _count: {
        select: {
          chapters: true,
          classes: true,
        },
      },
    },
  });

  if (!course) {
    throw AppError.notFound("Course not found");
  }

  if (course._count.classes > 0) {
    throw AppError.conflict(
      "Cannot delete a course that is assigned to classes",
    );
  }

  if (course._count.chapters > 0) {
    throw AppError.conflict(
      "Please delete all chapters before deleting this course",
    );
  }

  await prisma.course.deleteMany({
    where: {
      AND: [{ id }, accessWhere],
    },
  });
};

/*
 * -------------------- PUBLISH COURSE --------------------
 */

export const publishCourse = async (
  ability: AppAbility,
  id: string,
): Promise<CourseResponse> => {
  const accessWhere = getCourseAccessWhere(ability, AccessAction.UPDATE);

  const course = await prisma.course.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!course) {
    throw AppError.notFound("Course not found");
  }

  if (course.status === CourseStatus.PUBLISHED) {
    throw AppError.conflict("Course is already published");
  }

  return prisma.course.update({
    where: {
      id: course.id,
    },
    data: {
      status: CourseStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    select: courseSelect,
  });
};

/*
 * -------------------- UNPUBLISH COURSE --------------------
 */

export const unpublishCourse = async (
  ability: AppAbility,
  id: string,
): Promise<CourseResponse> => {
  const accessWhere = getCourseAccessWhere(ability, AccessAction.UPDATE);

  const course = await prisma.course.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!course) {
    throw AppError.notFound("Course not found");
  }

  if (course.status !== CourseStatus.PUBLISHED) {
    throw AppError.conflict("Course is not published");
  }

  return prisma.course.update({
    where: {
      id: course.id,
    },
    data: {
      status: CourseStatus.DRAFT,
      publishedAt: null,
    },
    select: courseSelect,
  });
};
