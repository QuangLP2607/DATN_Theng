import { z } from "zod";
import { QuestionType } from "../../../generated/prisma/enums";
import { paginationQuerySchema } from "../../../utils/zod";

export const listQuestionsQuerySchema = paginationQuerySchema.extend({
  type: z.enum(QuestionType).optional(),

  sortBy: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
});

export type ListQuestionsQueryDto = z.infer<typeof listQuestionsQuerySchema>;
