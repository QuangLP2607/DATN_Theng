import { z } from "zod";

import { stringSchema } from "../../../utils/zod";

export const createSubjectSchema = z.object({
  code: stringSchema("Code", 1, 20),
  title: stringSchema("Title", 1, 100),
  description: stringSchema("Description", 0, 255).optional(),
  icon: stringSchema("Icon", 1, 100).optional(),
});

export type CreateSubjectDto = z.infer<typeof createSubjectSchema>;
