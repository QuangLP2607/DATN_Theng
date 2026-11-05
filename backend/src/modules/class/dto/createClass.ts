import { z } from "zod";
import { ClassStatus } from "../../../generated/prisma/enums";
import { stringSchema } from "../../../utils/zod";

export const createClassSchema = z.object({
  subjectId: z.uuid("Invalid subject ID"),
  name: stringSchema("Class name", 1, 100),
  code: stringSchema("Class code", 1, 50),
  status: z.enum(ClassStatus).optional(),
});

export type CreateClassDto = z.infer<typeof createClassSchema>;
