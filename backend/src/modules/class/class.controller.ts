import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../core/response";
import * as classService from "./class.service";
import type { ListClassesQueryDto } from "./dto/listClasses";
import type { CreateClassDto } from "./dto/createClass";
import type { UpdateClassDto } from "./dto/updateClass";
import type { UuidParam } from "../../shared/validation/uuidParam";

export const getClasses = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = res.locals.validated.query as ListClassesQueryDto;
    const result = await classService.getClasses(query);

    sendResponse(res, 200, {
      message: "Classes retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getClassById = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as UuidParam;
    const result = await classService.getClassById(id);

    sendResponse(res, 200, {
      message: "Class retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createClass = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = res.locals.validated.body as CreateClassDto;
    const result = await classService.createClass(data);

    sendResponse(res, 201, {
      message: "Class created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as UuidParam;
    const data = res.locals.validated.body as UpdateClassDto;
    const result = await classService.updateClass(id, data);

    sendResponse(res, 200, {
      message: "Class updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as UuidParam;
    await classService.deleteClass(id);

    sendResponse(res, 200, {
      message: "Class deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
