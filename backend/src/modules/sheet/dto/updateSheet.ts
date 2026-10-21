import { z } from "zod";

export const updateSheetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Sheet name is required")
    .max(255, "Sheet name is too long"),
});

export type UpdateSheetDto = z.infer<typeof updateSheetSchema>;
