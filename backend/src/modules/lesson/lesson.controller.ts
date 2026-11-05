import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../core/response";
import * as lessonService from "./lesson.service";

import type { ChapterParamsDto } from "./dto/chapterParams";
import type { LessonParamsDto } from "./dto/lessonParams";
import type { CreateLessonDto } from "./dto/createLesson";
import type { UpdateLessonDto } from "./dto/updateLesson";

export const getLessonsByChapter = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as ChapterParamsDto;

    const result = await lessonService.getLessonsByChapter(id);

    sendResponse(res, 200, {
      message: "Lessons retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getLessonById = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as LessonParamsDto;

    const result = await lessonService.getLessonById(id);

    sendResponse(res, 200, {
      message: "Lesson retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createLesson = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as ChapterParamsDto;
    const data = res.locals.validated.body as CreateLessonDto;

    const result = await lessonService.createLesson(id, data);

    sendResponse(res, 201, {
      message: "Lesson created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLesson = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as LessonParamsDto;
    const data = res.locals.validated.body as UpdateLessonDto;

    const result = await lessonService.updateLesson(id, data);

    sendResponse(res, 200, {
      message: "Lesson updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
