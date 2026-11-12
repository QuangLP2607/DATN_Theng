import { z } from "zod";

export const updateClassSchema = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    code: z.string().trim().min(1).max(50).optional(),

    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),

    maxStudents: z.coerce.number().int().positive().nullable().optional(),

    startAt: z.coerce.date().nullable().optional(),
    endAt: z.coerce.date().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Vui lòng cung cấp ít nhất một trường cần cập nhật.",
  })
  .refine(
    (data) => !data.startAt || !data.endAt || data.startAt <= data.endAt,
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu.",
      path: ["endAt"],
    },
  );

export type UpdateClassDto = z.infer<typeof updateClassSchema>;
