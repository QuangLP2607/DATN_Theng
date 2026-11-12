import { z } from "zod";

import { normalizedEmailSchema } from "../../../utils/zod";

export const resendActivationSchema = z
  .object({
    email: normalizedEmailSchema,
  })
  .strict();

export type ResendActivationDto = z.infer<typeof resendActivationSchema>;
