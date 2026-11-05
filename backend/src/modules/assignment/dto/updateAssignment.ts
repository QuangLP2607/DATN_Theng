import { z } from "zod";
import { nonEmptyObject, stringSchema } from "../../../utils/zod";

export const updateAssignmentSchema = nonEmptyObject(
  z.object({
    title: stringSchema("Assignment title", 1, 255).optional(),

    description: stringSchema("Description", 1, 5000).nullable().optional(),

    dueAt: z.coerce.date().nullable().optional(),

    maxScore: z.number().positive().max(999.99).optional(),
  }),
);

export type UpdateAssignmentDto = z.infer<typeof updateAssignmentSchema>;
