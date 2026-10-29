import { z } from "zod";

export const activateAccountSchema = z.object({
  token: z.string().min(1, "Activation token is required"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ActivateAccountDto = z.infer<typeof activateAccountSchema>;
