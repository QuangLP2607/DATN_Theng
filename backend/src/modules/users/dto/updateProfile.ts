import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name is too long")
      .optional(),

    avatar: z
      .string()
      .trim()
      .max(255, "Avatar URL is too long")
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
