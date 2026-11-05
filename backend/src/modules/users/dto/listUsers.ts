import { z } from "zod";

import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { paginationQuerySchema } from "../../../utils/zod";

export const listUsersQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(100).optional(),

  role: z.enum(UserRole).optional(),

  status: z.enum(UserStatus).optional(),

  sortBy: z
    .enum(["name", "email", "role", "status", "createdAt", "updatedAt"])
    .default("createdAt"),
});

export type ListUsersQueryDto = z.infer<typeof listUsersQuerySchema>;
