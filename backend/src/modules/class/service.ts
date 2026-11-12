import { Prisma } from "../../generated/prisma/client";
import {
  ClassStatus,
  EnrollmentStatus,
  UserRole,
  UserStatus,
} from "../../generated/prisma/enums";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import { handlePrismaError } from "../../core/prisma-error";

import type { Pagination } from "../../utils/zod";

import { AccessAction } from "../access/actions";
import { accessibleBy } from "../access/casl-prisma";
import type { AppAbility } from "../access/casl-prisma";

import type { ListClassesQueryDto } from "./dto/listClasses";
import type { CreateClassDto } from "./dto/createClass";
import type { UpdateClassDto } from "./dto/updateClass";

/*
 * -------------------- SELECT --------------------
 */

const classSelect = {
  id: true,
  courseId: true,
  name: true,
  code: true,
  status: true,
  maxStudents: true,
  startAt: true,
  endAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ClassSelect;

export type ClassResponse = Prisma.ClassGetPayload<{
  select: typeof classSelect;
}>;

const classListSelect = {
  ...classSelect,

  course: {
    select: {
      id: true,
      title: true,
      code: true,
      status: true,
    },
  },

  _count: {
    select: {
      teachers: true,
      enrollments: {
        where: {
          status: EnrollmentStatus.ACTIVE,
        },
      },
    },
  },
} satisfies Prisma.ClassSelect;

export type ClassListItemResponse = Prisma.ClassGetPayload<{
  select: typeof classListSelect;
}>;

const classDetailSelect = {
  ...classListSelect,

  teachers: {
    orderBy: {
      createdAt: "desc",
    },

    select: {
      createdAt: true,

      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      },
    },
  },
} satisfies Prisma.ClassSelect;

export type ClassDetailResponse = Prisma.ClassGetPayload<{
  select: typeof classDetailSelect;
}>;

const classStudentSelect = {
  id: true,
  status: true,
  joinedAt: true,

  student: {
    select: {
      id: true,
      name: true,
      email: true,
      status: true,

      studentProfile: {
        select: {
          grade: true,
          schoolName: true,
        },
      },
    },
  },
} satisfies Prisma.EnrollmentSelect;

export type ClassStudentResponse = Prisma.EnrollmentGetPayload<{
  select: typeof classStudentSelect;
}>;

/*
 * -------------------- ACCESS --------------------
 */

const getClassAccessWhere = (
  ability: AppAbility,
  action: AccessAction,
): Prisma.ClassWhereInput => {
  return accessibleBy(ability, action).ofType("Class");
};

const getEnrollmentAccessWhere = (
  ability: AppAbility,
): Prisma.EnrollmentWhereInput => {
  return accessibleBy(ability, AccessAction.READ).ofType("Enrollment");
};

const assertClassAccess = (ability: AppAbility, action: AccessAction): void => {
  if (!ability.can(action, "Class")) {
    throw AppError.forbidden("You do not have permission to manage classes");
  }
};

/*
 * -------------------- PAGINATION --------------------
 */

export interface GetClassesResponse {
  classes: ClassListItemResponse[];
  pagination: Pagination;
}

export interface GetClassStudentsResponse {
  students: ClassStudentResponse[];
}

/*
 * -------------------- VALIDATION --------------------
 */

const validateClassDates = (
  startAt?: Date | null,
  endAt?: Date | null,
): void => {
  if (startAt && endAt && startAt > endAt) {
    throw AppError.badRequest("Class end date must be after start date");
  }
};

