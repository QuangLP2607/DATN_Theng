import { Router } from "express";

import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

import { listQuestionsQuerySchema } from "./dto/listQuestions";
import { createQuestionSchema } from "./dto/createQuestion";
import { updateQuestionSchema } from "./dto/updateQuestion";

const router = Router();

router.use(authMiddleware);

// Question list
router.get("/", validateZod({ query: listQuestionsQuerySchema }), getQuestions);

// Question detail
router.get("/:id", validateZod({ params: uuidParamSchema }), getQuestionById);

// Create question
router.post("/", validateZod({ body: createQuestionSchema }), createQuestion);

// Update question
router.patch(
  "/:id",
  validateZod({
    params: uuidParamSchema,
    body: updateQuestionSchema,
  }),
  updateQuestion,
);

// Delete question
router.delete("/:id", validateZod({ params: uuidParamSchema }), deleteQuestion);

export default router;
