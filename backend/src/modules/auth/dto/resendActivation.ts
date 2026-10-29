import { z } from "zod";

export const resendActivationSchema = z.object({
  email: z
    .email("Invalid email")
    .transform((value) => value.trim().toLowerCase()),
});

export type ResendActivationDto = z.infer<typeof resendActivationSchema>;
