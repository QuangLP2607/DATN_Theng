import { Prisma } from "../../generated/prisma/client";
import {
  AssignmentStatus,
  ClassStatus,
  EnrollmentStatus,
  SubmissionStatus,
  UserRole,
} from "../../generated/prisma/enums";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import { assertClassAccess } from "../access/service";

import type { Pagination } from "../../utils/zod";

import type { CreateAssignmentDto } from "./dto/createAssignment";
import type { UpdateAssignmentDto } from "./dto/updateAssignment";
import type { ListAssignmentsQueryDto } from "./dto/listAssignments";
import type { SaveSubmissionDto } from "./dto/saveSubmission";
import type { GradeSubmissionDto } from "./dto/gradeSubmission";
import type { ListSubmissionsQueryDto } from "./dto/listSubmissions";

// ======================================================
// SELECT
// ======================================================

const assignmentSelect = {
  id: true,
  classId: true,
  title: true,
  description: true,
  dueAt: true,
  maxScore: true,
  status: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,

  class: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },

  creator: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },

  _count: {
    select: {
      submissions: true,
    },
  },
} satisfies Prisma.AssignmentSelect;

const submissionSelect = {
  id: true,
  assignmentId: true,
  studentId: true,
  content: true,
  fileUrl: true,
  submittedAt: true,
  status: true,
  score: true,
  feedback: true,
  gradedBy: true,
  gradedAt: true,
  createdAt: true,
  updatedAt: true,

  student: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },

  grader: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.AssignmentSubmissionSelect;

// ======================================================
// HELPERS
// ======================================================

const assertAssignmentManager = (role: UserRole): void => {
  if (role !== UserRole.ADMIN && role !== UserRole.TEACHER) {
    throw AppError.forbidden("Only Admin and Teacher can manage assignments");
  }
};

const getAssignmentOrThrow = async (assignmentId: string) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      classId: true,
      title: true,
      dueAt: true,
      maxScore: true,
      status: true,
      _count: {
        select: {
          submissions: true,
        },
      },
    },
  });

  if (!assignment) {
    throw AppError.notFound("Assignment not found");
  }

  return assignment;
};

const assertAssignmentAccess = async (
  assignmentId: string,
  userId: string,
  role: UserRole,
) => {
  const assignment = await getAssignmentOrThrow(assignmentId);

  await assertClassAccess({
    classId: assignment.classId,
    userId,
  });

  if (
    role === UserRole.STUDENT &&
    assignment.status !== AssignmentStatus.PUBLISHED
  ) {
    throw AppError.notFound("Assignment not found");
  }

  return assignment;
};

const assertAssignmentEditable = async (
  assignmentId: string,
  userId: string,
  role: UserRole,
) => {
  assertAssignmentManager(role);

  const assignment = await assertAssignmentAccess(assignmentId, userId, role);

  if (assignment.status !== AssignmentStatus.DRAFT) {
    throw AppError.conflict("Only draft assignments can be modified");
  }

  if (assignment._count.submissions > 0) {
    throw AppError.conflict(
      "Cannot modify an assignment that already has submissions",
    );
  }

  return assignment;
};

// ======================================================
// GET ASSIGNMENTS
// ======================================================

export const getAssignments = async (
  query: ListAssignmentsQueryDto,
  userId: string,
  role: UserRole,
): Promise<{
  assignments: Prisma.AssignmentGetPayload<{
    select: typeof assignmentSelect;
  }>[];
  pagination: Pagination;
}> => {
  const { page, limit, search, classId, status, sortBy, order } = query;

  if (classId) {
    await assertClassAccess({
      classId,
      userId,
    });
  }

  const where: Prisma.AssignmentWhereInput = {
    ...(classId && { classId }),

    ...(search && {
      title: {
        contains: search,
        mode: "insensitive",
      },
    }),

    ...(role === UserRole.ADMIN
      ? {
          ...(status && { status }),
        }
      : role === UserRole.TEACHER
        ? {
            class: {
              teachers: {
                some: {
                  teacherId: userId,
                },
              },
            },
            ...(status && { status }),
          }
        : {
            status: AssignmentStatus.PUBLISHED,
            class: {
              status: ClassStatus.ACTIVE,
              students: {
                some: {
                  studentId: userId,
                  status: EnrollmentStatus.ACTIVE,
                },
              },
            },
          }),
  };

  const orderBy: Prisma.AssignmentOrderByWithRelationInput = {
    [sortBy]: order,
  };

  const [assignments, total] = await prisma.$transaction([
    prisma.assignment.findMany({
      where,
      select: assignmentSelect,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [orderBy, { id: "asc" }],
    }),

    prisma.assignment.count({ where }),
  ]);

  return {
    assignments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ======================================================
// GET ASSIGNMENT BY ID
// ======================================================

export const getAssignmentById = async (
  assignmentId: string,
  userId: string,
  role: UserRole,
) => {
  await assertAssignmentAccess(assignmentId, userId, role);

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: assignmentSelect,
  });

  if (!assignment) {
    throw AppError.notFound("Assignment not found");
  }

  if (role !== UserRole.STUDENT) {
    return assignment;
  }

  const submission = await prisma.assignmentSubmission.findUnique({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId: userId,
      },
    },
    select: {
      id: true,
      content: true,
      fileUrl: true,
      submittedAt: true,
      status: true,
      score: true,
      feedback: true,
      gradedAt: true,
    },
  });

  return {
    ...assignment,
    submission,
  };
};

