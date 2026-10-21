import { z } from "zod";

export const createSheetSchema = z.object({
  workbookId: z.string().uuid(),

  name: z
    .string()
    .trim()
    .min(1, "Sheet name is required")
    .max(255, "Sheet name is too long"),
});

export type CreateSheetDto = z.infer<typeof createSheetSchema>;
