import { z } from "zod";

import { CourseStatus } from "../../../generated/prisma/enums";
import { paginationQuerySchema } from "../../../utils/zod";

export const listCoursesQuerySchema = paginationQuerySchema.extend({
  subjectGradeId: z.uuid().optional(),

  status: z.enum(CourseStatus).optional(),

  targetYear: z.coerce.number().int().min(1900).max(2100).optional(),

  sortBy: z
    .enum(["title", "code", "targetYear", "createdAt", "updatedAt"])
    .default("createdAt"),
});

export type ListCoursesQueryDto = z.infer<typeof listCoursesQuerySchema>;
