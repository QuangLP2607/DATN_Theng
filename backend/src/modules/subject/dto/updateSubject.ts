import { z } from "zod";

import { nonEmptyObject, stringSchema } from "../../../utils/zod";

export const updateSubjectSchema = nonEmptyObject(
  z.object({
    code: stringSchema("Code", 1, 20).optional(),
    title: stringSchema("Title", 1, 100).optional(),
    description: stringSchema("Description", 0, 255).optional(),
    icon: stringSchema("Icon", 1, 100).optional(),
  }),
);

export type UpdateSubjectDto = z.infer<typeof updateSubjectSchema>;
