/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `subjects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "thumbnail",
ADD COLUMN     "code" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");
