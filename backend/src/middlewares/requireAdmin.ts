import type { NextFunction, Request, Response } from "express";

import { AppError } from "../core/error";

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    throw AppError.unauthorized("Authentication required");
  }

  if (req.user.role !== "ADMIN") {
    throw AppError.forbidden("Only admins can register accounts");
  }

  next();
};
