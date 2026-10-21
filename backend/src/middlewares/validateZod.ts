import type { Request, Response, NextFunction } from "express";

import { ZodError, type ZodType } from "zod";

import { AppError } from "../core/error";

type ValidationTarget = "body" | "query" | "params";

type ValidationSchemas = Partial<Record<ValidationTarget, ZodType>>;

export const validateZod = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const targets: ValidationTarget[] = ["body", "query", "params"];

      for (const target of targets) {
        const schema = schemas[target];

        if (!schema) {
          continue;
        }

        console.log("TARGET:", target);
        console.log("VALUE:", req[target]);

        const parsed = schema.parse(req[target]);

        req[target] = parsed;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        throw AppError.badRequest("Validation failed", details);
      }

      next(error);
    }
  };
};
