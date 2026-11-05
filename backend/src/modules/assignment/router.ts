import { Router } from "express";
import { z } from "zod";

import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";

import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  closeAssignment,
  saveSubmission,
  getMySubmission,
  submitAssignment,
  getSubmissions,
  gradeSubmission,
} from "./controller";

import { createAssignmentSchema } from "./dto/createAssignment";
import { updateAssignmentSchema } from "./dto/updateAssignment";
import { listAssignmentsQuerySchema } from "./dto/listAssignments";
import { saveSubmissionSchema } from "./dto/saveSubmission";
import { gradeSubmissionSchema } from "./dto/gradeSubmission";
import { listSubmissionsQuerySchema } from "./dto/listSubmissions";

const router = Router();

const assignmentIdParamsSchema = z.object({
  id: z.uuid(),
});

const submissionParamsSchema = z.object({
  id: z.uuid(),
  submissionId: z.uuid(),
});

router.use(authMiddleware);

// ======================================================
// ASSIGNMENT LIST
// ======================================================

router.get(
  "/",
  validateZod({
    query: listAssignmentsQuerySchema,
  }),
  getAssignments,
);

// ======================================================
// CREATE ASSIGNMENT
// ======================================================

router.post(
  "/",
  validateZod({
    body: createAssignmentSchema,
  }),
  createAssignment,
);

// ======================================================
// ASSIGNMENT DETAIL
// ======================================================

router.get(
  "/:id",
  validateZod({
    params: assignmentIdParamsSchema,
  }),
  getAssignmentById,
);

// ======================================================
// UPDATE ASSIGNMENT
// ======================================================

router.patch(
  "/:id",
  validateZod({
    params: assignmentIdParamsSchema,
    body: updateAssignmentSchema,
  }),
  updateAssignment,
);

// ======================================================
// DELETE ASSIGNMENT
// ======================================================

router.delete(
  "/:id",
  validateZod({
    params: assignmentIdParamsSchema,
  }),
  deleteAssignment,
);

// ======================================================
// PUBLISH ASSIGNMENT
// ======================================================

router.patch(
  "/:id/publish",
  validateZod({
    params: assignmentIdParamsSchema,
  }),
  publishAssignment,
);

// ======================================================
// CLOSE ASSIGNMENT
// ======================================================

router.patch(
  "/:id/close",
  validateZod({
    params: assignmentIdParamsSchema,
  }),
  closeAssignment,
);

// ======================================================
// STUDENT SUBMISSION
// ======================================================

// Save or update a draft
router.put(
  "/:id/submission",
  validateZod({
    params: assignmentIdParamsSchema,
    body: saveSubmissionSchema,
  }),
  saveSubmission,
);

// Get current student's submission
router.get(
  "/:id/submission",
  validateZod({
    params: assignmentIdParamsSchema,
  }),
  getMySubmission,
);

// Submit the saved draft
router.post(
  "/:id/submission/submit",
  validateZod({
    params: assignmentIdParamsSchema,
  }),
  submitAssignment,
);

// ======================================================
// TEACHER SUBMISSIONS
// ======================================================

// List submissions of an assignment
router.get(
  "/:id/submissions",
  validateZod({
    params: assignmentIdParamsSchema,
    query: listSubmissionsQuerySchema,
  }),
  getSubmissions,
);

// Grade a submission
router.patch(
  "/:id/submissions/:submissionId/grade",
  validateZod({
    params: submissionParamsSchema,
    body: gradeSubmissionSchema,
  }),
  gradeSubmission,
);

export default router;
