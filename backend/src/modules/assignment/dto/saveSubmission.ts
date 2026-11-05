import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const saveSubmissionSchema = z
  .object({
    content: stringSchema("Submission content", 1, 20000).nullable().optional(),

    fileUrl: stringSchema("File URL", 1, 500).nullable().optional(),
  })
  .refine(
    (data) =>
      (data.content !== undefined && data.content !== null) ||
      (data.fileUrl !== undefined && data.fileUrl !== null),
    {
      message: "Submission content or file URL is required",
    },
  );

export type SaveSubmissionDto = z.infer<typeof saveSubmissionSchema>;