const validateClassCapacity = async (
  classId: string,
  maxStudents: number | null,
): Promise<void> => {
  if (maxStudents === null) {
    return;
  }

  const activeStudents = await prisma.enrollment.count({
    where: {
      classId,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  if (maxStudents < activeStudents) {
    throw AppError.conflict(
      "Maximum students cannot be lower than current active enrollments",
    );
  }
};

const getAccessibleClass = async (
  ability: AppAbility,
  id: string,
  action: AccessAction,
) => {
  const accessWhere = getClassAccessWhere(ability, action);

  const classItem = await prisma.class.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
    select: {
      id: true,
      status: true,
      maxStudents: true,
    },
  });

  if (!classItem) {
    throw AppError.notFound("Class not found");
  }

  return classItem;
};

/*
 * -------------------- LIST CLASSES --------------------
 */

export const getClasses = async (
  ability: AppAbility,
  query: ListClassesQueryDto,
): Promise<GetClassesResponse> => {
  const { page, limit, search, courseId, status, sortBy, order } = query;

  const accessWhere = getClassAccessWhere(ability, AccessAction.READ);

  const conditions: Prisma.ClassWhereInput[] = [accessWhere];

  if (courseId) {
    conditions.push({ courseId });
  }

  if (status) {
    conditions.push({ status });
  }

  if (search) {
    conditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          code: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const where: Prisma.ClassWhereInput = {
    AND: conditions,
  };

  const skip = (page - 1) * limit;

  const orderBy: Prisma.ClassOrderByWithRelationInput = {
    [sortBy]: order,
  };

  const [classes, total] = await prisma.$transaction([
    prisma.class.findMany({
      where,
      select: classListSelect,
      orderBy: [orderBy, { id: "asc" }],
      skip,
      take: limit,
    }),

    prisma.class.count({ where }),
  ]);

  return {
    classes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/*
 * -------------------- GET CLASS BY ID --------------------
 */

export const getClassById = async (
  ability: AppAbility,
  id: string,
): Promise<ClassDetailResponse> => {
  const accessWhere = getClassAccessWhere(ability, AccessAction.READ);

  const classItem = await prisma.class.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
    select: classDetailSelect,
  });

  if (!classItem) {
    throw AppError.notFound("Class not found");
  }

  return classItem;
};

/*
 * -------------------- CREATE CLASS --------------------
 */

export const createClass = async (
  ability: AppAbility,
  input: CreateClassDto,
): Promise<ClassResponse> => {
  assertClassAccess(ability, AccessAction.CREATE);

  validateClassDates(input.startAt, input.endAt);

  const course = await prisma.course.findUnique({
    where: {
      id: input.courseId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw AppError.notFound("Course not found");
  }

  try {
    return await prisma.class.create({
      data: {
        courseId: input.courseId,
        name: input.name,
        code: input.code,
        maxStudents: input.maxStudents,
        startAt: input.startAt,
        endAt: input.endAt,
        status: ClassStatus.ACTIVE,
      },
      select: classSelect,
    });
  } catch (error) {
    return handlePrismaError(error, {
      uniqueFieldMessages: {
        code: "Mã lớp học đã tồn tại.",
      },
      uniqueConflictMessage: "Thông tin lớp học đã tồn tại.",
    });
  }
};

/*
 * -------------------- UPDATE CLASS --------------------
 */

export const updateClass = async (
  ability: AppAbility,
  id: string,
  input: UpdateClassDto,
): Promise<ClassResponse> => {
  assertClassAccess(ability, AccessAction.UPDATE);

  const accessWhere = getClassAccessWhere(ability, AccessAction.UPDATE);

  const existingClass = await prisma.class.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
    select: {
      id: true,
      startAt: true,
      endAt: true,
    },
  });

  if (!existingClass) {
    throw AppError.notFound("Class not found");
  }

  const startAt =
    input.startAt !== undefined ? input.startAt : existingClass.startAt;

  const endAt = input.endAt !== undefined ? input.endAt : existingClass.endAt;

  validateClassDates(startAt, endAt);

  if (input.maxStudents !== undefined) {
    await validateClassCapacity(id, input.maxStudents);
  }

  try {
    const result = await prisma.class.updateMany({
      where: {
        AND: [{ id }, accessWhere],
      },
      data: input,
    });

    if (result.count !== 1) {
      throw AppError.notFound("Class not found");
    }

    const updatedClass = await prisma.class.findFirst({
      where: {
        AND: [{ id }, accessWhere],
      },
      select: classSelect,
    });

    if (!updatedClass) {
      throw AppError.notFound("Class not found");
    }

    return updatedClass;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    return handlePrismaError(error, {
      uniqueFieldMessages: {
        code: "Mã lớp học đã tồn tại.",
      },
      uniqueConflictMessage: "Thông tin lớp học đã tồn tại.",
    });
  }
};

/*
 * -------------------- DELETE CLASS --------------------
 */

export const deleteClass = async (
  ability: AppAbility,
  id: string,
): Promise<void> => {
  assertClassAccess(ability, AccessAction.DELETE);

  const accessWhere = getClassAccessWhere(ability, AccessAction.DELETE);

  const classItem = await prisma.class.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
    select: {
      id: true,

      _count: {
        select: {
          enrollments: true,
          assignments: true,
          exams: true,
        },
      },
    },
  });

  if (!classItem) {
    throw AppError.notFound("Class not found");
  }

  if (classItem._count.enrollments > 0) {
    throw AppError.conflict(
      "Cannot delete a class that has student enrollments",
    );
  }

  if (classItem._count.assignments > 0 || classItem._count.exams > 0) {
    throw AppError.conflict(
      "Please delete all assignments and exams before deleting this class",
    );
  }

  await prisma.class.deleteMany({
    where: {
      AND: [{ id }, accessWhere],
    },
  });
};

/*
 * -------------------- GET CLASS TEACHERS --------------------
 */

export const getClassTeachers = async (
  ability: AppAbility,
  classId: string,
) => {
  await getAccessibleClass(ability, classId, AccessAction.READ);

  return prisma.classTeacher.findMany({
    where: {
      classId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,

      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      },
    },
  });
};

/*
 * -------------------- ASSIGN TEACHER --------------------
 */

