import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";
import { AppError } from "../../core/error";

import * as subjectGradeService from "./service";

import type { ListSubjectGradesQueryDto } from "./dto/listSubjectGrades";

import type { UuidParam } from "../../shared/validation/uuidParam";

/*
 * -------------------- GET SUBJECT GRADES --------------------
 */

export const getSubjectGrades = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const query = res.locals.validated.query as ListSubjectGradesQueryDto;

    const subjectGrades = await subjectGradeService.getSubjectGrades(
      req.ability,
      query,
    );

    sendResponse(res, 200, {
      message: "Get subject grades successfully",
      data: {
        subjectGrades,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET SUBJECT GRADE BY ID --------------------
 */

export const getSubjectGradeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as UuidParam;

    const subjectGrade = await subjectGradeService.getSubjectGradeById(
      req.ability,
      params.id,
    );

    sendResponse(res, 200, {
      message: "Get subject grade successfully",
      data: subjectGrade,
    });
  } catch (error) {
    next(error);
  }
};
