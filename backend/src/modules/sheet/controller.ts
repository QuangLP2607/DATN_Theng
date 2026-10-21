import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";

import type { UuidParam } from "../../shared/validation/uuidParam";

import * as sheetService from "./service";

/*
 * -------------------- CREATE --------------------
 */

export const createSheet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = req.user!.id;

    const sheet = await sheetService.createSheet(userId, req.body);

    return sendResponse(res, 201, {
      message: "Sheet created successfully",
      data: sheet,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE --------------------
 */

export const updateSheet = async (
  req: Request<UuidParam>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const sheet = await sheetService.updateSheet(userId, id, req.body);

    return sendResponse(res, 200, {
      message: "Sheet updated successfully",
      data: sheet,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- DELETE --------------------
 */

export const deleteSheet = async (
  req: Request<UuidParam>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await sheetService.deleteSheet(userId, id);

    return sendResponse(res, 200, {
      message: "Sheet deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
