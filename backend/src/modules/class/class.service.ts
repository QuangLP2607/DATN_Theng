import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import type { Pagination } from "../../utils/zod";
import type { CreateClassDto } from "./dto/createClass";
import type { UpdateClassDto } from "./dto/updateClass";
import type { ListClassesQueryDto } from "./dto/listClasses";

const classSelect = {
  id: true,
  subjectId: true,
  name: true,
  code: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  subject: {
    select: {
      id: true,
      title: true,
      icon: true,
    },
  },
  _count: {
    select: {
      teachers: true,
      students: true,
      assignments: true,
      exams: true,
    },
  },
} satisfies Prisma.ClassSelect;

export type ClassResponse = Prisma.ClassGetPayload<{
  select: typeof classSelect;
}>;

export const getClasses = async (
  query: ListClassesQueryDto,
): Promise<{ classes: ClassResponse[]; pagination: Pagination }> => {
  const { page, limit, search, subjectId, status, sortBy, order } = query;

  const where: Prisma.ClassWhereInput = {
    ...(subjectId && { subjectId }),
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy = {
    [sortBy]: order,
  } as Prisma.ClassOrderByWithRelationInput;

  const [classes, total] = await prisma.$transaction([
    prisma.class.findMany({
      where,
      select: classSelect,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [orderBy, { id: "asc" }],
    }),
    prisma.class.count({ where }),
  ]);

  return {
    classes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getClassById = async (id: string): Promise<ClassResponse> => {
  const classItem = await prisma.class.findUnique({
    where: { id },
    select: classSelect,
  });

  if (!classItem) {
    throw AppError.notFound("Class not found");
  }

  return classItem;
};

export const createClass = async (
  data: CreateClassDto,
): Promise<ClassResponse> => {
  const subject = await prisma.subject.findUnique({
    where: { id: data.subjectId },
    select: { id: true },
  });

  if (!subject) {
    throw AppError.notFound("subject not found");
  }

  const existingClass = await prisma.class.findUnique({
    where: { code: data.code },
    select: { id: true },
  });

  if (existingClass) {
    throw AppError.conflict("Class code already exists");
  }

  try {
    return await prisma.class.create({
      data,
      select: classSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw AppError.conflict("Class code already exists");
    }

    throw error;
  }
};

export const updateClass = async (
  id: string,
  data: UpdateClassDto,
): Promise<ClassResponse> => {
  const existingClass = await prisma.class.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingClass) {
    throw AppError.notFound("Class not found");
  }

  if (data.subjectId) {
    const subject = await prisma.subject.findUnique({
      where: { id: data.subjectId },
      select: { id: true },
    });

    if (!subject) {
      throw AppError.notFound("subject not found");
    }
  }

  if (data.code) {
    const duplicate = await prisma.class.findFirst({
      where: {
        code: data.code,
        NOT: { id },
      },
      select: { id: true },
    });

    if (duplicate) {
      throw AppError.conflict("Class code already exists");
    }
  }

  try {
    return await prisma.class.update({
      where: { id },
      data,
      select: classSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw AppError.conflict("Class code already exists");
    }

    throw error;
  }
};

export const deleteClass = async (id: string): Promise<void> => {
  const existingClass = await prisma.class.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingClass) {
    throw AppError.notFound("Class not found");
  }

  await prisma.class.delete({
    where: { id },
  });
};
