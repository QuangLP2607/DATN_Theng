import { AbilityBuilder } from "@casl/ability";
import { UserRole } from "../../../generated/prisma/enums";

import { AccessAction } from "../actions";
import { createPrismaAbility } from "../casl-prisma";
import type { AppAbility } from "../casl-prisma";

interface AbilityUser {
  id: string;
  role: UserRole;
}

export const defineAbilityFor = (user: AbilityUser): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

  // ============================================================
  // USER: Own profile
  // ============================================================

  can(AccessAction.READ, "User", {
    id: user.id,
  });

  can(AccessAction.UPDATE, "User", {
    id: user.id,
  });

  // ============================================================
  // ADMIN: Full access
  // ============================================================

  if (user.role === UserRole.ADMIN) {
    can(AccessAction.CREATE, "all");
    can(AccessAction.READ, "all");
    can(AccessAction.UPDATE, "all");
    can(AccessAction.DELETE, "all");

    return build();
  }

  // ============================================================
  // TEACHER
  // ============================================================

  if (user.role === UserRole.TEACHER) {
    // Read assigned active classes.
    can(AccessAction.READ, "Class", {
      status: "ACTIVE",
      teachers: {
        some: {
          teacherId: user.id,
        },
      },
    });

    // Read enrollments in classes assigned to this teacher.
    can(AccessAction.READ, "Enrollment", {
      class: {
        is: {
          status: "ACTIVE",
          teachers: {
            some: {
              teacherId: user.id,
            },
          },
        },
      },
    });

    // Read courses containing an active class assigned to this teacher.
    can(AccessAction.READ, "Course", {
      classes: {
        some: {
          status: "ACTIVE",
          teachers: {
            some: {
              teacherId: user.id,
            },
          },
        },
      },
    });

    // Read subject grades containing accessible courses.
    can(AccessAction.READ, "SubjectGrade", {
      courses: {
        some: {
          classes: {
            some: {
              status: "ACTIVE",
              teachers: {
                some: {
                  teacherId: user.id,
                },
              },
            },
          },
        },
      },
    });

    // Read subjects containing accessible subject grades.
    can(AccessAction.READ, "Subject", {
      subjectGrades: {
        some: {
          courses: {
            some: {
              classes: {
                some: {
                  status: "ACTIVE",
                  teachers: {
                    some: {
                      teacherId: user.id,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Read chapters belonging to accessible courses.
    can(AccessAction.READ, "Chapter", {
      course: {
        is: {
          classes: {
            some: {
              status: "ACTIVE",
              teachers: {
                some: {
                  teacherId: user.id,
                },
              },
            },
          },
        },
      },
    });

    // Read lessons belonging to accessible chapters.
    can(AccessAction.READ, "Lesson", {
      chapter: {
        is: {
          course: {
            is: {
              classes: {
                some: {
                  status: "ACTIVE",
                  teachers: {
                    some: {
                      teacherId: user.id,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // ============================================================
  // STUDENT
  // ============================================================

  if (user.role === UserRole.STUDENT) {
    // Read classes the student is actively enrolled in.
    can(AccessAction.READ, "Class", {
      status: "ACTIVE",
      enrollments: {
        some: {
          studentId: user.id,
          status: "ACTIVE",
        },
      },
    });

    // Read own enrollments.
    can(AccessAction.READ, "Enrollment", {
      studentId: user.id,
    });

    // Read courses containing an active class the student joined.
    can(AccessAction.READ, "Course", {
      classes: {
        some: {
          status: "ACTIVE",
          enrollments: {
            some: {
              studentId: user.id,
              status: "ACTIVE",
            },
          },
        },
      },
    });

    // Read subject grades containing accessible courses.
    can(AccessAction.READ, "SubjectGrade", {
      courses: {
        some: {
          classes: {
            some: {
              status: "ACTIVE",
              enrollments: {
                some: {
                  studentId: user.id,
                  status: "ACTIVE",
                },
              },
            },
          },
        },
      },
    });

    // Read subjects containing accessible subject grades.
    can(AccessAction.READ, "Subject", {
      subjectGrades: {
        some: {
          courses: {
            some: {
              classes: {
                some: {
                  status: "ACTIVE",
                  enrollments: {
                    some: {
                      studentId: user.id,
                      status: "ACTIVE",
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Read published chapters belonging to accessible courses.
    can(AccessAction.READ, "Chapter", {
      status: "PUBLISHED",
      course: {
        is: {
          classes: {
            some: {
              status: "ACTIVE",
              enrollments: {
                some: {
                  studentId: user.id,
                  status: "ACTIVE",
                },
              },
            },
          },
        },
      },
    });

    // Read published lessons in published chapters.
    can(AccessAction.READ, "Lesson", {
      status: "PUBLISHED",
      chapter: {
        is: {
          status: "PUBLISHED",
          course: {
            is: {
              classes: {
                some: {
                  status: "ACTIVE",
                  enrollments: {
                    some: {
                      studentId: user.id,
                      status: "ACTIVE",
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  return build();
};
