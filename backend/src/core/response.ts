import type { Response } from "express";

type SendResponseOptions<T> = {
  message?: string;
  data?: T;
  meta?: unknown;
};

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  { message = "OK", data, meta }: SendResponseOptions<T> = {},
): Response => {
  const body: Record<string, unknown> = {
    code: statusCode,
    success: statusCode < 400,
    message,
    time: new Date().toISOString(),
  };

  if (data !== undefined) {
    body.data = data;
  }

  if (meta !== undefined) {
    body.meta = meta;
  }

  return res.status(statusCode).json(body);
};
