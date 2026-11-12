import { Prisma } from "../generated/prisma/client";

import { AppError } from "./error";

interface PrismaErrorOptions {
  uniqueFieldMessages?: Record<string, string>;
  uniqueConflictMessage?: string;
  foreignKeyMessage?: string;
  notFoundMessage?: string;
}

export const handlePrismaError = (
  error: unknown,
  options: PrismaErrorOptions = {},
): never => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw error;
  }

  switch (error.code) {
    // Unique constraint violation
    case "P2002": {
      const target = error.meta?.target;

      const targetFields = Array.isArray(target)
        ? target.map(String)
        : typeof target === "string"
          ? [target]
          : [];

      const fieldMessages = options.uniqueFieldMessages ?? {};

      for (const [field, message] of Object.entries(fieldMessages)) {
        const isMatchingField = targetFields.some((targetField) => {
          const normalizedTarget = targetField.toLowerCase();
          const normalizedField = field.toLowerCase();

          return (
            normalizedTarget === normalizedField ||
            normalizedTarget.endsWith(`_${normalizedField}_key`) ||
            normalizedTarget.endsWith(`_${normalizedField}`)
          );
        });

        if (isMatchingField) {
          throw AppError.conflict(message);
        }
      }

      throw AppError.conflict(
        options.uniqueConflictMessage ?? "Dữ liệu đã tồn tại.",
      );
    }

    // Foreign key constraint violation
    case "P2003":
      throw AppError.badRequest(
        options.foreignKeyMessage ??
          "Không thể thực hiện thao tác do dữ liệu liên quan không hợp lệ.",
      );

    // Record not found
    case "P2025":
      throw AppError.notFound(
        options.notFoundMessage ?? "Không tìm thấy dữ liệu.",
      );

    default:
      throw error;
  }
};
