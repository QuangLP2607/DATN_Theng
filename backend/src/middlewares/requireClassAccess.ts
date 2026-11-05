import type { RequestHandler } from "express";

import { AppError } from "../core/error";
import { assertClassAccess } from "../modules/access/service";

interface RequireClassAccessOptions {
  param?: string;
}

export const requireClassAccess = ({
  param = "id",
}: RequireClassAccessOptions = {}): RequestHandler => {
  return async (req, _res, next) => {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required");
      }

      const classId = req.params[param];

      if (typeof classId !== "string" || !classId) {
        throw AppError.badRequest("Invalid class ID");
      }

      await assertClassAccess({
        classId,
        userId: req.user.id,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};
