import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

const progressSelect = {
  id: true,
  lessonId: true,
  studentId: true,
  progress: true,
  completed: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.LessonProgressSelect;

export type LessonProgressResponse = Prisma.LessonProgressGetPayload<{
  select: typeof progressSelect;
}>;

export const updateLessonProgress = async (
  lessonId: string,
  studentId: string,
  progress: number,
): Promise<LessonProgressResponse> => {
  const [lesson, student] = await Promise.all([
    prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        chapter: {
          select: {
            subjectId: true,
          },
        },
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

  if (!lesson) {
    throw AppError.notFound("Lesson not found");
  }

  if (!student) {
    throw AppError.notFound("Student not found");
  }

  if (student.role !== "STUDENT" || student.status !== "ACTIVE") {
    throw AppError.forbidden("Active student account required");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId,
      status: "ACTIVE",
      class: {
        is: {
          subjectId: lesson.chapter.subjectId,
          status: "ACTIVE",
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!enrollment) {
    throw AppError.forbidden(
      "You are not enrolled in an active class for this subject",
    );
  }

  const existingProgress = await prisma.lessonProgress.findUnique({
    where: {
      lessonId_studentId: {
        lessonId,
        studentId,
      },
    },
    select: {
      completedAt: true,
    },
  });

  const completed = progress === 100;

  const completedAt = completed
    ? (existingProgress?.completedAt ?? new Date())
    : null;

  return prisma.lessonProgress.upsert({
    where: {
      lessonId_studentId: {
        lessonId,
        studentId,
      },
    },
    create: {
      lessonId,
      studentId,
      progress,
      completed,
      completedAt,
    },
    update: {
      progress,
      completed,
      completedAt,
    },
    select: progressSelect,
  });
};
