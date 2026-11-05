import { Router } from "express";

import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "./class.controller";

import {
  getClassTeachers,
  assignTeacher,
  removeTeacher,
} from "./teacher.controller";

import {
  getClassStudents,
  enrollStudent,
  removeStudent,
} from "./student.controller";

import { authMiddleware } from "../../middlewares/auth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { requireClassAccess } from "../../middlewares/requireClassAccess";
import { validateZod } from "../../middlewares/validateZod";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

import { listClassesQuerySchema } from "./dto/listClasses";
import { createClassSchema } from "./dto/createClass";
import { updateClassSchema } from "./dto/updateClass";
import { assignTeacherSchema } from "./dto/assignTeacher";
import { enrollStudentSchema } from "./dto/enrollStudent";
import { teacherParamsSchema } from "./dto/teacherParams";
import { studentParamsSchema } from "./dto/studentParams";

const router = Router();

router.use(authMiddleware);

// Class CRUD
router.get("/", validateZod({ query: listClassesQuerySchema }), getClasses);

router.get(
  "/:id",
  validateZod({ params: uuidParamSchema }),
  requireClassAccess(),
  getClassById,
);

router.post(
  "/",
  requireAdmin,
  validateZod({ body: createClassSchema }),
  createClass,
);

router.patch(
  "/:id",
  requireAdmin,
  validateZod({
    params: uuidParamSchema,
    body: updateClassSchema,
  }),
  updateClass,
);

router.delete(
  "/:id",
  requireAdmin,
  validateZod({ params: uuidParamSchema }),
  deleteClass,
);

// Class teachers
router.get(
  "/:id/teachers",
  validateZod({ params: uuidParamSchema }),
  requireClassAccess(),
  getClassTeachers,
);

router.post(
  "/:id/teachers",
  requireAdmin,
  validateZod({
    params: uuidParamSchema,
    body: assignTeacherSchema,
  }),
  assignTeacher,
);

router.delete(
  "/:id/teachers/:teacherId",
  requireAdmin,
  validateZod({ params: teacherParamsSchema }),
  removeTeacher,
);

// Class students
router.get(
  "/:id/students",
  validateZod({ params: uuidParamSchema }),
  requireClassAccess(),
  getClassStudents,
);

router.post(
  "/:id/students",
  requireAdmin,
  validateZod({
    params: uuidParamSchema,
    body: enrollStudentSchema,
  }),
  enrollStudent,
);

router.delete(
  "/:id/students/:studentId",
  requireAdmin,
  validateZod({ params: studentParamsSchema }),
  removeStudent,
);

export default router;
