/*
  Warnings:

  - Added the required column `subject_grade_id` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "chapter_id" UUID,
ADD COLUMN     "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "subject_grade_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "questions_subject_grade_id_idx" ON "questions"("subject_grade_id");

-- CreateIndex
CREATE INDEX "questions_chapter_id_idx" ON "questions"("chapter_id");

-- CreateIndex
CREATE INDEX "questions_difficulty_idx" ON "questions"("difficulty");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_subject_grade_id_fkey" FOREIGN KEY ("subject_grade_id") REFERENCES "subject_grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
