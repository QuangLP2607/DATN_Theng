import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .email("Invalid email")
      .transform((value) => value.trim().toLowerCase()),

    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name is too long"),

    role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
  })
  .strict();

export type SignUpDto = z.infer<typeof signUpSchema>;
