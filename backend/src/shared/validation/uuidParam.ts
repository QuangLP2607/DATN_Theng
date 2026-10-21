import { z } from "zod";

export const uuidParamSchema = z.object({
  id: z.uuid("Invalid UUID"),
});

export type UuidParam = z.infer<typeof uuidParamSchema>;
