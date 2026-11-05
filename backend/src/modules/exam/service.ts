import { Prisma } from "../../generated/prisma/client";
import {
  ClassStatus,
  EnrollmentStatus,
  ExamStatus,
  UserRole,
} from "../../generated/prisma/enums";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import { assertClassAccess } from "../access/service";

import type { Pagination } from "../../utils/zod";

import type { CreateExamDto } from "./dto/createExam";
import type { UpdateExamDto } from "./dto/updateExam";
import type { ListExamsQueryDto } from "./dto/listExams";
import type { AddExamQuestionsDto } from "./dto/addExamQuestions";
import type { UpdateExamQuestionDto } from "./dto/updateExamQuestion";

// ======================================================
// SELECT
// ======================================================

const examListSelect = {
  id: true,
  classId: true,
  title: true,
  description: true,
  durationMinutes: true,
  scheduledAt: true,
  maxAttempts: true,
  status: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,

  _count: {
    select: {
      questions: true,
      attempts: true,
    },
  },

  class: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
} satisfies Prisma.ExamSelect;

const examDetailSelect = {
  id: true,
  classId: true,
  title: true,
  description: true,
  durationMinutes: true,
  scheduledAt: true,
  maxAttempts: true,
  status: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,

  class: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },

  questions: {
    orderBy: {
      position: "asc",
    },
    select: {
      questionId: true,
      points: true,
      position: true,
      question: {
        select: {
          id: true,
          content: true,
          type: true,
          explanation: true,
          options: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              content: true,
              isCorrect: true,
              position: true,
            },
          },
        },
      },
    },
  },

  _count: {
    select: {
      attempts: true,
    },
  },
} satisfies Prisma.ExamSelect;

// ======================================================
// HELPERS
// ======================================================

const assertExamManager = (role: UserRole): void => {
  if (role !== UserRole.ADMIN && role !== UserRole.TEACHER) {
    throw AppError.forbidden("Only Admin and Teacher can manage exams");
  }
};

const getExamOrThrow = async (examId: string) => {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    select: {
      id: true,
      classId: true,
      status: true,
      createdBy: true,
      _count: {
        select: {
          attempts: true,
        },
      },
    },
  });

  if (!exam) {
    throw AppError.notFound("Exam not found");
  }

  return exam;
};

const assertExamAccess = async (
  examId: string,
  userId: string,
  role: UserRole,
) => {
  const exam = await getExamOrThrow(examId);

  await assertClassAccess({
    classId: exam.classId,
    userId,
  });

  if (role === UserRole.STUDENT && exam.status !== ExamStatus.PUBLISHED) {
    throw AppError.notFound("Exam not found");
  }

  return exam;
};

const assertExamEditable = async (
  examId: string,
  userId: string,
  role: UserRole,
) => {
  assertExamManager(role);

  const exam = await assertExamAccess(examId, userId, role);

  if (exam.status !== ExamStatus.DRAFT) {
    throw AppError.conflict("Only draft exams can be modified");
  }

  if (exam._count.attempts > 0) {
    throw AppError.conflict("Cannot modify an exam that already has attempts");
  }

  return exam;
};

const assertQuestionOwnership = async (
  questionIds: string[],
  userId: string,
  role: UserRole,
): Promise<void> => {
  if (questionIds.length === 0) return;

  const questions = await prisma.question.findMany({
    where: {
      id: { in: questionIds },

      ...(role === UserRole.ADMIN ? {} : { createdBy: userId }),
    },
    select: {
      id: true,
    },
  });

  if (questions.length !== questionIds.length) {
    throw AppError.badRequest(
      "Some questions do not exist or you do not have permission to use them",
    );
  }
};

// ======================================================
// GET EXAMS
// ======================================================