// ======================================================
// CREATE ASSIGNMENT
// ======================================================

export const createAssignment = async (
  data: CreateAssignmentDto,
  userId: string,
  role: UserRole,
) => {
  assertAssignmentManager(role);

  await assertClassAccess({
    classId: data.classId,
    userId,
  });

  return prisma.assignment.create({
    data: {
      classId: data.classId,
      title: data.title,
      description: data.description,
      dueAt: data.dueAt,
      maxScore: data.maxScore,
      createdBy: userId,
    },
    select: assignmentSelect,
  });
};

// ======================================================
// UPDATE ASSIGNMENT
// ======================================================

export const updateAssignment = async (
  assignmentId: string,
  data: UpdateAssignmentDto,
  userId: string,
  role: UserRole,
) => {
  await assertAssignmentEditable(assignmentId, userId, role);

  return prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      ...(data.title !== undefined && {
        title: data.title,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.dueAt !== undefined && {
        dueAt: data.dueAt,
      }),

      ...(data.maxScore !== undefined && {
        maxScore: data.maxScore,
      }),
    },
    select: assignmentSelect,
  });
};

// ======================================================
// DELETE ASSIGNMENT
// ======================================================

export const deleteAssignment = async (
  assignmentId: string,
  userId: string,
  role: UserRole,
): Promise<void> => {
  await assertAssignmentEditable(assignmentId, userId, role);

  await prisma.assignment.delete({
    where: { id: assignmentId },
  });
};

// ======================================================
// PUBLISH ASSIGNMENT
// ======================================================

export const publishAssignment = async (
  assignmentId: string,
  userId: string,
  role: UserRole,
) => {
  assertAssignmentManager(role);

  const assignment = await assertAssignmentAccess(assignmentId, userId, role);

  if (assignment.status !== AssignmentStatus.DRAFT) {
    throw AppError.conflict("Only draft assignments can be published");
  }

  return prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      status: AssignmentStatus.PUBLISHED,
    },
    select: assignmentSelect,
  });
};

// ======================================================
// CLOSE ASSIGNMENT
// ======================================================

export const closeAssignment = async (
  assignmentId: string,
  userId: string,
  role: UserRole,
) => {
  assertAssignmentManager(role);

  const assignment = await assertAssignmentAccess(assignmentId, userId, role);

  if (assignment.status !== AssignmentStatus.PUBLISHED) {
    throw AppError.conflict("Only published assignments can be closed");
  }

  return prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      status: AssignmentStatus.CLOSED,
    },
    select: assignmentSelect,
  });
};

// ======================================================
// SAVE SUBMISSION DRAFT
// ======================================================

export const saveSubmission = async (
  assignmentId: string,
  data: SaveSubmissionDto,
  userId: string,
  role: UserRole,
) => {
  if (role !== UserRole.STUDENT) {
    throw AppError.forbidden("Only students can submit assignments");
  }

  const assignment = await assertAssignmentAccess(assignmentId, userId, role);

  if (assignment.status !== AssignmentStatus.PUBLISHED) {
    throw AppError.conflict("This assignment is not accepting submissions");
  }

  const existingSubmission = await prisma.assignmentSubmission.findUnique({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId: userId,
      },
    },
  });

  if (
    existingSubmission &&
    existingSubmission.status !== SubmissionStatus.DRAFT
  ) {
    throw AppError.conflict("This submission has already been submitted");
  }

  if (existingSubmission) {
    return prisma.assignmentSubmission.update({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: userId,
        },
      },
      data: {
        ...(data.content !== undefined && {
          content: data.content,
        }),

        ...(data.fileUrl !== undefined && {
          fileUrl: data.fileUrl,
        }),
      },
      select: submissionSelect,
    });
  }

  return prisma.assignmentSubmission.create({
    data: {
      assignmentId,
      studentId: userId,
      content: data.content,
      fileUrl: data.fileUrl,
      status: SubmissionStatus.DRAFT,
    },
    select: submissionSelect,
  });
};

