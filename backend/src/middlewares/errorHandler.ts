import type { ErrorRequestHandler } from "express";

import { AppError } from "../core/error";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      success: false,
      message: err.message,
      ...(err.details !== undefined ? { data: err.details } : {}),
      time: new Date().toISOString(),
    });
  }

  return res.status(500).json({
    code: 500,
    success: false,
    message: "Internal server error",
    time: new Date().toISOString(),
  });
};

export default errorHandler;
