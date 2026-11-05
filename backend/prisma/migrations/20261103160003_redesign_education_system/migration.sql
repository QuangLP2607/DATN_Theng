/*
  Warnings:

  - You are about to drop the column `subject_id` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `selected_option_id` on the `exam_answers` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the `subject_teachers` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `class_id` on table `assignments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `class_id` on table `exams` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "assignment_submissions" DROP CONSTRAINT "assignment_submissions_student_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_class_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "subject_teachers" DROP CONSTRAINT "subject_teachers_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "subject_teachers" DROP CONSTRAINT "subject_teachers_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_answers" DROP CONSTRAINT "exam_answers_selected_option_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_attempts" DROP CONSTRAINT "exam_attempts_student_id_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_class_id_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_subject_id_fkey";

-- DropIndex
DROP INDEX "assignment_submissions_student_id_status_idx";

-- DropIndex
DROP INDEX "assignments_class_id_status_idx";

-- DropIndex
DROP INDEX "assignments_subject_id_status_idx";

-- DropIndex
DROP INDEX "classes_subject_id_status_idx";

-- DropIndex
DROP INDEX "subjects_title_idx";

-- DropIndex
DROP INDEX "enrollments_student_id_status_idx";

-- DropIndex
DROP INDEX "exam_attempts_student_id_status_idx";

-- DropIndex
DROP INDEX "exams_class_id_status_idx";

-- DropIndex
DROP INDEX "exams_subject_id_status_idx";

-- DropIndex
DROP INDEX "lesson_progress_student_id_completed_idx";

-- DropIndex
DROP INDEX "notifications_user_id_read_at_created_at_idx";

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "subject_id",
ALTER COLUMN "class_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "enrollments" ALTER COLUMN "joined_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "exam_answers" DROP COLUMN "selected_option_id";

-- AlterTable
ALTER TABLE "exam_attempts" ALTER COLUMN "started_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "exams" DROP COLUMN "subject_id",
ALTER COLUMN "class_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "file_url" VARCHAR(500);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar" SET DATA TYPE VARCHAR(500);

-- DropTable
DROP TABLE "subject_teachers";

-- CreateTable
CREATE TABLE "class_teachers" (
    "class_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "class_teachers_pkey" PRIMARY KEY ("class_id","teacher_id")
);

-- CreateTable
CREATE TABLE "exam_answer_options" (
    "answer_id" UUID NOT NULL,
    "option_id" UUID NOT NULL,

    CONSTRAINT "exam_answer_options_pkey" PRIMARY KEY ("answer_id","option_id")
);

-- CreateIndex
CREATE INDEX "class_teachers_teacher_id_idx" ON "class_teachers"("teacher_id");

-- CreateIndex
CREATE INDEX "exam_answer_options_option_id_idx" ON "exam_answer_options"("option_id");

-- CreateIndex
CREATE INDEX "assignment_submissions_student_id_idx" ON "assignment_submissions"("student_id");

-- CreateIndex
CREATE INDEX "assignments_class_id_idx" ON "assignments"("class_id");

-- CreateIndex
CREATE INDEX "chapters_subject_id_idx" ON "chapters"("subject_id");

-- CreateIndex
CREATE INDEX "classes_subject_id_idx" ON "classes"("subject_id");

-- CreateIndex
CREATE INDEX "enrollments_student_id_idx" ON "enrollments"("student_id");

-- CreateIndex
CREATE INDEX "exam_attempts_student_id_idx" ON "exam_attempts"("student_id");

-- CreateIndex
CREATE INDEX "exam_questions_question_id_idx" ON "exam_questions"("question_id");

-- CreateIndex
CREATE INDEX "exams_class_id_idx" ON "exams"("class_id");

-- CreateIndex
CREATE INDEX "lesson_progress_student_id_idx" ON "lesson_progress"("student_id");

-- CreateIndex
CREATE INDEX "lessons_chapter_id_idx" ON "lessons"("chapter_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");

-- CreateIndex
CREATE INDEX "question_options_question_id_idx" ON "question_options"("question_id");

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_teachers" ADD CONSTRAINT "class_teachers_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_teachers" ADD CONSTRAINT "class_teachers_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_answer_options" ADD CONSTRAINT "exam_answer_options_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "exam_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_answer_options" ADD CONSTRAINT "exam_answer_options_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "question_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
