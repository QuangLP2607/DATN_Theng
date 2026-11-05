import { z } from "zod";

export const lessonParamsSchema = z.object({
  id: z.uuid("Invalid lesson ID"),
});

export type LessonParamsDto = z.infer<typeof lessonParamsSchema>;
