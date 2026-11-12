import { z } from "zod";

import { ContentStatus, LessonType } from "../../../generated/prisma/enums";

export const createLessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Tên bài học không được để trống.")
    .max(255, "Tên bài học không được vượt quá 255 ký tự."),

  type: z.enum(LessonType),

  content: z.string().nullable().optional(),

  duration: z
    .number()
    .int("Thời lượng phải là số nguyên.")
    .min(0, "Thời lượng không được âm.")
    .nullable()
    .optional(),

  position: z
    .number()
    .int("Vị trí phải là số nguyên.")
    .min(1, "Vị trí phải lớn hơn hoặc bằng 1."),

  status: z.enum(ContentStatus).optional(),
});

export type CreateLessonDto = z.infer<typeof createLessonSchema>;
