/*
  Warnings:

  - You are about to drop the column `category` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Note` table. All the data in the column will be lost.
  - Added the required column `status` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NoteStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "category",
DROP COLUMN "tags",
ADD COLUMN     "status" "NoteStatus" NOT NULL;
