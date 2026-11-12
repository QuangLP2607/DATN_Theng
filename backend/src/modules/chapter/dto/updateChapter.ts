import { z } from "zod";

export const updateChapterSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Tên chương không được để trống.")
      .max(255, "Tên chương không được vượt quá 255 ký tự.")
      .optional(),

    description: z
      .string()
      .trim()
      .max(5000, "Mô tả không được vượt quá 5000 ký tự.")
      .nullable()
      .optional(),

    position: z.coerce
      .number()
      .int()
      .min(1, "Vị trí phải lớn hơn hoặc bằng 1.")
      .optional(),

    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Vui lòng cung cấp ít nhất một trường cần cập nhật.",
  });

export type UpdateChapterDto = z.infer<typeof updateChapterSchema>;