export const getExams = async (
  query: ListExamsQueryDto,
  userId: string,
  role: UserRole,
): Promise<{
  exams: Prisma.ExamGetPayload<{
    select: typeof examListSelect;
  }>[];
  pagination: Pagination;
}> => {
  const { page, limit, search, classId, status, sortBy, order } = query;

  if (classId) {
    await assertClassAccess({
      classId,
      userId,
    });
  }

  const where: Prisma.ExamWhereInput = {
    ...(classId && { classId }),

    ...(search && {
      title: {
        contains: search,
        mode: "insensitive",
      },
    }),

    ...(role === UserRole.ADMIN
      ? {
          ...(status && { status }),
        }
      : role === UserRole.TEACHER
        ? {
            class: {
              status: ClassStatus.ACTIVE,
              teachers: {
                some: {
                  teacherId: userId,
                },
              },
            },
            ...(status && { status }),
          }
        : {
            status: ExamStatus.PUBLISHED,
            class: {
              status: ClassStatus.ACTIVE,
              students: {
                some: {
                  studentId: userId,
                  status: EnrollmentStatus.ACTIVE,
                },
              },
            },
          }),
  };

  const orderBy: Prisma.ExamOrderByWithRelationInput = {
    [sortBy]: order,
  };

  const [exams, total] = await prisma.$transaction([
    prisma.exam.findMany({
      where,
      select: examListSelect,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [orderBy, { id: "asc" }],
    }),

    prisma.exam.count({ where }),
  ]);

  return {
    exams,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ======================================================
// GET EXAM BY ID
// ======================================================

export const getExamById = async (
  examId: string,
  userId: string,
  role: UserRole,
) => {
  await assertExamAccess(examId, userId, role);

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    select: examDetailSelect,
  });

  if (!exam) {
    throw AppError.notFound("Exam not found");
  }

  // Students must never receive correct answers or explanations.
  if (role === UserRole.STUDENT) {
    return {
      ...exam,
      questions: exam.questions.map((item) => ({
        ...item,
        question: {
          ...item.question,
          explanation: null,
          options: item.question.options.map((option) => ({
            id: option.id,
            content: option.content,
            position: option.position,
          })),
        },
      })),
    };
  }

  return exam;
};

// ======================================================
// CREATE EXAM
// ======================================================

export const createExam = async (
  data: CreateExamDto,
  userId: string,
  role: UserRole,
) => {
  assertExamManager(role);

  await assertClassAccess({
    classId: data.classId,
    userId,
  });

  return prisma.exam.create({
    data: {
      classId: data.classId,
      title: data.title,
      description: data.description,
      durationMinutes: data.durationMinutes,
      scheduledAt: data.scheduledAt,
      maxAttempts: data.maxAttempts,
      createdBy: userId,
    },
    select: examListSelect,
  });
};

// ======================================================
// UPDATE EXAM
// ======================================================

