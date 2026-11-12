import { z } from "zod";

export const courseIdParamsSchema = z.object({
  courseId: z.uuid(),
});

export const chapterIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CourseIdParamsDto = z.infer<typeof courseIdParamsSchema>;

export type ChapterIdParamsDto = z.infer<typeof chapterIdParamsSchema>;
