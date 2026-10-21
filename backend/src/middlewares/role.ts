import type { Request, Response, NextFunction } from "express";

import { AppError } from "../core/error";
import type { Role } from "../interfaces/users";

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      throw AppError.unauthorized("Authentication required");
    }

    if (!allowedRoles.includes(user.role)) {
      throw AppError.forbidden(
        "You do not have permission to access this resource",
      );
    }

    next();
  };
};
