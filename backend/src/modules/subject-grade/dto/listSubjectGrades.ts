import { z } from "zod";

export const listSubjectGradesQuerySchema = z
  .object({
    subjectId: z.uuid(),
  })
  .strict();

export type ListSubjectGradesQueryDto = z.infer<
  typeof listSubjectGradesQuerySchema
>;
