import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";

import {
  createWorkbook,
  deleteWorkbook,
  getWorkbookById,
  getWorkbooks,
  updateWorkbook,
} from "./controller";

import { createWorkbookSchema } from "./dto/createWorkbook";
import { updateWorkbookSchema } from "./dto/updateWorkbook";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

const router = Router();

router.use(authMiddleware);

/*
 * CREATE
 */

router.post(
  "/",
  validateZod({
    body: createWorkbookSchema,
  }),
  createWorkbook,
);

/*
 * GET ALL
 */

router.get("/", getWorkbooks);

/*
 * GET ONE
 */

router.get(
  "/:id",
  validateZod({
    params: uuidParamSchema,
  }),
  getWorkbookById,
);

/*
 * UPDATE
 */

router.patch(
  "/:id",
  validateZod({
    params: uuidParamSchema,
    body: updateWorkbookSchema,
  }),
  updateWorkbook,
);

/*
 * DELETE
 */

router.delete(
  "/:id",
  validateZod({
    params: uuidParamSchema,
  }),
  deleteWorkbook,
);

export default router;
