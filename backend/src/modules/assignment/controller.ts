import type { RequestHandler } from "express";

import { sendResponse } from "../../core/response";

import * as assignmentService from "./service";

import type { CreateAssignmentDto } from "./dto/createAssignment";
import type { UpdateAssignmentDto } from "./dto/updateAssignment";
import type { ListAssignmentsQueryDto } from "./dto/listAssignments";
import type { SaveSubmissionDto } from "./dto/saveSubmission";
import type { GradeSubmissionDto } from "./dto/gradeSubmission";
import type { ListSubmissionsQueryDto } from "./dto/listSubmissions";

// ======================================================
// GET ASSIGNMENTS
// ======================================================

export const getAssignments: RequestHandler = async (req, res, next) => {
  try {
    const query = res.locals.validated.query as ListAssignmentsQueryDto;

    const result = await assignmentService.getAssignments(
      query,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Get assignments successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET ASSIGNMENT BY ID
// ======================================================

export const getAssignmentById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const assignment = await assignmentService.getAssignmentById(
      id,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Get assignment successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// CREATE ASSIGNMENT
// ======================================================

export const createAssignment: RequestHandler = async (req, res, next) => {
  try {
    const body = res.locals.validated.body as CreateAssignmentDto;

    const assignment = await assignmentService.createAssignment(
      body,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 201, {
      message: "Create assignment successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE ASSIGNMENT
// ======================================================

export const updateAssignment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const body = res.locals.validated.body as UpdateAssignmentDto;

    const assignment = await assignmentService.updateAssignment(
      id,
      body,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Update assignment successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// DELETE ASSIGNMENT
// ======================================================

export const deleteAssignment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    await assignmentService.deleteAssignment(id, req.user!.id, req.user!.role);

    sendResponse(res, 200, {
      message: "Delete assignment successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// PUBLISH ASSIGNMENT
// ======================================================

export const publishAssignment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const assignment = await assignmentService.publishAssignment(
      id,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Publish assignment successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// CLOSE ASSIGNMENT
// ======================================================

export const closeAssignment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const assignment = await assignmentService.closeAssignment(
      id,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Close assignment successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// SAVE SUBMISSION
// ======================================================

export const saveSubmission: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const body = res.locals.validated.body as SaveSubmissionDto;

    const submission = await assignmentService.saveSubmission(
      id,
      body,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Save submission successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET MY SUBMISSION
// ======================================================

export const getMySubmission: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const submission = await assignmentService.getMySubmission(
      id,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Get submission successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// SUBMIT ASSIGNMENT
// ======================================================

export const submitAssignment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const submission = await assignmentService.submitAssignment(
      id,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Submit assignment successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET SUBMISSIONS
// ======================================================

export const getSubmissions: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.validated.params as {
      id: string;
    };

    const query = res.locals.validated.query as ListSubmissionsQueryDto;

    const result = await assignmentService.getSubmissions(
      id,
      query,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Get submissions successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GRADE SUBMISSION
// ======================================================

export const gradeSubmission: RequestHandler = async (req, res, next) => {
  try {
    const { id, submissionId } = res.locals.validated.params as {
      id: string;
      submissionId: string;
    };

    const body = res.locals.validated.body as GradeSubmissionDto;

    const submission = await assignmentService.gradeSubmission(
      id,
      submissionId,
      body,
      req.user!.id,
      req.user!.role,
    );

    sendResponse(res, 200, {
      message: "Grade submission successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};
