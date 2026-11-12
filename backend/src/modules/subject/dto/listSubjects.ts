import { z } from "zod";

import { paginationQuerySchema } from "../../../utils/zod";

export const listSubjectsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(100).optional(),

  sortBy: z
    .enum(["code", "title", "createdAt", "updatedAt"])
    .default("createdAt"),
});

export type ListSubjectsQueryDto = z.infer<typeof listSubjectsQuerySchema>;
