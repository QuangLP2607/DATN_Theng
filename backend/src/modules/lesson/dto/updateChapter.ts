import { z } from "zod";
import { nonEmptyObject, stringSchema } from "../../../utils/zod";

export const updateChapterSchema = nonEmptyObject(
  z.object({
    title: stringSchema("Chapter title", 1, 255).optional(),
    description: z.string().trim().nullable().optional(),
    position: z.number().int().min(0).optional(),
  }),
);

export type UpdateChapterDto = z.infer<typeof updateChapterSchema>;
