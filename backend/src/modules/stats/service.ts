import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../../config/prisma";

export interface UserStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  activeUsers: number;
}

export const getUserStats = async (): Promise<UserStats> => {
  const [totalUsers, totalTeachers, totalStudents, activeUsers] =
    await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({
        where: {
          role: UserRole.TEACHER,
        },
      }),
      prisma.user.count({
        where: {
          role: UserRole.STUDENT,
        },
      }),
      prisma.user.count({
        where: {
          status: UserStatus.ACTIVE,
        },
      }),
    ]);

  return {
    totalUsers,
    totalTeachers,
    totalStudents,
    activeUsers,
  };
};
