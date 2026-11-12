import { Router } from "express";
import { z } from "zod";

import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassTeachers,
  assignTeacher,
  removeTeacher,
  getClassStudents,
  enrollStudent,
  updateEnrollment,
  removeStudent,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { loadAbility } from "../access/middlewares/ability.middleware";
import { validateZod } from "../../middlewares/validateZod";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

import { listClassesQuerySchema } from "./dto/listClasses";
import { createClassSchema } from "./dto/createClass";
import { updateClassSchema } from "./dto/updateClass";
import { assignTeacherSchema } from "./dto/assignTeacher";
import { enrollStudentSchema } from "./dto/enrollStudent";
import { updateEnrollmentSchema } from "./dto/updateEnrollment";

const router = Router();

const classTeacherParamsSchema = z.object({
  id: z.string().uuid(),
  teacherId: z.string().uuid(),
});

const classStudentParamsSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
});

router.use(authMiddleware, loadAbility);

// ========================================
// CLASS
// ========================================

// List classes
router.get(
  "/",
  validateZod({
    query: listClassesQuerySchema,
  }),
  getClasses,
);

// Create class
router.post(
  "/",
  validateZod({
    body: createClassSchema,
  }),
  createClass,
);

// Get class detail
router.get(
  "/:id",
  validateZod({
    params: uuidParamSchema,
  }),
  getClassById,
);

// Update class
router.patch(
  "/:id",
  validateZod({
    params: uuidParamSchema,
    body: updateClassSchema,
  }),
  updateClass,
);

// Delete class
router.delete(
  "/:id",
  validateZod({
    params: uuidParamSchema,
  }),
  deleteClass,
);

// ========================================
// CLASS TEACHERS
// ========================================

// Get teachers
router.get(
  "/:id/teachers",
  validateZod({
    params: uuidParamSchema,
  }),
  getClassTeachers,
);

// Assign teacher
router.post(
  "/:id/teachers",
  validateZod({
    params: uuidParamSchema,
    body: assignTeacherSchema,
  }),
  assignTeacher,
);

// Remove teacher
router.delete(
  "/:id/teachers/:teacherId",
  validateZod({
    params: classTeacherParamsSchema,
  }),
  removeTeacher,
);

// ========================================
// CLASS STUDENTS
// ========================================

// Get students
router.get(
  "/:id/students",
  validateZod({
    params: uuidParamSchema,
  }),
  getClassStudents,
);

// Enroll student
router.post(
  "/:id/students",
  validateZod({
    params: uuidParamSchema,
    body: enrollStudentSchema,
  }),
  enrollStudent,
);

// Update enrollment status
router.patch(
  "/:id/students/:studentId",
  validateZod({
    params: classStudentParamsSchema,
    body: updateEnrollmentSchema,
  }),
  updateEnrollment,
);

// Remove student
router.delete(
  "/:id/students/:studentId",
  validateZod({
    params: classStudentParamsSchema,
  }),
  removeStudent,
);

export default router;
