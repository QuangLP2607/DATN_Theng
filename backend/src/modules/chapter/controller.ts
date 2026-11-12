import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";
import { AppError } from "../../core/error";

import type { AppAbility } from "../access/casl-prisma";

import * as chapterService from "./service";

import type {
  CourseIdParamsDto,
  ChapterIdParamsDto,
} from "./dto/chapterParams";
import type { ListChaptersQueryDto } from "./dto/listChapters";
import type { CreateChapterDto } from "./dto/createChapter";
import type { UpdateChapterDto } from "./dto/updateChapter";

const getAbility = (req: Request): AppAbility => {
  if (!req.ability) {
    throw AppError.unauthorized();
  }

  return req.ability;
};

/*
 * -------------------- GET CHAPTERS --------------------
 */

export const getChapters = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { courseId } = res.locals.validated.params as CourseIdParamsDto;
    const query = res.locals.validated.query as ListChaptersQueryDto;

    const chapters = await chapterService.getChapters(
      getAbility(req),
      courseId,
      query,
    );

    sendResponse(res, 200, {
      message: "Get chapters successfully",
      data: { chapters },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET CHAPTER BY ID --------------------
 */

export const getChapterById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as ChapterIdParamsDto;

    const chapter = await chapterService.getChapterById(getAbility(req), id);

    sendResponse(res, 200, {
      message: "Get chapter successfully",
      data: { chapter },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- CREATE CHAPTER --------------------
 */

export const createChapter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { courseId } = res.locals.validated.params as CourseIdParamsDto;
    const input = res.locals.validated.body as CreateChapterDto;

    const chapter = await chapterService.createChapter(
      getAbility(req),
      courseId,
      input,
    );

    sendResponse(res, 201, {
      message: "Create chapter successfully",
      data: { chapter },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE CHAPTER --------------------
 */

export const updateChapter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as ChapterIdParamsDto;
    const input = res.locals.validated.body as UpdateChapterDto;

    const chapter = await chapterService.updateChapter(
      getAbility(req),
      id,
      input,
    );

    sendResponse(res, 200, {
      message: "Update chapter successfully",
      data: { chapter },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- DELETE CHAPTER --------------------
 */

export const deleteChapter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = res.locals.validated.params as ChapterIdParamsDto;

    await chapterService.deleteChapter(getAbility(req), id);

    sendResponse(res, 200, {
      message: "Delete chapter successfully",
    });
  } catch (error) {
    next(error);
  }
};
