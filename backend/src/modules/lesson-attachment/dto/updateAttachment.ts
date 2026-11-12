import { z } from "zod";

const httpUrlSchema = z
  .string()
  .trim()
  .url("Đường dẫn không hợp lệ.")
  .max(1000, "Đường dẫn không được vượt quá 1000 ký tự.")
  .refine((value) => {
    const url = new URL(value);

    return ["http:", "https:"].includes(url.protocol);
  }, "Chỉ chấp nhận đường dẫn HTTP hoặc HTTPS.");

export const updateAttachmentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Tên tài liệu không được để trống.")
      .max(255, "Tên tài liệu không được vượt quá 255 ký tự.")
      .optional(),

    position: z
      .number()
      .int("Vị trí phải là số nguyên.")
      .min(1, "Vị trí phải lớn hơn hoặc bằng 1.")
      .optional(),

    externalUrl: httpUrlSchema.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Vui lòng cung cấp ít nhất một thông tin cần cập nhật.",
  });

export type UpdateAttachmentDto = z.infer<typeof updateAttachmentSchema>;
