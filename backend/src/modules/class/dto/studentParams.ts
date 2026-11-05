import { z } from "zod";

export const studentParamsSchema = z.object({
  id: z.uuid("Invalid class ID"),
  studentId: z.uuid("Invalid student ID"),
});

export type StudentParamsDto = z.infer<typeof studentParamsSchema>;
