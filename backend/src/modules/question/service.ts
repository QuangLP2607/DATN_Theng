import { Prisma } from "../../generated/prisma/client";
import { QuestionType, UserRole } from "../../generated/prisma/enums";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import type { Pagination } from "../../utils/zod";

import type { CreateQuestionDto } from "./dto/createQuestion";
import type { UpdateQuestionDto } from "./dto/updateQuestion";
import type { ListQuestionsQueryDto } from "./dto/listQuestions";

// ======================================================
// SELECT
// ======================================================

const questionSelect = {
  id: true,
  content: true,
  type: true,
  explanation: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  options: {
    select: {
      id: true,
      content: true,
      isCorrect: true,
      position: true,
    },
    orderBy: {
      position: "asc",
    },
  },
  creator: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.QuestionSelect;

type QuestionResult = Prisma.QuestionGetPayload<{
  select: typeof questionSelect;
}>;

// ======================================================
// HELPERS
// ======================================================

const assertQuestionManager = (role: UserRole): void => {
  if (role !== UserRole.ADMIN && role !== UserRole.TEACHER) {
    throw AppError.forbidden("Only Admin and Teacher can manage questions");
  }
};

const assertQuestionPermission = async (
  questionId: string,
  userId: string,
  role: UserRole,
): Promise<void> => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      createdBy: true,
    },
  });

  if (!question) {
    throw AppError.notFound("Question not found");
  }

  if (role !== UserRole.ADMIN && question.createdBy !== userId) {
    throw AppError.forbidden(
      "You do not have permission to manage this question",
    );
  }
};

const assertQuestionNotUsedInExam = async (
  questionId: string,
): Promise<void> => {
  const examQuestion = await prisma.examQuestion.findFirst({
    where: { questionId },
    select: { examId: true },
  });

  if (examQuestion) {
    throw AppError.conflict(
      "Cannot modify a question that is already used in an exam",
    );
  }
};

const validateOptions = (
  type: QuestionType,
  options: {
    isCorrect: boolean;
    position: number;
  }[],
): void => {
  if (type === QuestionType.ESSAY) {
    if (options.length > 0) {
      throw AppError.badRequest("Essay questions cannot have options");
    }

    return;
  }

  if (options.length < 2) {
    throw AppError.badRequest("At least two options are required");
  }

  const correctCount = options.filter((option) => option.isCorrect).length;

  if (correctCount === 0) {
    throw AppError.badRequest("At least one correct option is required");
  }

  if (type === QuestionType.SINGLE_CHOICE || type === QuestionType.TRUE_FALSE) {
    if (correctCount !== 1) {
      throw AppError.badRequest("Exactly one correct option is required");
    }
  }

  if (type === QuestionType.TRUE_FALSE && options.length !== 2) {
    throw AppError.badRequest(
      "True/False questions must have exactly two options",
    );
  }

  const positions = options.map((option) => option.position);

  if (new Set(positions).size !== positions.length) {
    throw AppError.badRequest("Option positions must be unique");
  }
};

// ======================================================
// GET QUESTIONS
// ======================================================

export const getQuestions = async (
  query: ListQuestionsQueryDto,
  userId: string,
  role: UserRole,
): Promise<{
  questions: QuestionResult[];
  pagination: Pagination;
}> => {
  assertQuestionManager(role);

  const { page, limit, search, type, sortBy, order } = query;

  const where: Prisma.QuestionWhereInput = {
    ...(role === UserRole.ADMIN ? {} : { createdBy: userId }),

    ...(type && { type }),

    ...(search && {
      content: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  const orderBy: Prisma.QuestionOrderByWithRelationInput = {
    [sortBy]: order,
  };

  const [questions, total] = await prisma.$transaction([
    prisma.question.findMany({
      where,
      select: questionSelect,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [orderBy, { id: "asc" }],
    }),

    prisma.question.count({ where }),
  ]);

  return {
    questions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ======================================================
// GET QUESTION BY ID
// ======================================================

export const getQuestionById = async (
  questionId: string,
  userId: string,
  role: UserRole,
): Promise<QuestionResult> => {
  assertQuestionManager(role);

  await assertQuestionPermission(questionId, userId, role);

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: questionSelect,
  });

  if (!question) {
    throw AppError.notFound("Question not found");
  }

  return question;
};

// ======================================================
// CREATE QUESTION
// ======================================================

export const createQuestion = async (
  data: CreateQuestionDto,
  userId: string,
  role: UserRole,
): Promise<QuestionResult> => {
  assertQuestionManager(role);

  validateOptions(data.type, data.options);

  return prisma.question.create({
    data: {
      content: data.content,
      type: data.type,
      explanation: data.explanation,
      createdBy: userId,

      options: {
        create: data.options.map((option) => ({
          content: option.content,
          isCorrect: option.isCorrect,
          position: option.position,
        })),
      },
    },
    select: questionSelect,
  });
};

// ======================================================
// UPDATE QUESTION
// ======================================================

export const updateQuestion = async (
  questionId: string,
  data: UpdateQuestionDto,
  userId: string,
  role: UserRole,
): Promise<QuestionResult> => {
  assertQuestionManager(role);

  await assertQuestionPermission(questionId, userId, role);

  await assertQuestionNotUsedInExam(questionId);

  const currentQuestion = await prisma.question.findUnique({
    where: { id: questionId },
    select: {
      type: true,
      options: {
        select: {
          isCorrect: true,
          position: true,
        },
      },
    },
  });

  if (!currentQuestion) {
    throw AppError.notFound("Question not found");
  }

  const nextType = data.type ?? currentQuestion.type;
  const nextOptions = data.options ?? currentQuestion.options;

  validateOptions(nextType, nextOptions);

  return prisma.$transaction(async (tx) => {
    if (data.options !== undefined) {
      await tx.questionOption.deleteMany({
        where: { questionId },
      });
    }

    return tx.question.update({
      where: { id: questionId },
      data: {
        ...(data.content !== undefined && {
          content: data.content,
        }),

        ...(data.type !== undefined && {
          type: data.type,
        }),

        ...(data.explanation !== undefined && {
          explanation: data.explanation,
        }),

        ...(data.options !== undefined && {
          options: {
            create: data.options.map((option) => ({
              content: option.content,
              isCorrect: option.isCorrect,
              position: option.position,
            })),
          },
        }),
      },
      select: questionSelect,
    });
  });
};

// ======================================================
// DELETE QUESTION
// ======================================================

export const deleteQuestion = async (
  questionId: string,
  userId: string,
  role: UserRole,
): Promise<void> => {
  assertQuestionManager(role);

  await assertQuestionPermission(questionId, userId, role);

  await assertQuestionNotUsedInExam(questionId);

  await prisma.question.delete({
    where: { id: questionId },
  });
};
