/*
  Warnings:

  - The values [SCHEDULED,PUBLISHED] on the enum `NoteStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NoteStatus_new" AS ENUM ('DRAFT', 'ACTIVE');
ALTER TABLE "Note" ALTER COLUMN "status" TYPE "NoteStatus_new" USING ("status"::text::"NoteStatus_new");
ALTER TYPE "NoteStatus" RENAME TO "NoteStatus_old";
ALTER TYPE "NoteStatus_new" RENAME TO "NoteStatus";
DROP TYPE "NoteStatus_old";
COMMIT;
