import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import { Prisma } from "../../generated/prisma/client";

const teacherSelect = {
  id: true,
  classId: true,
  teacherId: true,
  createdAt: true,
  teacher: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
    },
  },
};

export const getClassTeachers = async (classId: string) => {
  const classItem = await prisma.class.findUnique({
    where: { id: classId },
    select: { id: true },
  });

  if (!classItem) {
    throw AppError.notFound("Class not found");
  }

  return prisma.classTeacher.findMany({
    where: { classId },
    select: teacherSelect,
    orderBy: { createdAt: "desc" },
  });
};

export const assignTeacher = async (classId: string, teacherId: string) => {
  const [classItem, teacher] = await Promise.all([
    prisma.class.findUnique({
      where: { id: classId },
      select: { id: true },
    }),
    prisma.user.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
        role: true,
        status: true,
      },
    }),
  ]);

  if (!classItem) {
    throw AppError.notFound("Class not found");
  }

  if (!teacher) {
    throw AppError.notFound("Teacher not found");
  }

  if (teacher.role !== "TEACHER") {
    throw AppError.badRequest("User is not a teacher");
  }

  if (teacher.status !== "ACTIVE") {
    throw AppError.badRequest("Teacher account is not active");
  }

  const existing = await prisma.classTeacher.findUnique({
    where: {
      classId_teacherId: {
        classId,
        teacherId,
      },
    },
    select: { classId: true },
  });

  if (existing) {
    throw AppError.conflict("Teacher is already assigned to this class");
  }

  try {
    return await prisma.classTeacher.create({
      data: {
        classId,
        teacherId,
      },
      select: teacherSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw AppError.conflict("Teacher is already assigned to this class");
    }

    throw error;
  }
};

export const removeTeacher = async (
  classId: string,
  teacherId: string,
): Promise<void> => {
  const assignment = await prisma.classTeacher.findUnique({
    where: {
      classId_teacherId: {
        classId,
        teacherId,
      },
    },
    select: { classId: true },
  });

  if (!assignment) {
    throw AppError.notFound("Teacher assignment not found");
  }

  await prisma.classTeacher.delete({
    where: {
      classId_teacherId: {
        classId,
        teacherId,
      },
    },
  });
};
