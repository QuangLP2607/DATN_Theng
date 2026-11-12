import { z } from "zod";

export const listChaptersQuerySchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export type ListChaptersQueryDto = z.infer<typeof listChaptersQuerySchema>;