// ======================================================
// GET MY SUBMISSION
// ======================================================

export const getMySubmission = async (
  assignmentId: string,
  userId: string,
  role: UserRole,
) => {
  if (role !== UserRole.STUDENT) {
    throw AppError.forbidden("Only students can access this endpoint");
  }

  await assertAssignmentAccess(assignmentId, userId, role);

  const submission = await prisma.assignmentSubmission.findUnique({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId: userId,
      },
    },
    select: {
      id: true,
      assignmentId: true,
      content: true,
      fileUrl: true,
      submittedAt: true,
      status: true,
      score: true,
      feedback: true,
      gradedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!submission) {
    throw AppError.notFound("Submission not found");
  }

  return submission;
};

// ======================================================
// SUBMIT ASSIGNMENT
// ======================================================

export const submitAssignment = async (
  assignmentId: string,
  userId: string,
  role: UserRole,
) => {
  if (role !== UserRole.STUDENT) {
    throw AppError.forbidden("Only students can submit assignments");
  }

  const assignment = await assertAssignmentAccess(assignmentId, userId, role);

  if (assignment.status !== AssignmentStatus.PUBLISHED) {
    throw AppError.conflict("This assignment is not accepting submissions");
  }

  const submission = await prisma.assignmentSubmission.findUnique({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId: userId,
      },
    },
  });

  if (!submission) {
    throw AppError.badRequest("Please save your submission before submitting");
  }

  if (submission.status !== SubmissionStatus.DRAFT) {
    throw AppError.conflict("This submission has already been submitted");
  }

  if (!submission.content && !submission.fileUrl) {
    throw AppError.badRequest("Submission content or file is required");
  }

  const submittedAt = new Date();

  const isLate =
    assignment.dueAt !== null &&
    submittedAt.getTime() > assignment.dueAt.getTime();

  return prisma.assignmentSubmission.update({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId: userId,
      },
    },
    data: {
      submittedAt,
      status: isLate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED,
    },
    select: submissionSelect,
  });
};

// ======================================================
// GET SUBMISSIONS
// ======================================================

export const getSubmissions = async (
  assignmentId: string,
  query: ListSubmissionsQueryDto,
  userId: string,
  role: UserRole,
): Promise<{
  submissions: Prisma.AssignmentSubmissionGetPayload<{
    select: typeof submissionSelect;
  }>[];
  pagination: Pagination;
}> => {
  assertAssignmentManager(role);

  await assertAssignmentAccess(assignmentId, userId, role);

  const { page, limit, search, status, sortBy, order } = query;

  const where: Prisma.AssignmentSubmissionWhereInput = {
    assignmentId,

    ...(status && {
      status,
    }),

    ...(search && {
      student: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    }),
  };

  const orderBy: Prisma.AssignmentSubmissionOrderByWithRelationInput = {
    [sortBy]: order,
  };

  const [submissions, total] = await prisma.$transaction([
    prisma.assignmentSubmission.findMany({
      where,
      select: submissionSelect,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [orderBy, { id: "asc" }],
    }),

    prisma.assignmentSubmission.count({ where }),
  ]);

  return {
    submissions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ======================================================
// GRADE SUBMISSION
// ======================================================

export const gradeSubmission = async (
  assignmentId: string,
  submissionId: string,
  data: GradeSubmissionDto,
  userId: string,
  role: UserRole,
) => {
  assertAssignmentManager(role);

  const assignment = await assertAssignmentAccess(assignmentId, userId, role);

  if (data.score > Number(assignment.maxScore)) {
    throw AppError.badRequest(`Score cannot exceed ${assignment.maxScore}`);
  }

  const submission = await prisma.assignmentSubmission.findFirst({
    where: {
      id: submissionId,
      assignmentId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!submission) {
    throw AppError.notFound("Submission not found");
  }

  if (
    submission.status !== SubmissionStatus.SUBMITTED &&
    submission.status !== SubmissionStatus.LATE
  ) {
    throw AppError.conflict("Only submitted assignments can be graded");
  }

  const nextStatus =
    submission.status === SubmissionStatus.LATE
      ? SubmissionStatus.LATE
      : SubmissionStatus.GRADED;

  return prisma.assignmentSubmission.update({
    where: {
      id: submissionId,
    },
    data: {
      score: data.score,
      feedback: data.feedback,
      gradedBy: userId,
      gradedAt: new Date(),
      status: nextStatus,
    },
    select: submissionSelect,
  });
};
