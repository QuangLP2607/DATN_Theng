import { z } from "zod";
import { QuestionType } from "../../../generated/prisma/enums";
import { nonEmptyObject, stringSchema } from "../../../utils/zod";

const questionOptionSchema = z.object({
  content: stringSchema("Option content", 1, 2000),
  isCorrect: z.boolean().default(false),
  position: z.number().int().min(0),
});

export const updateQuestionSchema = nonEmptyObject(
  z
    .object({
      content: stringSchema("Question content", 1, 10000).optional(),

      type: z.enum(QuestionType).optional(),

      explanation: stringSchema("Explanation", 1, 5000).nullable().optional(),

      options: z.array(questionOptionSchema).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.options === undefined) return;

      const positions = data.options.map((option) => option.position);

      if (new Set(positions).size !== positions.length) {
        ctx.addIssue({
          code: "custom",
          message: "Option positions must be unique",
          path: ["options"],
        });
      }
    }),
);

export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>;
