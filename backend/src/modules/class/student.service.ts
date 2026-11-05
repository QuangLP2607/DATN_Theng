import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

const studentSelect = {
  id: true,
  classId: true,
  studentId: true,
  status: true,
  joinedAt: true,
  createdAt: true,
  updatedAt: true,
  student: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
    },
  },
} satisfies Prisma.EnrollmentSelect;

export const getClassStudents = async (classId: string) => {
  const classItem = await prisma.class.findUnique({
    where: { id: classId },
    select: { id: true },
  });

  if (!classItem) {
    throw AppError.notFound("Class not found");
  }

  return prisma.enrollment.findMany({
    where: {
      classId,
      status: "ACTIVE",
    },
    select: studentSelect,
    orderBy: {
      joinedAt: "desc",
    },
  });
};

export const enrollStudent = async (classId: string, studentId: string) => {
  const [classItem, student] = await Promise.all([
    prisma.class.findUnique({
      where: { id: classId },
      select: {
        id: true,
        status: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: studentId },
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

  if (classItem.status !== "ACTIVE") {
    throw AppError.badRequest("Cannot enroll students in an inactive class");
  }

  if (!student) {
    throw AppError.notFound("Student not found");
  }

  if (student.role !== "STUDENT") {
    throw AppError.badRequest("User is not a student");
  }

  if (student.status !== "ACTIVE") {
    throw AppError.badRequest("Student account is not active");
  }

  const existing = await prisma.enrollment.findUnique({
    where: {
      classId_studentId: {
        classId,
        studentId,
      },
    },
  });

  if (existing?.status === "ACTIVE") {
    throw AppError.conflict("Student is already enrolled in this class");
  }

  if (existing) {
    return prisma.enrollment.update({
      where: {
        classId_studentId: {
          classId,
          studentId,
        },
      },
      data: {
        status: "ACTIVE",
        joinedAt: new Date(),
      },
      select: studentSelect,
    });
  }

  try {
    return await prisma.enrollment.create({
      data: {
        classId,
        studentId,
        status: "ACTIVE",
        joinedAt: new Date(),
      },
      select: studentSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw AppError.conflict("Student is already enrolled in this class");
    }

    throw error;
  }
};

export const removeStudent = async (
  classId: string,
  studentId: string,
): Promise<void> => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      classId_studentId: {
        classId,
        studentId,
      },
    },
    select: {
      status: true,
    },
  });

  if (!enrollment || enrollment.status !== "ACTIVE") {
    throw AppError.notFound("Active student enrollment not found");
  }

  await prisma.enrollment.update({
    where: {
      classId_studentId: {
        classId,
        studentId,
      },
    },
    data: {
      status: "INACTIVE",
    },
  });
};
