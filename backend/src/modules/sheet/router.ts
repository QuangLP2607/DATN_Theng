import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";

import { createSheet, deleteSheet, updateSheet } from "./controller";

import { createSheetSchema } from "./dto/createSheet";
import { updateSheetSchema } from "./dto/updateSheet";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

const router = Router();

router.use(authMiddleware);

/*
 * -------------------- CREATE --------------------
 *
 * POST /api/sheets
 */

router.post(
  "/",
  validateZod({
    body: createSheetSchema,
  }),
  createSheet,
);

/*
 * -------------------- UPDATE --------------------
 *
 * PATCH /api/sheets/:id
 */

router.patch(
  "/:id",
  validateZod({
    params: uuidParamSchema,
    body: updateSheetSchema,
  }),
  updateSheet,
);

/*
 * -------------------- DELETE --------------------
 *
 * DELETE /api/sheets/:id
 */

router.delete(
  "/:id",
  validateZod({
    params: uuidParamSchema,
  }),
  deleteSheet,
);

export default router;
