import { z } from "zod";

import { normalizedEmailSchema } from "../../../utils/zod";

export const signInSchema = z.object({
  email: normalizedEmailSchema,

  password: z.string().min(1, "Password is required"),
});

export type SignInDto = z.infer<typeof signInSchema>;
