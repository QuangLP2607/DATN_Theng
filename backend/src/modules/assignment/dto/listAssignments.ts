import { z } from "zod";
import { AssignmentStatus } from "../../../generated/prisma/enums";
import { paginationQuerySchema } from "../../../utils/zod";

export const listAssignmentsQuerySchema = paginationQuerySchema.extend({
  classId: z.uuid().optional(),

  status: z.enum(AssignmentStatus).optional(),

  sortBy: z
    .enum(["createdAt", "updatedAt", "dueAt", "title"])
    .default("createdAt"),
});

export type ListAssignmentsQueryDto = z.infer<
  typeof listAssignmentsQuerySchema
>;
