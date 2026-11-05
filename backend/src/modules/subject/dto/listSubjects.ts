import { z } from "zod";

import { paginationQuerySchema } from "../../../utils/zod";

export const listSubjectsQuerySchema = paginationQuerySchema.extend({
  sortBy: z.enum(["title", "createdAt", "updatedAt"]).default("createdAt"),
});

export type ListSubjectsQueryDto = z.infer<typeof listSubjectsQuerySchema>;
