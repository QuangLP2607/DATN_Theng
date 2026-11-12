import { z } from "zod";

export const createChapterSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Tên chương không được để trống.")
    .max(255, "Tên chương không được vượt quá 255 ký tự."),

  description: z
    .string()
    .trim()
    .max(5000, "Mô tả không được vượt quá 5000 ký tự.")
    .nullable()
    .optional(),

  position: z.coerce.number().int().min(1, "Vị trí phải lớn hơn hoặc bằng 1."),
});

export type CreateChapterDto = z.infer<typeof createChapterSchema>;
