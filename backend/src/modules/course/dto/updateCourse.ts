import { z } from "zod";

import { nonEmptyObject, stringSchema } from "../../../utils/zod";

export const updateCourseSchema = nonEmptyObject(
  z
    .object({
      subjectGradeId: z.uuid().optional(),

      title: stringSchema("Title", 1, 255).optional(),

      code: stringSchema("Code", 1, 50)
        .transform((value) => value.toUpperCase())
        .optional(),

      description: z.string().trim().nullable().optional(),

      thumbnailKey: stringSchema("Thumbnail key", 1, 500).nullable().optional(),

      targetYear: z.number().int().min(1900).max(2100).nullable().optional(),
    })
    .strict(),
);

export type UpdateCourseDto = z.infer<typeof updateCourseSchema>;
