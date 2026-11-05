import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";
import * as subjectService from "./service";

import type { ListSubjectsQueryDto } from "./dto/listSubjects";
import type { CreateSubjectDto } from "./dto/createSubject";
import type { UpdateSubjectDto } from "./dto/updateSubject";

import type { UuidParam } from "../../shared/validation/uuidParam";

/*
 * -------------------- LIST SUBJECTS --------------------
 */

export const getSubjects = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = res.locals.validated.query as ListSubjectsQueryDto;

    const result = await subjectService.getSubjects(query);

    sendResponse(res, 200, {
      message: "Get subjects successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET SUBJECT BY ID --------------------
 */

export const getSubjectById = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    const subject = await subjectService.getSubjectById(params.id);

    sendResponse(res, 200, {
      message: "Get subject successfully",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- CREATE COURSE --------------------
 */

export const createSubject = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = res.locals.validated.body as CreateSubjectDto;

    const subject = await subjectService.createSubject(body);

    sendResponse(res, 201, {
      message: "Create subject successfully",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE COURSE --------------------
 */

export const updateSubject = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;
    const body = res.locals.validated.body as UpdateSubjectDto;

    const subject = await subjectService.updateSubject(params.id, body);

    sendResponse(res, 200, {
      message: "Update subject successfully",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- DELETE COURSE --------------------
 */

export const deleteSubject = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    await subjectService.deleteSubject(params.id);

    sendResponse(res, 200, {
      message: "Delete subject successfully",
    });
  } catch (error) {
    next(error);
  }
};
