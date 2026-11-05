/*
  Warnings:

  - You are about to drop the column `file_url` on the `lessons` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LessonAttachmentType" AS ENUM ('FILE', 'LINK');

-- DropIndex
DROP INDEX "chapters_subject_id_idx";

-- DropIndex
DROP INDEX "lessons_chapter_id_idx";

-- AlterTable
ALTER TABLE "chapters" ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "file_url",
ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "lesson_attachments" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "LessonAttachmentType" NOT NULL,
    "storage_key" VARCHAR(1000),
    "file_name" VARCHAR(255),
    "mime_type" VARCHAR(100),
    "size" INTEGER,
    "external_url" VARCHAR(1000),
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "lesson_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_attachments_lesson_id_idx" ON "lesson_attachments"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_attachments_lesson_id_position_key" ON "lesson_attachments"("lesson_id", "position");

-- CreateIndex
CREATE INDEX "chapters_subject_id_status_idx" ON "chapters"("subject_id", "status");

-- CreateIndex
CREATE INDEX "lessons_chapter_id_status_idx" ON "lessons"("chapter_id", "status");

-- AddForeignKey
ALTER TABLE "lesson_attachments" ADD CONSTRAINT "lesson_attachments_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