export const updateExam = async (
  examId: string,
  data: UpdateExamDto,
  userId: string,
  role: UserRole,
) => {
  await assertExamEditable(examId, userId, role);

  return prisma.exam.update({
    where: { id: examId },
    data: {
      ...(data.title !== undefined && {
        title: data.title,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.durationMinutes !== undefined && {
        durationMinutes: data.durationMinutes,
      }),

      ...(data.scheduledAt !== undefined && {
        scheduledAt: data.scheduledAt,
      }),

      ...(data.maxAttempts !== undefined && {
        maxAttempts: data.maxAttempts,
      }),
    },
    select: examListSelect,
  });
};

// ======================================================
// DELETE EXAM
// ======================================================

export const deleteExam = async (
  examId: string,
  userId: string,
  role: UserRole,
): Promise<void> => {
  await assertExamEditable(examId, userId, role);

  await prisma.exam.delete({
    where: { id: examId },
  });
};

// ======================================================
// ADD QUESTIONS TO EXAM
// ======================================================

export const addExamQuestions = async (
  examId: string,
  data: AddExamQuestionsDto,
  userId: string,
  role: UserRole,
) => {
  await assertExamEditable(examId, userId, role);

  const questionIds = data.questions.map((question) => question.questionId);

  await assertQuestionOwnership(questionIds, userId, role);

  const existingQuestions = await prisma.examQuestion.findMany({
    where: {
      examId,
      questionId: {
        in: questionIds,
      },
    },
    select: {
      questionId: true,
    },
  });

  if (existingQuestions.length > 0) {
    throw AppError.conflict(
      "Some questions have already been added to this exam",
    );
  }

  const existingPositions = await prisma.examQuestion.findMany({
    where: { examId },
    select: {
      position: true,
    },
  });

  const positions = new Set(existingPositions.map((item) => item.position));

  for (const item of data.questions) {
    if (positions.has(item.position)) {
      throw AppError.conflict("Question position already exists in this exam");
    }

    positions.add(item.position);
  }

  await prisma.$transaction(
    data.questions.map((item) =>
      prisma.examQuestion.create({
        data: {
          examId,
          questionId: item.questionId,
          points: item.points,
          position: item.position,
        },
      }),
    ),
  );

  return getExamById(examId, userId, role);
};

// ======================================================
// UPDATE QUESTION IN EXAM
// ======================================================

export const updateExamQuestion = async (
  examId: string,
  questionId: string,
  data: UpdateExamQuestionDto,
  userId: string,
  role: UserRole,
) => {
  await assertExamEditable(examId, userId, role);

  const examQuestion = await prisma.examQuestion.findUnique({
    where: {
      examId_questionId: {
        examId,
        questionId,
      },
    },
    select: {
      position: true,
    },
  });

  if (!examQuestion) {
    throw AppError.notFound("Question not found in this exam");
  }

  if (data.position !== undefined) {
    const duplicatePosition = await prisma.examQuestion.findFirst({
      where: {
        examId,
        position: data.position,
        questionId: {
          not: questionId,
        },
      },
      select: {
        questionId: true,
      },
    });

    if (duplicatePosition) {
      throw AppError.conflict("Question position already exists in this exam");
    }
  }

  await prisma.examQuestion.update({
    where: {
      examId_questionId: {
        examId,
        questionId,
      },
    },
    data: {
      ...(data.points !== undefined && {
        points: data.points,
      }),

      ...(data.position !== undefined && {
        position: data.position,
      }),
    },
  });

  return getExamById(examId, userId, role);
};

// ======================================================
// REMOVE QUESTION FROM EXAM
// ======================================================

export const removeExamQuestion = async (
  examId: string,
  questionId: string,
  userId: string,
  role: UserRole,
): Promise<void> => {
  await assertExamEditable(examId, userId, role);

  const examQuestion = await prisma.examQuestion.findUnique({
    where: {
      examId_questionId: {
        examId,
        questionId,
      },
    },
    select: {
      questionId: true,
    },
  });

  if (!examQuestion) {
    throw AppError.notFound("Question not found in this exam");
  }

  await prisma.examQuestion.delete({
    where: {
      examId_questionId: {
        examId,
        questionId,
      },
    },
  });
};

// ======================================================
// PUBLISH EXAM
// ======================================================

export const publishExam = async (
  examId: string,
  userId: string,
  role: UserRole,
) => {
  assertExamManager(role);

  const exam = await assertExamAccess(examId, userId, role);

  if (exam.status !== ExamStatus.DRAFT) {
    throw AppError.conflict("Only draft exams can be published");
  }

  const questionCount = await prisma.examQuestion.count({
    where: { examId },
  });

  if (questionCount === 0) {
    throw AppError.badRequest(
      "An exam must have at least one question before publishing",
    );
  }

  return prisma.exam.update({
    where: { id: examId },
    data: {
      status: ExamStatus.PUBLISHED,
    },
    select: examListSelect,
  });
};

// ======================================================
// CLOSE EXAM
// ======================================================

export const closeExam = async (
  examId: string,
  userId: string,
  role: UserRole,
) => {
  assertExamManager(role);

  const exam = await assertExamAccess(examId, userId, role);

  if (exam.status !== ExamStatus.PUBLISHED) {
    throw AppError.conflict("Only published exams can be closed");
  }

  return prisma.exam.update({
    where: { id: examId },
    data: {
      status: ExamStatus.CLOSED,
    },
    select: examListSelect,
  });
};
