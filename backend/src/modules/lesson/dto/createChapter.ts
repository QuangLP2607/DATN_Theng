import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const createChapterSchema = z.object({
  title: stringSchema("Chapter title", 1, 255),
  description: z.string().trim().nullable().optional(),
  position: z.number().int().min(0),
});

export type CreateChapterDto = z.infer<typeof createChapterSchema>;
