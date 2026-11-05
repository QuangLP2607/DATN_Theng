import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const gradeSubmissionSchema = z.object({
  score: z.number().min(0).max(999.99),

  feedback: stringSchema("Feedback", 1, 5000).nullable().optional(),
});

export type GradeSubmissionDto = z.infer<typeof gradeSubmissionSchema>;
