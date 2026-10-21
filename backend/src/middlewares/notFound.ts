import type { NextFunction, Request, Response } from "express";

import { AppError } from "../core/error";

const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`API ${req.method} ${req.originalUrl} not found`));
};

export default notFoundHandler;
