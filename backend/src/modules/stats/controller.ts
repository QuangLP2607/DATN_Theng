import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";
import * as statsService from "./service";

/*
 * -------------------- GET USER STATISTICS --------------------
 */

export const getUserStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await statsService.getUserStats();

    sendResponse(res, 200, {
      message: "Get user statistics successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
