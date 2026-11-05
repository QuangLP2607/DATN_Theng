import { Router } from "express";
import { z } from "zod";

import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";

import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  addExamQuestions,
  updateExamQuestion,
  removeExamQuestion,
  publishExam,
  closeExam,
} from "./controller";

import { createExamSchema } from "./dto/createExam";
import { updateExamSchema } from "./dto/updateExam";
import { listExamsQuerySchema } from "./dto/listExams";
import { addExamQuestionsSchema } from "./dto/addExamQuestions";
import { updateExamQuestionSchema } from "./dto/updateExamQuestion";

const router = Router();

const examIdParamsSchema = z.object({
  id: z.uuid(),
});

const examQuestionParamsSchema = z.object({
  id: z.uuid(),
  questionId: z.uuid(),
});

router.use(authMiddleware);

// ======================================================
// EXAM LIST
// ======================================================

router.get(
  "/",
  validateZod({
    query: listExamsQuerySchema,
  }),
  getExams,
);

// ======================================================
// CREATE EXAM
// ======================================================

router.post(
  "/",
  validateZod({
    body: createExamSchema,
  }),
  createExam,
);

// ======================================================
// EXAM DETAIL
// ======================================================

router.get(
  "/:id",
  validateZod({
    params: examIdParamsSchema,
  }),
  getExamById,
);

// ======================================================
// UPDATE EXAM
// ======================================================

router.patch(
  "/:id",
  validateZod({
    params: examIdParamsSchema,
    body: updateExamSchema,
  }),
  updateExam,
);

// ======================================================
// DELETE EXAM
// ======================================================

router.delete(
  "/:id",
  validateZod({
    params: examIdParamsSchema,
  }),
  deleteExam,
);

// ======================================================
// ADD QUESTIONS
// ======================================================

router.post(
  "/:id/questions",
  validateZod({
    params: examIdParamsSchema,
    body: addExamQuestionsSchema,
  }),
  addExamQuestions,
);

// ======================================================
// UPDATE QUESTION IN EXAM
// ======================================================

router.patch(
  "/:id/questions/:questionId",
  validateZod({
    params: examQuestionParamsSchema,
    body: updateExamQuestionSchema,
  }),
  updateExamQuestion,
);

// ======================================================
// REMOVE QUESTION FROM EXAM
// ======================================================

router.delete(
  "/:id/questions/:questionId",
  validateZod({
    params: examQuestionParamsSchema,
  }),
  removeExamQuestion,
);

// ======================================================
// PUBLISH EXAM
// ======================================================

router.patch(
  "/:id/publish",
  validateZod({
    params: examIdParamsSchema,
  }),
  publishExam,
);

// ======================================================
// CLOSE EXAM
// ======================================================

router.patch(
  "/:id/close",
  validateZod({
    params: examIdParamsSchema,
  }),
  closeExam,
);

export default router;
