import { z } from "zod";

export const assignTeacherSchema = z.object({
  teacherId: z.uuid("Invalid teacher ID"),
});

export type AssignTeacherDto = z.infer<typeof assignTeacherSchema>;
