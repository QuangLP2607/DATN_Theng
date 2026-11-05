import type { RequestHandler } from "express";

import { AppError } from "../core/error";
import { assertAdminAccess } from "../modules/access/service";

export const requireAdmin: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    await assertAdminAccess(req.user.id);

    next();
  } catch (error) {
    next(error);
  }
};
