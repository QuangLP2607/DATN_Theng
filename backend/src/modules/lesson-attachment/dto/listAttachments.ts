import { z } from "zod";

import { LessonAttachmentType } from "../../../generated/prisma/enums";

export const listAttachmentsQuerySchema = z.object({
  type: z.enum(LessonAttachmentType).optional(),
});

export type ListAttachmentsQueryDto = z.infer<
  typeof listAttachmentsQuerySchema
>;
