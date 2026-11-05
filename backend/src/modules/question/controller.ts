import type { RequestHandler } from "express";

import { sendResponse } from "../../core/response";

import * as questionService from "./service";

import type { CreateQuestionDto } from "./dto/createQuestion";
import type { UpdateQuestionDto } from "./dto/updateQuestion";
import type { ListQuestionsQueryDto } from "./dto/listQuestions";

// ======================================================
// GET QUESTIONS
// ======================================================

export const getQuestions: RequestHandler = async (req, res, next) => {
  try {
    const query = res.locals.validated.query as ListQuestionsQueryDto;

    const result = await questionService.getQuestions(
      query,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Get questions successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET QUESTION BY ID
// ======================================================

export const getQuestionById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const question = await questionService.getQuestionById(
      id,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Get question successfully",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// CREATE QUESTION
// ======================================================

export const createQuestion: RequestHandler = async (req, res, next) => {
  try {
    const body = res.locals.validated.body as CreateQuestionDto;

    const question = await questionService.createQuestion(
      body,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 201, {
      message: "Create question successfully",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE QUESTION
// ======================================================

export const updateQuestion: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const body = res.locals.validated.body as UpdateQuestionDto;

    const question = await questionService.updateQuestion(
      id,
      body,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Update question successfully",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// DELETE QUESTION
// ======================================================

export const deleteQuestion: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    await questionService.deleteQuestion(id, req.user!.id, req.user!.role);

    sendResponse(res, 200, {
      message: "Delete question successfully",
    });
  } catch (error) {
    next(error);
  }
};
