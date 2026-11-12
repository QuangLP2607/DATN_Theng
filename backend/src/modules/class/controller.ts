import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";
import { AppError } from "../../core/error";

import type { AppAbility } from "../access/casl-prisma";

import * as classService from "./service";

import type { ListClassesQueryDto } from "./dto/listClasses";
import type { CreateClassDto } from "./dto/createClass";
import type { UpdateClassDto } from "./dto/updateClass";
import type { AssignTeacherDto } from "./dto/assignTeacher";
import type { EnrollStudentDto } from "./dto/enrollStudent";
import type { UpdateEnrollmentDto } from "./dto/updateEnrollment";

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

/*
 * -------------------- GET CLASSES --------------------
 */

export const getClasses = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = res.locals.validated.query as ListClassesQueryDto;

    const result = await classService.getClasses(getAbility(req), query);

    sendResponse(res, 200, {
      message: "Get classes successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET CLASS BY ID --------------------
 */

export const getClassById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    const classItem = await classService.getClassById(
      getAbility(req),
      params.id,
    );

    sendResponse(res, 200, {
      message: "Get class successfully",
      data: classItem,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- CREATE CLASS --------------------
 */

export const createClass = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = res.locals.validated.body as CreateClassDto;

    const classItem = await classService.createClass(getAbility(req), body);

    sendResponse(res, 201, {
      message: "Create class successfully",
      data: classItem,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE CLASS --------------------
 */

export const updateClass = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;
    const body = res.locals.validated.body as UpdateClassDto;

    const classItem = await classService.updateClass(
      getAbility(req),
      params.id,
      body,
    );

    sendResponse(res, 200, {
      message: "Update class successfully",
      data: classItem,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- DELETE CLASS --------------------
 */

export const deleteClass = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    await classService.deleteClass(getAbility(req), params.id);

    sendResponse(res, 200, {
      message: "Delete class successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET CLASS TEACHERS --------------------
 */

export const getClassTeachers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    const teachers = await classService.getClassTeachers(
      getAbility(req),
      params.id,
    );

    sendResponse(res, 200, {
      message: "Get class teachers successfully",
      data: { teachers },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- ASSIGN TEACHER --------------------
 */

export const assignTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;
    const body = res.locals.validated.body as AssignTeacherDto;

    const assignment = await classService.assignTeacher(
      getAbility(req),
      params.id,
      body.teacherId,
    );

    sendResponse(res, 201, {
      message: "Assign teacher successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- REMOVE TEACHER --------------------
 */

export const removeTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as {
      id: string;
      teacherId: string;
    };

    await classService.removeTeacher(
      getAbility(req),
      params.id,
      params.teacherId,
    );

    sendResponse(res, 200, {
      message: "Remove teacher successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET CLASS STUDENTS --------------------
 */

export const getClassStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    const result = await classService.getClassStudents(
      getAbility(req),
      params.id,
    );

    sendResponse(res, 200, {
      message: "Get class students successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- ENROLL STUDENT --------------------
 */

export const enrollStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;
    const body = res.locals.validated.body as EnrollStudentDto;

    const enrollment = await classService.enrollStudent(
      getAbility(req),
      params.id,
      body.studentId,
    );

    sendResponse(res, 201, {
      message: "Enroll student successfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE ENROLLMENT --------------------
 */

export const updateEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as {
      id: string;
      studentId: string;
    };

    const body = res.locals.validated.body as UpdateEnrollmentDto;

    const enrollment = await classService.updateEnrollment(
      getAbility(req),
      params.id,
      params.studentId,
      body.status,
    );

    sendResponse(res, 200, {
      message: "Update enrollment successfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- REMOVE STUDENT --------------------
 */

export const removeStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as {
      id: string;
      studentId: string;
    };

    await classService.removeStudent(
      getAbility(req),
      params.id,
      params.studentId,
    );

    sendResponse(res, 200, {
      message: "Remove student successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
