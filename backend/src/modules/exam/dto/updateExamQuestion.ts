import { z } from "zod";
import { nonEmptyObject } from "../../../utils/zod";

export const updateExamQuestionSchema = nonEmptyObject(
  z.object({
    points: z.number().positive().max(1000).optional(),

    position: z.number().int().min(0).optional(),
  }),
);

export type UpdateExamQuestionDto = z.infer<typeof updateExamQuestionSchema>;
