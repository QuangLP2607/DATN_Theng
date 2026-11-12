import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth";
import { loadAbility } from "../access/middlewares/ability.middleware";
import { validateZod } from "../../middlewares/validateZod";

import {
  courseIdParamsSchema,
  chapterIdParamsSchema,
} from "./dto/chapterParams";

import { listChaptersQuerySchema } from "./dto/listChapters";
import { createChapterSchema } from "./dto/createChapter";
import { updateChapterSchema } from "./dto/updateChapter";

import * as chapterController from "./controller";

const router = Router();

router.use(authMiddleware, loadAbility);

// Course chapters
router.get(
  "/courses/:courseId/chapters",
  validateZod({
    params: courseIdParamsSchema,
    query: listChaptersQuerySchema,
  }),
  chapterController.getChapters,
);

router.post(
  "/courses/:courseId/chapters",
  validateZod({
    params: courseIdParamsSchema,
    body: createChapterSchema,
  }),
  chapterController.createChapter,
);

// Individual chapter
router.get(
  "/chapters/:id",
  validateZod({
    params: chapterIdParamsSchema,
  }),
  chapterController.getChapterById,
);

router.patch(
  "/chapters/:id",
  validateZod({
    params: chapterIdParamsSchema,
    body: updateChapterSchema,
  }),
  chapterController.updateChapter,
);

router.delete(
  "/chapters/:id",
  validateZod({
    params: chapterIdParamsSchema,
  }),
  chapterController.deleteChapter,
);

export default router;
