import { z } from "zod";

import { ContentStatus } from "../../../generated/prisma/enums";

export const listLessonsQuerySchema = z.object({
  status: z.enum(ContentStatus).optional(),
});

export type ListLessonsQueryDto = z.infer<typeof listLessonsQuerySchema>;
