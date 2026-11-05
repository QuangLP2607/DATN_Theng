/*
  Warnings:

  - You are about to alter the column `title` on the `subjects` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `description` on the `subjects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `code` on the `subjects` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "icon" VARCHAR(100) NOT NULL DEFAULT 'solar:book-2-linear',
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "code" SET DATA TYPE VARCHAR(20);
