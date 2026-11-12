import { z } from "zod";

export const enrollStudentSchema = z.object({
  studentId: z.string().uuid(),
});

export type EnrollStudentDto = z.infer<typeof enrollStudentSchema>;
