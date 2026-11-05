import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../core/response";
import * as teacherService from "./teacher.service";
import type { AssignTeacherDto } from "./dto/assignTeacher";
import type { TeacherParamsDto } from "./dto/teacherParams";

export const getClassTeachers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as { id: string };
    const result = await teacherService.getClassTeachers(id);

    sendResponse(res, 200, {
      message: "Class teachers retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const assignTeacher = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as { id: string };
    const { teacherId } = res.locals.validated.body as AssignTeacherDto;
    const result = await teacherService.assignTeacher(id, teacherId);

    sendResponse(res, 201, {
      message: "Teacher assigned successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeTeacher = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id, teacherId } = res.locals.validated.params as TeacherParamsDto;
    await teacherService.removeTeacher(id, teacherId);

    sendResponse(res, 200, {
      message: "Teacher removed from class successfully",
    });
  } catch (error) {
    next(error);
  }
};
