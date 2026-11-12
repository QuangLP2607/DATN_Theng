import { faker } from "@faker-js/faker/locale/vi";

import { prisma } from "../../src/config/prisma";

import type { seedUsers } from "./users.seed";
import type { seedCatalogLearning } from "./catalog-learning.seed";

type Users = Awaited<ReturnType<typeof seedUsers>>;
type Catalog = Awaited<ReturnType<typeof seedCatalogLearning>>;

const STUDENTS_PER_CLASS = 12;
const CLASSES_PER_COURSE = 2;

export async function seedClassrooms(users: Users, catalog: Catalog) {
  const { teachers, students } = users;
  const { courses, chapters, lessons } = catalog;

  if (students.length < STUDENTS_PER_CLASS * CLASSES_PER_COURSE) {
    throw new Error(
      `Cần ít nhất ${STUDENTS_PER_CLASS * CLASSES_PER_COURSE} học sinh để tạo hai lớp không trùng nhau.`,
    );
  }

  if (teachers.length === 0) {
    throw new Error("Không có giáo viên để phân công lớp học.");
  }

  const classes = [];

  const now = new Date();

  const startAt = new Date(now);
  startAt.setDate(startAt.getDate() - 30);

  const endAt = new Date(now);
  endAt.setDate(endAt.getDate() + 180);

  for (const [courseIndex, course] of courses.entries()) {
    const courseChapters = chapters.filter(
      (chapter) => chapter.courseId === course.id,
    );

    const chapterIds = new Set(courseChapters.map((chapter) => chapter.id));

    const courseLessons = lessons.filter((lesson) =>
      chapterIds.has(lesson.chapterId),
    );

    for (let groupIndex = 0; groupIndex < CLASSES_PER_COURSE; groupIndex++) {
      const groupLabel = groupIndex === 0 ? "A" : "B";

      const teacher =
        teachers[
          (courseIndex * CLASSES_PER_COURSE + groupIndex) % teachers.length
        ];

      const classRecord = await prisma.class.create({
        data: {
          courseId: course.id,
          name: `${course.title} - Lớp ${groupLabel}`,
          code: `C-${course.code}-${groupLabel}`,
          status: "ACTIVE",
          maxStudents: 40,
          startAt,
          endAt,
        },
      });

      await prisma.classTeacher.create({
        data: {
          classId: classRecord.id,
          teacherId: teacher.id,
        },
      });

      // Chọn 12 học sinh riêng cho mỗi lớp trong cùng Course.
      const studentStartIndex =
        (courseIndex * STUDENTS_PER_CLASS * CLASSES_PER_COURSE +
          groupIndex * STUDENTS_PER_CLASS) %
        students.length;

      const enrolledStudents = Array.from(
        { length: STUDENTS_PER_CLASS },
        (_, index) => students[(studentStartIndex + index) % students.length],
      );

      // Đảm bảo không có học sinh trùng trong cùng một lớp.
      const uniqueStudentIds = new Set(
        enrolledStudents.map((student) => student.id),
      );

      if (uniqueStudentIds.size !== enrolledStudents.length) {
        throw new Error(`Học sinh bị trùng trong lớp ${classRecord.code}.`);
      }

      await prisma.enrollment.createMany({
        data: enrolledStudents.map((student) => ({
          classId: classRecord.id,
          studentId: student.id,
          status: "ACTIVE",
        })),
      });

      // Tạo tiến độ học tập cho từng học sinh và bài học.
      const progressData = enrolledStudents.flatMap((student) =>
        courseLessons.map((lesson) => {
          const progress = faker.helpers.arrayElement([
            0, 20, 35, 50, 65, 80, 100,
          ]);

          const completed = progress === 100;

          return {
            lessonId: lesson.id,
            studentId: student.id,
            progress,
            completed,
            completedAt: completed ? faker.date.recent({ days: 10 }) : null,
          };
        }),
      );

      await prisma.lessonProgress.createMany({
        data: progressData,
        skipDuplicates: true,
      });

      classes.push({
        ...classRecord,
        teacherId: teacher.id,
        students: enrolledStudents,
      });
    }
  }

  console.log("✓ Classrooms:", {
    classes: classes.length,
    enrollments: classes.reduce(
      (total, classRecord) => total + classRecord.students.length,
      0,
    ),
  });

  return {
    classes,
  };
}
