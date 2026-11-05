import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const createAssignmentSchema = z.object({
  classId: z.uuid(),

  title: stringSchema("Assignment title", 1, 255),

  description: stringSchema("Description", 1, 5000).nullable().optional(),

  dueAt: z.coerce.date().nullable().optional(),

  maxScore: z.number().positive().max(999.99).default(10),
});

export type CreateAssignmentDto = z.infer<typeof createAssignmentSchema>;
