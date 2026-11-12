import { Router } from "express";

import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { loadAbility } from "../access/middlewares/ability.middleware";
import { validateZod } from "../../middlewares/validateZod";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

import { listSubjectsQuerySchema } from "./dto/listSubjects";
import { createSubjectSchema } from "./dto/createSubject";
import { updateSubjectSchema } from "./dto/updateSubject";

const router = Router();

router.use(authMiddleware, loadAbility);

// List subjects
router.get("/", validateZod({ query: listSubjectsQuerySchema }), getSubjects);

// Get subject detail
router.get("/:id", validateZod({ params: uuidParamSchema }), getSubjectById);

// Create subject
router.post("/", validateZod({ body: createSubjectSchema }), createSubject);

// Update subject
router.patch(
  "/:id",
  validateZod({
    params: uuidParamSchema,
    body: updateSubjectSchema,
  }),
  updateSubject,
);

export default router;
