/*
  Warnings:

  - You are about to drop the column `file_url` on the `assignment_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `chapters` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[course_id,position]` on the table `chapters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `course_id` to the `chapters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `exam_answer_options` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GradeLevel" AS ENUM ('GRADE_10', 'GRADE_11', 'GRADE_12');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "assignment_submissions" DROP CONSTRAINT "assignment_submissions_student_id_fkey";

-- DropForeignKey
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_attempts" DROP CONSTRAINT "exam_attempts_student_id_fkey";

-- DropIndex
DROP INDEX "chapters_subject_id_position_key";

-- DropIndex
DROP INDEX "chapters_subject_id_status_idx";

-- DropIndex
DROP INDEX "classes_subject_id_idx";

-- AlterTable
ALTER TABLE "assignment_submissions" DROP COLUMN "file_url",
ADD COLUMN     "file_key" VARCHAR(1000);

-- AlterTable
ALTER TABLE "chapters" DROP COLUMN "subject_id",
ADD COLUMN     "course_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "subject_id",
ADD COLUMN     "course_id" UUID NOT NULL,
ADD COLUMN     "end_at" TIMESTAMP(6),
ADD COLUMN     "max_students" INTEGER,
ADD COLUMN     "start_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "enrollments" ALTER COLUMN "joined_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "exam_answer_options" ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "exam_attempts" ALTER COLUMN "started_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
ADD COLUMN     "avatar_key" VARCHAR(500);

-- CreateTable
CREATE TABLE "subject_grades" (
    "id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "grade" "GradeLevel" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "subject_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "subject_grade_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "thumbnail_key" VARCHAR(500),
    "target_year" INTEGER,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by_id" UUID NOT NULL,
    "published_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "grade" "GradeLevel",
    "school_name" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subject_grades_grade_idx" ON "subject_grades"("grade");

-- CreateIndex
CREATE UNIQUE INDEX "subject_grades_subject_id_grade_key" ON "subject_grades"("subject_id", "grade");

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- CreateIndex
CREATE INDEX "courses_subject_grade_id_idx" ON "courses"("subject_grade_id");

-- CreateIndex
CREATE INDEX "courses_created_by_id_idx" ON "courses"("created_by_id");

-- CreateIndex
CREATE INDEX "courses_status_idx" ON "courses"("status");

-- CreateIndex
CREATE INDEX "courses_target_year_idx" ON "courses"("target_year");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_user_id_key" ON "student_profiles"("user_id");

-- CreateIndex
CREATE INDEX "assignment_submissions_status_idx" ON "assignment_submissions"("status");

-- CreateIndex
CREATE INDEX "assignments_status_idx" ON "assignments"("status");

-- CreateIndex
CREATE INDEX "chapters_course_id_status_idx" ON "chapters"("course_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_course_id_position_key" ON "chapters"("course_id", "position");

-- CreateIndex
CREATE INDEX "classes_course_id_idx" ON "classes"("course_id");

-- CreateIndex
CREATE INDEX "classes_status_idx" ON "classes"("status");

-- CreateIndex
CREATE INDEX "exam_attempts_exam_id_status_idx" ON "exam_attempts"("exam_id", "status");

-- CreateIndex
CREATE INDEX "exams_status_idx" ON "exams"("status");

-- CreateIndex
CREATE INDEX "questions_type_idx" ON "questions"("type");

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_grades" ADD CONSTRAINT "subject_grades_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_subject_grade_id_fkey" FOREIGN KEY ("subject_grade_id") REFERENCES "subject_grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
