import { z, ZodRawShape, ZodObject } from "zod";

// --------------------- UUID ---------------------

export const uuidSchema = z.uuid("Invalid UUID");

export const uuidParamSchema = (field = "id") =>
  z.object({
    [field]: uuidSchema,
  });

// --------------------- Email ---------------------

export const emailSchema = z.email({
  error: "Invalid email",
});

export const normalizedEmailSchema = emailSchema.transform((value) =>
  value.trim().toLowerCase(),
);

// --------------------- Password ---------------------

export const passwordSchema = z.string().min(6, {
  message: "Password too short",
});

// --------------------- Username ---------------------

export const usernameSchema = (min = 3, max = 50) =>
  z
    .string()
    .trim()
    .min(min, {
      message: "Username too short",
    })
    .max(max);

// --------------------- Phone ---------------------

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(?:0(?:3|5|7|8|9)\d{8}|\+[1-9]\d{1,14})$/, {
    message: "Invalid phone number",
  });

// --------------------- String ---------------------

export const stringSchema = (fieldName = "This field", min = 1, max = 255) =>
  z
    .string()
    .trim()
    .min(min, {
      message: `${fieldName} must be at least ${min} characters`,
    })
    .max(max, {
      message: `${fieldName} must be at most ${max} characters`,
    });

// --------------------- Pagination ---------------------

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  sortBy: z.string().trim().min(1).default("createdAt"),

  order: z.enum(["asc", "desc"]).default("desc"),

  search: z
    .string()
    .trim()
    .max(255, {
      message: "Search query too long",
    })
    .optional(),
});

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --------------------- ISO Date ---------------------

export const isoDateSchema = z.preprocess(
  (arg) => {
    if (typeof arg === "string") {
      const isoRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!isoRegex.test(arg)) return arg;

      return new Date(arg);
    }

    return arg;
  },
  z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date format",
  }),
);

// --------------------- MIME Type ---------------------

export const mimeTypeSchema = z.string().refine(
  (value) => {
    if (!value) return false;

    const [type] = value.split("/");

    const allowedTopLevel = ["video", "image", "application", "audio", "text"];

    return allowedTopLevel.includes(type);
  },
  {
    message: "Invalid MIME type",
  },
);

// --------------------- File Size ---------------------

export const fileSizeSchema = (maxSize = 100 * 1024 * 1024) =>
  z.number().max(maxSize, {
    message: `File size must be <= ${maxSize / (1024 * 1024)}MB`,
  });

// --------------------- Non-empty Object ---------------------

export const nonEmptyObject = <T extends ZodRawShape>(schema: ZodObject<T>) =>
  schema.refine(
    (data) =>
      Object.keys(data).some(
        (key) => data[key as keyof typeof data] !== undefined,
      ),
    {
      message: "At least one field must be provided",
    },
  );