export const assignTeacher = async (
  ability: AppAbility,
  classId: string,
  teacherId: string,
) => {
  assertClassAccess(ability, AccessAction.UPDATE);

  await getAccessibleClass(ability, classId, AccessAction.UPDATE);

  const teacher = await prisma.user.findFirst({
    where: {
      id: teacherId,
      role: UserRole.TEACHER,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
    },
  });

  if (!teacher) {
    throw AppError.notFound("Active teacher not found");
  }

  try {
    return await prisma.classTeacher.create({
      data: {
        classId,
        teacherId,
      },
      select: {
        classId: true,
        teacherId: true,
        createdAt: true,

        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    return handlePrismaError(error, {
      uniqueConflictMessage: "Giáo viên đã được phân công vào lớp này.",
    });
  }
};

/*
 * -------------------- REMOVE TEACHER --------------------
 */

export const removeTeacher = async (
  ability: AppAbility,
  classId: string,
  teacherId: string,
): Promise<void> => {
  assertClassAccess(ability, AccessAction.UPDATE);

  await getAccessibleClass(ability, classId, AccessAction.UPDATE);

  const result = await prisma.classTeacher.deleteMany({
    where: {
      classId,
      teacherId,
    },
  });

  if (result.count === 0) {
    throw AppError.notFound("Teacher assignment not found");
  }
};

/*
 * -------------------- GET CLASS STUDENTS --------------------
 */

export const getClassStudents = async (
  ability: AppAbility,
  classId: string,
): Promise<GetClassStudentsResponse> => {
  await getAccessibleClass(ability, classId, AccessAction.READ);

  const enrollmentAccessWhere = getEnrollmentAccessWhere(ability);

  const students = await prisma.enrollment.findMany({
    where: {
      AND: [
        {
          classId,
        },
        enrollmentAccessWhere,
      ],
    },
    orderBy: {
      joinedAt: "desc",
    },
    select: classStudentSelect,
  });

  return { students };
};

/*
 * -------------------- ENROLL STUDENT --------------------
 */

export const enrollStudent = async (
  ability: AppAbility,
  classId: string,
  studentId: string,
) => {
  assertClassAccess(ability, AccessAction.UPDATE);

  const classItem = await getAccessibleClass(
    ability,
    classId,
    AccessAction.UPDATE,
  );

  const student = await prisma.user.findFirst({
    where: {
      id: studentId,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    throw AppError.notFound("Active student not found");
  }

  if (classItem.status !== ClassStatus.ACTIVE) {
    throw AppError.conflict("Cannot enroll students in an inactive class");
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      classId_studentId: {
        classId,
        studentId,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (existingEnrollment) {
    throw AppError.conflict("Student is already enrolled in this class");
  }

  if (classItem.maxStudents !== null) {
    const activeStudents = await prisma.enrollment.count({
      where: {
        classId,
        status: EnrollmentStatus.ACTIVE,
      },
    });

    if (activeStudents >= classItem.maxStudents) {
      throw AppError.conflict("Class has reached its maximum capacity");
    }
  }

  return prisma.enrollment.create({
    data: {
      classId,
      studentId,
      status: EnrollmentStatus.ACTIVE,
    },
    select: {
      id: true,
      classId: true,
      studentId: true,
      status: true,
      joinedAt: true,
    },
  });
};

/*
 * -------------------- UPDATE ENROLLMENT --------------------
 */

export const updateEnrollment = async (
  ability: AppAbility,
  classId: string,
  studentId: string,
  status: EnrollmentStatus,
) => {
  assertClassAccess(ability, AccessAction.UPDATE);

  const classItem = await getAccessibleClass(
    ability,
    classId,
    AccessAction.UPDATE,
  );

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      classId_studentId: {
        classId,
        studentId,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!enrollment) {
    throw AppError.notFound("Enrollment not found");
  }

  if (
    status === EnrollmentStatus.ACTIVE &&
    enrollment.status !== EnrollmentStatus.ACTIVE
  ) {
    if (classItem.status !== ClassStatus.ACTIVE) {
      throw AppError.conflict(
        "Cannot activate enrollment in an inactive class",
      );
    }

    if (classItem.maxStudents !== null) {
      const activeStudents = await prisma.enrollment.count({
        where: {
          classId,
          status: EnrollmentStatus.ACTIVE,
        },
      });

      if (activeStudents >= classItem.maxStudents) {
        throw AppError.conflict("Class has reached its maximum capacity");
      }
    }
  }

  return prisma.enrollment.update({
    where: {
      classId_studentId: {
        classId,
        studentId,
      },
    },
    data: {
      status,
    },
    select: {
      id: true,
      classId: true,
      studentId: true,
      status: true,
      joinedAt: true,
      updatedAt: true,
    },
  });
};

/*
 * -------------------- REMOVE STUDENT --------------------
 */

export const removeStudent = async (
  ability: AppAbility,
  classId: string,
  studentId: string,
): Promise<void> => {
  assertClassAccess(ability, AccessAction.UPDATE);

  await getAccessibleClass(ability, classId, AccessAction.UPDATE);

  const result = await prisma.enrollment.deleteMany({
    where: {
      classId,
      studentId,
    },
  });

  if (result.count === 0) {
    throw AppError.notFound("Enrollment not found");
  }
};
