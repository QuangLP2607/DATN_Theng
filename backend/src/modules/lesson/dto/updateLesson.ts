import { z } from "zod";
import { LessonType } from "../../../generated/prisma/enums";
import { nonEmptyObject, stringSchema } from "../../../utils/zod";

export const updateLessonSchema = nonEmptyObject(
  z.object({
    title: stringSchema("Lesson title", 1, 255).optional(),
    type: z.enum(LessonType).optional(),
    content: z.string().nullable().optional(),
    fileUrl: z.string().trim().max(500).nullable().optional(),
    duration: z.number().int().positive().nullable().optional(),
    position: z.number().int().min(0).optional(),
  }),
);

export type UpdateLessonDto = z.infer<typeof updateLessonSchema>;
