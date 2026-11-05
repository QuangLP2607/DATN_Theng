import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../core/response";
import * as studentService from "./student.service";
import type { EnrollStudentDto } from "./dto/enrollStudent";
import type { StudentParamsDto } from "./dto/studentParams";

export const getClassStudents = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as { id: string };
    const result = await studentService.getClassStudents(id);

    sendResponse(res, 200, {
      message: "Class students retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const enrollStudent = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as { id: string };
    const { studentId } = res.locals.validated.body as EnrollStudentDto;
    const result = await studentService.enrollStudent(id, studentId);

    sendResponse(res, 201, {
      message: "Student enrolled successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeStudent = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id, studentId } = res.locals.validated.params as StudentParamsDto;
    await studentService.removeStudent(id, studentId);

    sendResponse(res, 200, {
      message: "Student removed from class successfully",
    });
  } catch (error) {
    next(error);
  }
};
