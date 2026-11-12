import { Router } from "express";

import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { loadAbility } from "../access/middlewares/ability.middleware";
import { validateZod } from "../../middlewares/validateZod";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

import { listCoursesQuerySchema } from "./dto/listCourses";
import { createCourseSchema } from "./dto/createCourse";
import { updateCourseSchema } from "./dto/updateCourse";

const router = Router();

router.use(authMiddleware, loadAbility);

// List courses
router.get(
  "/",
  validateZod({
    query: listCoursesQuerySchema,
  }),
  getCourses,
);

// Create course
router.post(
  "/",
  validateZod({
    body: createCourseSchema,
  }),
  createCourse,
);

// Get course detail
router.get(
  "/:id",
  validateZod({
    params: uuidParamSchema,
  }),
  getCourseById,
);

// Update course
router.patch(
  "/:id",
  validateZod({
    params: uuidParamSchema,
    body: updateCourseSchema,
  }),
  updateCourse,
);

// Delete course
router.delete(
  "/:id",
  validateZod({
    params: uuidParamSchema,
  }),
  deleteCourse,
);

// Publish course
router.post(
  "/:id/publish",
  validateZod({
    params: uuidParamSchema,
  }),
  publishCourse,
);

// Unpublish course
router.post(
  "/:id/unpublish",
  validateZod({
    params: uuidParamSchema,
  }),
  unpublishCourse,
);

export default router;
