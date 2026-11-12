import { z } from "zod";

export const createClassSchema = z
  .object({
    courseId: z.string().uuid(),

    name: z.string().trim().min(1).max(255),
    code: z.string().trim().min(1).max(50),

    maxStudents: z.coerce.number().int().positive().nullable().optional(),

    startAt: z.coerce.date().nullable().optional(),
    endAt: z.coerce.date().nullable().optional(),
  })
  .refine(
    (data) => !data.startAt || !data.endAt || data.startAt <= data.endAt,
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu.",
      path: ["endAt"],
    },
  );

export type CreateClassDto = z.infer<typeof createClassSchema>;
