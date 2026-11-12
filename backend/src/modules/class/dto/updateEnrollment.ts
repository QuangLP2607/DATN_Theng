import { z } from "zod";

export const updateEnrollmentSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type UpdateEnrollmentDto = z.infer<typeof updateEnrollmentSchema>;
