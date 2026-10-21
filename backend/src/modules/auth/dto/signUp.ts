import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .email("Invalid email")
    .transform((value) => value.trim().toLowerCase()),

  password: z.string().min(6, "Password must be at least 6 characters"),

  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),

  role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
});

export type SignUpDto = z.infer<typeof signUpSchema>;
