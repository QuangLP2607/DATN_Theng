import { z } from "zod";

const examQuestionItemSchema = z.object({
  questionId: z.uuid(),

  points: z.number().positive().max(1000),

  position: z.number().int().min(0),
});

export const addExamQuestionsSchema = z
  .object({
    questions: z.array(examQuestionItemSchema).min(1).max(200),
  })
  .superRefine(({ questions }, ctx) => {
    const questionIds = questions.map((question) => question.questionId);

    const positions = questions.map((question) => question.position);

    if (new Set(questionIds).size !== questionIds.length) {
      ctx.addIssue({
        code: "custom",
        message: "Question IDs must be unique",
        path: ["questions"],
      });
    }

    if (new Set(positions).size !== positions.length) {
      ctx.addIssue({
        code: "custom",
        message: "Question positions must be unique",
        path: ["questions"],
      });
    }
  });

export type AddExamQuestionsDto = z.infer<typeof addExamQuestionsSchema>;
