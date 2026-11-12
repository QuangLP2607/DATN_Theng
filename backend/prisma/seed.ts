import { faker } from "@faker-js/faker/locale/vi";

import { prisma } from "../src/config/prisma";

import { seedUsers } from "./seeds/users.seed";
import { seedCatalogLearning } from "./seeds/catalog-learning.seed";
import { seedClassrooms } from "./seeds/classroom.seed";
import { seedAssessment } from "./seeds/assessment.seed";
import { seedNotifications } from "./seeds/notification.seed";

async function clearDatabase() {
  console.log("Clearing database...");

  await prisma.notification.deleteMany();

  await prisma.examAnswerOption.deleteMany();
  await prisma.examAnswer.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.examQuestion.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();

  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();

  await prisma.exam.deleteMany();

  await prisma.lessonProgress.deleteMany();
  await prisma.lessonAttachment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();

  await prisma.enrollment.deleteMany();
  await prisma.classTeacher.deleteMany();
  await prisma.class.deleteMany();

  await prisma.course.deleteMany();
  await prisma.subjectGrade.deleteMany();
  await prisma.subject.deleteMany();

  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Database cleared");
}

async function main() {
  faker.seed(20261111);

  console.log("==================================");
  console.log("       EDULEARNING SEED");
  console.log("==================================");

  await clearDatabase();

  const users = await seedUsers();

  const catalog = await seedCatalogLearning(users.admin.id);

  const classrooms = await seedClassrooms(users, catalog);

  await seedAssessment(users, catalog, classrooms);

  await seedNotifications();

  console.log("==================================");
  console.log("       SEED COMPLETED");
  console.log("==================================");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
