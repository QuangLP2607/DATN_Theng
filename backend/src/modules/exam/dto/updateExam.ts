import { z } from "zod";
import { nonEmptyObject, stringSchema } from "../../../utils/zod";

export const updateExamSchema = nonEmptyObject(
  z.object({
    title: stringSchema("Exam title", 1, 255).optional(),

    description: stringSchema("Description", 1, 5000).nullable().optional(),

    durationMinutes: z.number().int().min(1).max(1440).optional(),

    scheduledAt: z.coerce.date().nullable().optional(),

    maxAttempts: z.number().int().min(1).max(100).optional(),
  }),
);

export type UpdateExamDto = z.infer<typeof updateExamSchema>;
