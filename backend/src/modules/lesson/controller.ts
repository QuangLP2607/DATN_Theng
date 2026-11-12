import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";
import { AppError } from "../../core/error";

import * as lessonService from "./service";

import type { ListLessonsQueryDto } from "./dto/listLessons";
import type { CreateLessonDto } from "./dto/createLesson";
import type { UpdateLessonDto } from "./dto/updateLesson";

import type { ChapterIdParams, LessonIdParams } from "./dto/lessonParams";

/*
 * -------------------- GET LESSONS --------------------
 */

export const getLessons = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as ChapterIdParams;
    const query = res.locals.validated.query as ListLessonsQueryDto;

    const lessons = await lessonService.getLessons(
      req.ability,
      params.chapterId,
      query,
    );

    sendResponse(res, 200, {
      message: "Get lessons successfully",
      data: {
        lessons,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET LESSON BY ID --------------------
 */

export const getLessonById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as LessonIdParams;

    const lesson = await lessonService.getLessonById(req.ability, params.id);

    sendResponse(res, 200, {
      message: "Get lesson successfully",
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- CREATE LESSON --------------------
 */

export const createLesson = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as ChapterIdParams;
    const body = res.locals.validated.body as CreateLessonDto;

    const lesson = await lessonService.createLesson(
      req.ability,
      params.chapterId,
      body,
    );

    sendResponse(res, 201, {
      message: "Create lesson successfully",
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE LESSON --------------------
 */

export const updateLesson = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as LessonIdParams;
    const body = res.locals.validated.body as UpdateLessonDto;

    const lesson = await lessonService.updateLesson(
      req.ability,
      params.id,
      body,
    );

    sendResponse(res, 200, {
      message: "Update lesson successfully",
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- DELETE LESSON --------------------
 */

export const deleteLesson = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as LessonIdParams;

    await lessonService.deleteLesson(req.ability, params.id);

    sendResponse(res, 200, {
      message: "Delete lesson successfully",
    });
  } catch (error) {
    next(error);
  }
};
