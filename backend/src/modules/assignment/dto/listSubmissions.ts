import { z } from "zod";
import { SubmissionStatus } from "../../../generated/prisma/enums";
import { paginationQuerySchema } from "../../../utils/zod";

export const listSubmissionsQuerySchema = paginationQuerySchema.extend({
  status: z.enum(SubmissionStatus).optional(),

  sortBy: z
    .enum(["createdAt", "submittedAt", "updatedAt"])
    .default("createdAt"),
});

export type ListSubmissionsQueryDto = z.infer<
  typeof listSubmissionsQuerySchema
>;
