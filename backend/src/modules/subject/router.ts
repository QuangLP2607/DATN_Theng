import { Router } from "express";

import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateZod } from "../../middlewares/validateZod";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

import { listSubjectsQuerySchema } from "./dto/listSubjects";
import { createSubjectSchema } from "./dto/createSubject";
import { updateSubjectSchema } from "./dto/updateSubject";

const router = Router();

router.use(authMiddleware);

/*
 * -------------------- SUBJECT LIST --------------------
 */

router.get(
  "/",
  validateZod({
    query: listSubjectsQuerySchema,
  }),
  getSubjects,
);

/*
 * -------------------- SUBJECT DETAIL --------------------
 */

router.get(
  "/:id",
  validateZod({
    params: uuidParamSchema,
  }),
  getSubjectById,
);

/*
 * -------------------- ADMIN: CREATE SUBJECT --------------------
 */

router.post(
  "/",
  requireAdmin,
  validateZod({
    body: createSubjectSchema,
  }),
  createSubject,
);

/*
 * -------------------- ADMIN: UPDATE SUBJECT --------------------
 */

router.patch(
  "/:id",
  requireAdmin,
  validateZod({
    params: uuidParamSchema,
    body: updateSubjectSchema,
  }),
  updateSubject,
);

/*
 * -------------------- ADMIN: DELETE SUBJECT --------------------
 */

router.delete(
  "/:id",
  requireAdmin,
  validateZod({
    params: uuidParamSchema,
  }),
  deleteSubject,
);

export default router;
