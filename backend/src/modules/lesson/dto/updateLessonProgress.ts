import { z } from "zod";

export const updateLessonProgressSchema = z.object({
  progress: z.number().int().min(0).max(100),
});

export type UpdateLessonProgressDto = z.infer<
  typeof updateLessonProgressSchema
>;
