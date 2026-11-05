import { z } from "zod";

import { UserRole } from "../../../generated/prisma/enums";
import { normalizedEmailSchema, stringSchema } from "../../../utils/zod";

export const signUpSchema = z
  .object({
    email: normalizedEmailSchema,

    name: stringSchema("Name", 1, 100),

    role: z.enum(UserRole),
  })
  .strict();

export type SignUpDto = z.infer<typeof signUpSchema>;
