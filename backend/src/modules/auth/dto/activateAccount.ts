import { z } from "zod";

import { passwordSchema } from "../../../utils/zod";

export const activateAccountSchema = z.object({
  token: z.string().trim().min(1, "Activation token is required"),

  password: passwordSchema,
});

export type ActivateAccountDto = z.infer<typeof activateAccountSchema>;
