import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const createExamSchema = z.object({
  classId: z.uuid(),

  title: stringSchema("Exam title", 1, 255),

  description: stringSchema("Description", 1, 5000).nullable().optional(),

  durationMinutes: z.number().int().min(1).max(1440),

  scheduledAt: z.coerce.date().nullable().optional(),

  maxAttempts: z.number().int().min(1).max(100).default(1),
});

export type CreateExamDto = z.infer<typeof createExamSchema>;
