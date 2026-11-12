import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker/locale/vi";

import { prisma } from "../../src/config/prisma";

const DEFAULT_PASSWORD = "123456";

export async function seedUsers() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  const now = new Date();

  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      passwordHash,
      name: "Quản trị viên",
      role: "ADMIN",
      status: "ACTIVE",
      emailVerifiedAt: now,
    },
  });

  const teachers = await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      prisma.user.create({
        data: {
          email: `teacher${String(index + 1).padStart(2, "0")}@gmail.com`,
          passwordHash,
          name: faker.person.fullName(),
          role: "TEACHER",
          status: "ACTIVE",
          emailVerifiedAt: now,
        },
      }),
    ),
  );

  const students = await Promise.all(
    Array.from({ length: 30 }, (_, index) =>
      prisma.user.create({
        data: {
          email: `student${String(index + 1).padStart(2, "0")}@gmail.com`,
          passwordHash,
          name: faker.person.fullName(),
          role: "STUDENT",
          status: "ACTIVE",
          emailVerifiedAt: now,
        },
      }),
    ),
  );

  await prisma.studentProfile.createMany({
    data: students.map((student, index) => ({
      userId: student.id,
      grade: (["GRADE_10", "GRADE_11", "GRADE_12"] as const)[index % 3],
      schoolName: faker.helpers.arrayElement([
        "THPT Nguyễn Trãi",
        "THPT Chu Văn An",
        "THPT Kim Liên",
        "THPT Yên Hòa",
        "THPT Việt Đức",
        "THPT Lê Quý Đôn",
      ]),
    })),
  });

  console.log("✓ Users:", {
    admin: 1,
    teachers: teachers.length,
    students: students.length,
  });

  return {
    admin,
    teachers,
    students,
  };
}
