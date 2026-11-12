import { z } from "zod";

export const chapterIdParamsSchema = z.object({
  chapterId: z.string().uuid("Chapter ID không hợp lệ."),
});

export const lessonIdParamsSchema = z.object({
  id: z.string().uuid("Lesson ID không hợp lệ."),
});

export type ChapterIdParams = z.infer<typeof chapterIdParamsSchema>;
export type LessonIdParams = z.infer<typeof lessonIdParamsSchema>;
