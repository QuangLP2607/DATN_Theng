import { z } from "zod";
import { LessonType } from "../../../generated/prisma/enums";
import { stringSchema } from "../../../utils/zod";

export const createLessonSchema = z.object({
  title: stringSchema("Lesson title", 1, 255),
  type: z.enum(LessonType),
  content: z.string().nullable().optional(),
  fileUrl: z.string().trim().max(500).nullable().optional(),
  duration: z.number().int().positive().nullable().optional(),
  position: z.number().int().min(0),
});

export type CreateLessonDto = z.infer<typeof createLessonSchema>;
