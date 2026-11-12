import { z } from "zod";

import { ContentStatus, LessonType } from "../../../generated/prisma/enums";

export const updateLessonSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Tên bài học không được để trống.")
      .max(255, "Tên bài học không được vượt quá 255 ký tự.")
      .optional(),

    type: z.enum(LessonType).optional(),

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
      .min(1, "Vị trí phải lớn hơn hoặc bằng 1.")
      .optional(),

    status: z.enum(ContentStatus).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Vui lòng cung cấp ít nhất một trường cần cập nhật.",
  });

export type UpdateLessonDto = z.infer<typeof updateLessonSchema>;
