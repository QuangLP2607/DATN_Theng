import { z } from "zod";

export const updateWorkbookSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workbook name is required")
    .max(255, "Workbook name is too long"),
});

export type UpdateWorkbookDto = z.infer<typeof updateWorkbookSchema>;
