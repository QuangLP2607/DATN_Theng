import { z } from "zod";

export const createLinkAttachmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Tên tài liệu không được để trống.")
    .max(255, "Tên tài liệu không được vượt quá 255 ký tự."),

  externalUrl: z
    .string()
    .trim()
    .url("Đường dẫn không hợp lệ.")
    .max(1000, "Đường dẫn không được vượt quá 1000 ký tự.")
    .refine((value) => {
      const url = new URL(value);

      return ["http:", "https:"].includes(url.protocol);
    }, "Chỉ chấp nhận đường dẫn HTTP hoặc HTTPS."),
});

export type CreateLinkAttachmentDto = z.infer<
  typeof createLinkAttachmentSchema
>;
