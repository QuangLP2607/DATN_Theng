import { z } from "zod";

export const lessonIdParamsSchema = z.object({
  lessonId: z.string().uuid("Lesson ID không hợp lệ."),
});

export const attachmentIdParamsSchema = z.object({
  id: z.string().uuid("Attachment ID không hợp lệ."),
});

export type LessonIdParams = z.infer<typeof lessonIdParamsSchema>;
export type AttachmentIdParams = z.infer<typeof attachmentIdParamsSchema>;
