import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";
import { AppError } from "../../core/error";

import { AccessAction } from "../access/actions";

import * as subjectService from "./service";

import type { ListSubjectsQueryDto } from "./dto/listSubjects";
import type { CreateSubjectDto } from "./dto/createSubject";
import type { UpdateSubjectDto } from "./dto/updateSubject";

import type { UuidParam } from "../../shared/validation/uuidParam";

/*
 * -------------------- GET SUBJECTS --------------------
 */

export const getSubjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const query = res.locals.validated.query as ListSubjectsQueryDto;

    const result = await subjectService.getSubjects(req.ability, query);

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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as UuidParam;

    const subject = await subjectService.getSubjectById(req.ability, params.id);

    sendResponse(res, 200, {
      message: "Get subject successfully",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- CREATE SUBJECT --------------------
 */

export const createSubject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    if (!req.ability.can(AccessAction.CREATE, "Subject")) {
      throw AppError.forbidden("You are not allowed to create subjects");
    }

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
 * -------------------- UPDATE SUBJECT --------------------
 */

export const updateSubject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    if (!req.ability.can(AccessAction.UPDATE, "Subject")) {
      throw AppError.forbidden("You are not allowed to update subjects");
    }

    const params = res.locals.validated.params as UuidParam;
    const body = res.locals.validated.body as UpdateSubjectDto;

    const subject = await subjectService.updateSubject(
      req.ability,
      params.id,
      body,
    );

    sendResponse(res, 200, {
      message: "Update subject successfully",
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};
