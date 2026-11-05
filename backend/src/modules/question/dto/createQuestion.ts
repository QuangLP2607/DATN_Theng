import { z } from "zod";
import { QuestionType } from "../../../generated/prisma/enums";
import { stringSchema } from "../../../utils/zod";

const questionOptionSchema = z.object({
  content: stringSchema("Option content", 1, 2000),
  isCorrect: z.boolean().default(false),
  position: z.number().int().min(0),
});

export const createQuestionSchema = z
  .object({
    content: stringSchema("Question content", 1, 10000),

    type: z.enum(QuestionType),

    explanation: stringSchema("Explanation", 1, 5000).nullable().optional(),

    options: z.array(questionOptionSchema).default([]),
  })
  .superRefine((data, ctx) => {
    const { type, options } = data;

    if (type === QuestionType.ESSAY) {
      if (options.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Essay questions cannot have options",
          path: ["options"],
        });
      }
      return;
    }

    if (options.length < 2) {
      ctx.addIssue({
        code: "custom",
        message: "At least two options are required",
        path: ["options"],
      });
    }

    const correctCount = options.filter((option) => option.isCorrect).length;

    if (correctCount === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one correct option is required",
        path: ["options"],
      });
    }

    if (
      type === QuestionType.SINGLE_CHOICE ||
      type === QuestionType.TRUE_FALSE
    ) {
      if (correctCount !== 1) {
        ctx.addIssue({
          code: "custom",
          message: "Exactly one correct option is required",
          path: ["options"],
        });
      }
    }

    if (type === QuestionType.TRUE_FALSE && options.length !== 2) {
      ctx.addIssue({
        code: "custom",
        message: "True/False questions must have exactly two options",
        path: ["options"],
      });
    }

    const positions = options.map((option) => option.position);

    if (new Set(positions).size !== positions.length) {
      ctx.addIssue({
        code: "custom",
        message: "Option positions must be unique",
        path: ["options"],
      });
    }
  });

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>;
