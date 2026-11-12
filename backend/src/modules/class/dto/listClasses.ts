import { z } from "zod";

export const listClassesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),
  courseId: z.string().uuid().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),

  sortBy: z.enum(["name", "code", "startAt", "createdAt"]).default("createdAt"),

  order: z.enum(["asc", "desc"]).default("desc"),
});

export type ListClassesQueryDto = z.infer<typeof listClassesQuerySchema>;
