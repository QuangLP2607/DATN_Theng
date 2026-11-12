import { z } from "zod";

export const assignTeacherSchema = z.object({
  teacherId: z.string().uuid(),
});

export type AssignTeacherDto = z.infer<typeof assignTeacherSchema>;
