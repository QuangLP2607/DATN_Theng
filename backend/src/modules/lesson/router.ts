import { Router } from "express";

import {
  getChaptersBysubject,
  getChapterById,
  createChapter,
  updateChapter,
} from "./chapter.controller";

import {
  getLessonsByChapter,
  getLessonById,
  createLesson,
  updateLesson,
} from "./lesson.controller";

import { updateLessonProgress } from "./progress.controller";

import { authMiddleware } from "../../middlewares/auth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { requireSubjectAccess } from "../../middlewares/requireSubjectAccess";
import { validateZod } from "../../middlewares/validateZod";

import { chapterParamsSchema, subjectParamsSchema } from "./dto/chapterParams";

import { lessonParamsSchema } from "./dto/lessonParams";
import { createChapterSchema } from "./dto/createChapter";
import { updateChapterSchema } from "./dto/updateChapter";
import { createLessonSchema } from "./dto/createLesson";
import { updateLessonSchema } from "./dto/updateLesson";
import { updateLessonProgressSchema } from "./dto/updateLessonProgress";

const router = Router();

router.use(authMiddleware);

// ======================================================
// CHAPTER
// ======================================================

// Get chapters by subject
router.get(
  "/subjects/:subjectId/chapters",
  validateZod({ params: subjectParamsSchema }),
  requireSubjectAccess({
    resource: "subject",
    param: "subjectId",
  }),
  getChaptersBysubject,
);

// Create chapter - Admin only
router.post(
  "/subjects/:subjectId/chapters",
  validateZod({
    params: subjectParamsSchema,
    body: createChapterSchema,
  }),
  requireAdmin,
  createChapter,
);

// Get chapter by ID
router.get(
  "/chapters/:id",
  validateZod({ params: chapterParamsSchema }),
  requireSubjectAccess({ resource: "chapter" }),
  getChapterById,
);

// Update chapter - Admin only
router.patch(
  "/chapters/:id",
  validateZod({
    params: chapterParamsSchema,
    body: updateChapterSchema,
  }),
  requireAdmin,
  updateChapter,
);

// ======================================================
// LESSON
// ======================================================

// Get lessons by chapter
router.get(
  "/chapters/:id/lessons",
  validateZod({ params: chapterParamsSchema }),
  requireSubjectAccess({ resource: "chapter" }),
  getLessonsByChapter,
);

// Create lesson - Admin only
router.post(
  "/chapters/:id/lessons",
  validateZod({
    params: chapterParamsSchema,
    body: createLessonSchema,
  }),
  requireAdmin,
  createLesson,
);

// Get lesson by ID
router.get(
  "/lessons/:id",
  validateZod({ params: lessonParamsSchema }),
  requireSubjectAccess({ resource: "lesson" }),
  getLessonById,
);

// Update lesson - Admin only
router.patch(
  "/lessons/:id",
  validateZod({
    params: lessonParamsSchema,
    body: updateLessonSchema,
  }),
  requireAdmin,
  updateLesson,
);

// ======================================================
// LESSON PROGRESS
// ======================================================

// Update lesson progress - Student only
router.patch(
  "/lessons/:id/progress",
  validateZod({
    params: lessonParamsSchema,
    body: updateLessonProgressSchema,
  }),
  updateLessonProgress,
);

export default router;
