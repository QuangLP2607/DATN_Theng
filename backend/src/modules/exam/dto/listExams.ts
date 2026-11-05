import { z } from "zod";
import { ExamStatus } from "../../../generated/prisma/enums";
import { paginationQuerySchema } from "../../../utils/zod";

export const listExamsQuerySchema = paginationQuerySchema.extend({
  classId: z.uuid().optional(),

  status: z.enum(ExamStatus).optional(),

  sortBy: z
    .enum(["createdAt", "updatedAt", "scheduledAt", "title"])
    .default("createdAt"),
});

export type ListExamsQueryDto = z.infer<typeof listExamsQuerySchema>;
