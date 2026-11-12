import { Router } from "express";

import { getSubjectGrades, getSubjectGradeById } from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { loadAbility } from "../access/middlewares/ability.middleware";
import { validateZod } from "../../middlewares/validateZod";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

import { listSubjectGradesQuerySchema } from "./dto/listSubjectGrades";

const router = Router();

router.use(authMiddleware, loadAbility);

// List subject grades by subject
router.get(
  "/",
  validateZod({
    query: listSubjectGradesQuerySchema,
  }),
  getSubjectGrades,
);

// Get subject grade detail
router.get(
  "/:id",
  validateZod({
    params: uuidParamSchema,
  }),
  getSubjectGradeById,
);

export default router;
