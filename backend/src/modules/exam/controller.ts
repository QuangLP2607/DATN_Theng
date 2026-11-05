import type { RequestHandler } from "express";

import { sendResponse } from "../../core/response";

import * as examService from "./service";

import type { CreateExamDto } from "./dto/createExam";
import type { UpdateExamDto } from "./dto/updateExam";
import type { ListExamsQueryDto } from "./dto/listExams";
import type { AddExamQuestionsDto } from "./dto/addExamQuestions";
import type { UpdateExamQuestionDto } from "./dto/updateExamQuestion";

// ======================================================
// GET EXAMS
// ======================================================

export const getExams: RequestHandler = async (req, res, next) => {
  try {
    const query = res.locals.validated.query as ListExamsQueryDto;

    const result = await examService.getExams(
      query,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Get exams successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET EXAM BY ID
// ======================================================

export const getExamById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const exam = await examService.getExamById(
      id,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Get exam successfully",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// CREATE EXAM
// ======================================================

export const createExam: RequestHandler = async (req, res, next) => {
  try {
    const body = res.locals.validated.body as CreateExamDto;

    const exam = await examService.createExam(
      body,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 201, {
      message: "Create exam successfully",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE EXAM
// ======================================================

export const updateExam: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const body = res.locals.validated.body as UpdateExamDto;

    const exam = await examService.updateExam(
      id,
      body,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Update exam successfully",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// DELETE EXAM
// ======================================================

export const deleteExam: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    await examService.deleteExam(id, req.user!.id, req.user!.role);

    sendResponse(res, 200, {
      message: "Delete exam successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// ADD QUESTIONS
// ======================================================

export const addExamQuestions: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const body = res.locals.validated.body as AddExamQuestionsDto;

    const exam = await examService.addExamQuestions(
      id,
      body,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Add questions to exam successfully",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE QUESTION IN EXAM
// ======================================================

export const updateExamQuestion: RequestHandler = async (req, res, next) => {
  try {
    const { id, questionId } = res.locals.validated.params as {
      id: string;
      questionId: string;
    };

    const body = res.locals.validated.body as UpdateExamQuestionDto;

    const exam = await examService.updateExamQuestion(
      id,
      questionId,
      body,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Update exam question successfully",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// REMOVE QUESTION FROM EXAM
// ======================================================

export const removeExamQuestion: RequestHandler = async (req, res, next) => {
  try {
    const { id, questionId } = res.locals.validated.params as {
      id: string;
      questionId: string;
    };

    await examService.removeExamQuestion(
      id,
      questionId,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Remove question from exam successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// PUBLISH EXAM
// ======================================================

export const publishExam: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const exam = await examService.publishExam(
      id,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Publish exam successfully",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// CLOSE EXAM
// ======================================================

export const closeExam: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const exam = await examService.closeExam(id, req.user!.id, req.user!.role);

    sendResponse(res, 200, {
      message: "Close exam successfully",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};
