import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";

import type { UuidParam } from "../../shared/validation/uuidParam";

import * as workbookService from "./service";

/*
 * -------------------- CREATE --------------------
 */

export const createWorkbook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = req.user!.id;

    const workbook = await workbookService.createWorkbook(userId, req.body);

    return sendResponse(res, 201, {
      message: "Workbook created successfully",
      data: workbook,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET ALL --------------------
 */

export const getWorkbooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = req.user!.id;

    const workbooks = await workbookService.getWorkbooks(userId);

    return sendResponse(res, 200, {
      message: "Workbooks retrieved successfully",
      data: workbooks,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET ONE --------------------
 */

export const getWorkbookById = async (
  req: Request<UuidParam>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const workbook = await workbookService.getWorkbookById(userId, id);

    return sendResponse(res, 200, {
      message: "Workbook retrieved successfully",
      data: workbook,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE --------------------
 */

export const updateWorkbook = async (
  req: Request<UuidParam>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const workbook = await workbookService.updateWorkbook(userId, id, req.body);

    return sendResponse(res, 200, {
      message: "Workbook updated successfully",
      data: workbook,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- DELETE --------------------
 */

export const deleteWorkbook = async (
  req: Request<UuidParam>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await workbookService.deleteWorkbook(userId, id);

    return sendResponse(res, 200, {
      message: "Workbook deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
