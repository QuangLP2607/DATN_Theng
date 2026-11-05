import { z } from "zod";

import { nonEmptyObject, stringSchema } from "../../../utils/zod";

export const updateProfileSchema = nonEmptyObject(
  z.object({
    name: stringSchema("Name", 1, 100).optional(),

    avatar: z
      .string()
      .trim()
      .max(255, "Avatar URL is too long")
      .nullable()
      .optional(),
  }),
);

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
