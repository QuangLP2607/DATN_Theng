import { Router } from "express";

import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";

import { loadAbility } from "../access/middlewares/ability.middleware";

import {
  chapterIdParamsSchema,
  lessonIdParamsSchema,
} from "./dto/lessonParams";

import { listLessonsQuerySchema } from "./dto/listLessons";
import { createLessonSchema } from "./dto/createLesson";
import { updateLessonSchema } from "./dto/updateLesson";

const router = Router();

router.use(authMiddleware, loadAbility);

// List lessons in a chapter
router.get(
  "/chapters/:chapterId/lessons",
  validateZod({
    params: chapterIdParamsSchema,
    query: listLessonsQuerySchema,
  }),
  getLessons,
);

// Create lesson in a chapter
router.post(
  "/chapters/:chapterId/lessons",
  validateZod({
    params: chapterIdParamsSchema,
    body: createLessonSchema,
  }),
  createLesson,
);

// Get lesson detail
router.get(
  "/lessons/:id",
  validateZod({
    params: lessonIdParamsSchema,
  }),
  getLessonById,
);

// Update lesson
router.patch(
  "/lessons/:id",
  validateZod({
    params: lessonIdParamsSchema,
    body: updateLessonSchema,
  }),
  updateLesson,
);

// Delete lesson
router.delete(
  "/lessons/:id",
  validateZod({
    params: lessonIdParamsSchema,
  }),
  deleteLesson,
);

export default router;
