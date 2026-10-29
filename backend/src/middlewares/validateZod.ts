import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";

import { AppError } from "../core/error";

type ValidationTarget = "body" | "query" | "params";

type ValidationSchemas = Partial<Record<ValidationTarget, ZodType>>;

export type ValidatedData = Partial<Record<ValidationTarget, unknown>>;

export const validateZod = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated: ValidatedData = {};

      const targets: ValidationTarget[] = ["body", "query", "params"];

      for (const target of targets) {
        const schema = schemas[target];

        if (!schema) {
          continue;
        }

        validated[target] = schema.parse(req[target]);
      }

      res.locals.validated = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.flatMap((issue) => {
          if (issue.code === "unrecognized_keys") {
            return issue.keys.map((key) => ({
              field: [...issue.path, key].join("."),
              message: "Unrecognized key",
            }));
          }

          return [
            {
              field: issue.path.join(".") || "body",
              message: issue.message,
            },
          ];
        });

        next(AppError.badRequest("Validation failed", details));
        return;
      }

      next(error);
    }
  };
};
