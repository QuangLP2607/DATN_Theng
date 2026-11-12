
import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";
import { AppError } from "../../core/error";

import type { AppAbility } from "../access/casl-prisma";

import * as courseService from "./service";

import type { ListCoursesQueryDto } from "./dto/listCourses";
import type { CreateCourseDto } from "./dto/createCourse";
import type { UpdateCourseDto } from "./dto/updateCourse";

import type { UuidParam } from "../../shared/validation/uuidParam";

/*
 * -------------------- REQUEST CONTEXT --------------------
 */

const getAbility = (req: Request): AppAbility => {
  if (!req.ability) {
    throw AppError.unauthorized("Authorization ability not initialized");
  }

  return req.ability;
};

const getUserId = (req: Request): string => {
  if (!req.user) {
    throw AppError.unauthorized("User not authenticated");
  }

  return req.user.id;
};

/*
 * -------------------- GET COURSES --------------------
 */

export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = res.locals.validated.query as ListCoursesQueryDto;

    const result = await courseService.getCourses(
      getAbility(req),
      query,
    );

    sendResponse(res, 200, {
      message: "Get courses successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET COURSE BY ID --------------------
 */

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    const course = await courseService.getCourseById(
      getAbility(req),
      params.id,
    );

    sendResponse(res, 200, {
      message: "Get course successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- CREATE COURSE --------------------
 */

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = res.locals.validated.body as CreateCourseDto;

    const course = await courseService.createCourse(
      getAbility(req),
      getUserId(req),
      body,
    );

    sendResponse(res, 201, {
      message: "Create course successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE COURSE --------------------
 */

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;
    const body = res.locals.validated.body as UpdateCourseDto;

    const course = await courseService.updateCourse(
      getAbility(req),
      params.id,
      body,
    );

    sendResponse(res, 200, {
      message: "Update course successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- DELETE COURSE --------------------
 */

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    await courseService.deleteCourse(
      getAbility(req),
      params.id,
    );

    sendResponse(res, 200, {
      message: "Delete course successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- PUBLISH COURSE --------------------
 */

export const publishCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    const course = await courseService.publishCourse(
      getAbility(req),
      params.id,
    );

    sendResponse(res, 200, {
      message: "Publish course successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UNPUBLISH COURSE --------------------
 */

export const unpublishCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    const course = await courseService.unpublishCourse(
      getAbility(req),
      params.id,
    );

    sendResponse(res, 200, {
      message: "Unpublish course successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};
