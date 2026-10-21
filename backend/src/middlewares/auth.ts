import type { NextFunction, Request, Response } from "express";

import { AppError } from "../core/error";
import { verifyAccessToken, type JwtPayload } from "../services/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw AppError.unauthorized("No token provided");
  }

  const token = authHeader.slice(7);

  if (!token) {
    throw AppError.unauthorized("No token provided");
  }

  const user = verifyAccessToken(token);

  if (!user) {
    throw AppError.unauthorized("Invalid or expired token");
  }

  req.user = user;

  next();
};
