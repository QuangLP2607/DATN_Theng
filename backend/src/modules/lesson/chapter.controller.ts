import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../core/response";
import * as chapterService from "./chapter.service";

import type { ChapterParamsDto, subjectParamsDto } from "./dto/chapterParams";
import type { CreateChapterDto } from "./dto/createChapter";
import type { UpdateChapterDto } from "./dto/updateChapter";

export const getChaptersBysubject = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { subjectId } = res.locals.validated.params as subjectParamsDto;

    const result = await chapterService.getChaptersBysubject(subjectId);

    sendResponse(res, 200, {
      message: "Chapters retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getChapterById = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as ChapterParamsDto;

    const result = await chapterService.getChapterById(id);

    sendResponse(res, 200, {
      message: "Chapter retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createChapter = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { subjectId } = res.locals.validated.params as subjectParamsDto;
    const data = res.locals.validated.body as CreateChapterDto;

    const result = await chapterService.createChapter(subjectId, data);

    sendResponse(res, 201, {
      message: "Chapter created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateChapter = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as ChapterParamsDto;
    const data = res.locals.validated.body as UpdateChapterDto;

    const result = await chapterService.updateChapter(id, data);

    sendResponse(res, 200, {
      message: "Chapter updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
