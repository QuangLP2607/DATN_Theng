import { z } from "zod";

import { stringSchema } from "../../../utils/zod";

export const createCourseSchema = z
  .object({
    subjectGradeId: z.uuid(),

    title: stringSchema("Title", 1, 255),

    code: stringSchema("Code", 1, 50).transform((value) => value.toUpperCase()),

    description: z.string().trim().nullable().optional(),

    thumbnailKey: stringSchema("Thumbnail key", 1, 500).nullable().optional(),

    targetYear: z.number().int().min(1900).max(2100).nullable().optional(),
  })
  .strict();

export type CreateCourseDto = z.infer<typeof createCourseSchema>;
