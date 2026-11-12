import { z } from "zod";

import { stringSchema } from "../../../utils/zod";

export const createSubjectSchema = z
  .object({
    code: stringSchema("Code", 1, 20).transform((value) => value.toUpperCase()),

    title: stringSchema("Title", 1, 100),

    description: stringSchema("Description", 0, 255).nullable().optional(),

    icon: stringSchema("Icon", 1, 100).optional(),
  })
  .strict();

export type CreateSubjectDto = z.infer<typeof createSubjectSchema>;
