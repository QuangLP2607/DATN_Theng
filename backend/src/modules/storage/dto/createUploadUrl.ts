import { z } from "zod";

import { UploadPurpose } from "../types";
import { stringSchema } from "../../../utils/zod";

export const createUploadUrlSchema = z.object({
  purpose: z.nativeEnum(UploadPurpose),

  fileName: stringSchema("File name", 1, 255),

  mimeType: stringSchema("MIME type", 1, 150),

  fileSize: z
    .number()
    .int("File size must be an integer")
    .positive("File size must be greater than 0"),

  resourceId: z.string().uuid("Invalid resource ID").optional(),
});

export type CreateUploadUrlDto = z.infer<typeof createUploadUrlSchema>;
