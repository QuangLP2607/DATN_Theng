import { z } from "zod";

export const enrollStudentSchema = z.object({
  studentId: z.uuid("Invalid student ID"),
});

export type EnrollStudentDto = z.infer<typeof enrollStudentSchema>;
