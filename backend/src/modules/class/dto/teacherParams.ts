import { z } from "zod";

export const teacherParamsSchema = z.object({
  id: z.uuid("Invalid class ID"),
  teacherId: z.uuid("Invalid teacher ID"),
});

export type TeacherParamsDto = z.infer<typeof teacherParamsSchema>;
