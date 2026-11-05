import { z } from "zod";
import { normalizedEmailSchema } from "../../../utils/zod";

export const resendActivationSchema = z.object({
  email: normalizedEmailSchema,
});

export type ResendActivationDto = z.infer<typeof resendActivationSchema>;
