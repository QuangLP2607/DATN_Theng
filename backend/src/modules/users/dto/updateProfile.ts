import { z } from "zod";

import { nonEmptyObject, stringSchema } from "../../../utils/zod";

export const updateProfileSchema = nonEmptyObject(
  z.object({
    name: stringSchema("Name", 1, 100).optional(),

    avatarKey: z
      .string()
      .trim()
      .max(500, "Avatar key is too long")
      .nullable()
      .optional(),
  }),
);

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
