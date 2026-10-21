import { z } from "zod";

export const createWorkbookSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workbook name is required")
    .max(255, "Workbook name is too long"),
});

export type CreateWorkbookDto = z.infer<typeof createWorkbookSchema>;
