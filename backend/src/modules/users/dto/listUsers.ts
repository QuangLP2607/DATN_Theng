import { z } from "zod";

import { UserRole, UserStatus } from "../../../generated/prisma/enums";

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().max(100).optional(),

  role: z.enum(UserRole).optional(),

  status: z.enum(UserStatus).optional(),

  sortBy: z
    .enum(["name", "email", "role", "status", "createdAt", "updatedAt"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListUsersQueryDto = z.infer<typeof listUsersQuerySchema>;
