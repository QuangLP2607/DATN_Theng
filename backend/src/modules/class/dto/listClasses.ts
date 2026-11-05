import { z } from "zod";
import { ClassStatus } from "../../../generated/prisma/enums";
import { paginationQuerySchema } from "../../../utils/zod";

export const listClassesQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(100).optional(),
  subjectId: z.uuid().optional(),
  status: z.enum(ClassStatus).optional(),
  sortBy: z
    .enum(["name", "code", "createdAt", "updatedAt"])
    .default("createdAt"),
});

export type ListClassesQueryDto = z.infer<typeof listClassesQuerySchema>;
