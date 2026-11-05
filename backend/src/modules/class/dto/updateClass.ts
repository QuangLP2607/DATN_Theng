import { z } from "zod";
import { ClassStatus } from "../../../generated/prisma/enums";
import { nonEmptyObject, stringSchema } from "../../../utils/zod";

export const updateClassSchema = nonEmptyObject(
  z.object({
    subjectId: z.uuid("Invalid subject ID").optional(),
    name: stringSchema("Class name", 1, 100).optional(),
    code: stringSchema("Class code", 1, 50).optional(),
    status: z.enum(ClassStatus).optional(),
  }),
);

export type UpdateClassDto = z.infer<typeof updateClassSchema>;
