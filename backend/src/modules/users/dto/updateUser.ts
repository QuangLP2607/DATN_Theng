import { z } from "zod";

import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { nonEmptyObject, stringSchema } from "../../../utils/zod";

export const updateUserSchema = nonEmptyObject(
  z.object({
    name: stringSchema("Name", 1, 100).optional(),

    avatar: z
      .string()
      .trim()
      .max(255, "Avatar URL is too long")
      .nullable()
      .optional(),

    role: z.enum(UserRole).optional(),

    status: z.enum(UserStatus).optional(),
  }),
);

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
