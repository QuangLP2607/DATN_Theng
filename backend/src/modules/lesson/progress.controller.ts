import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../core/error";
import { sendResponse } from "../../core/response";
import * as progressService from "./progress.service";

import type { LessonParamsDto } from "./dto/lessonParams";
import type { UpdateLessonProgressDto } from "./dto/updateLessonProgress";

export const updateLessonProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    if (req.user.role !== "STUDENT") {
      throw AppError.forbidden("Only students can update lesson progress");
    }

    const { id } = res.locals.validated.params as LessonParamsDto;
    const { progress } = res.locals.validated.body as UpdateLessonProgressDto;

    const result = await progressService.updateLessonProgress(
      id,
      req.user.id,
      progress,
    );

    sendResponse(res, 200, {
      message: "Lesson progress updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
