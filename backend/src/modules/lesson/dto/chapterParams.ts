import { z } from "zod";

export const chapterParamsSchema = z.object({
  id: z.uuid("Invalid chapter ID"),
});

export const subjectParamsSchema = z.object({
  subjectId: z.uuid("Invalid subject ID"),
});

export type ChapterParamsDto = z.infer<typeof chapterParamsSchema>;
export type subjectParamsDto = z.infer<typeof subjectParamsSchema>;
