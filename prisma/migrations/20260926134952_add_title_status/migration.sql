-- CreateEnum
CREATE TYPE "TitleStatus" AS ENUM ('PENDING', 'DONE', 'FAILED');

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "titleStatus" "TitleStatus" NOT NULL DEFAULT 'PENDING';

-- Existing links were saved with the old synchronous fetch: their outcome is already known
UPDATE "Link" SET "titleStatus" = 'DONE' WHERE "title" IS NOT NULL;
UPDATE "Link" SET "titleStatus" = 'FAILED' WHERE "title" IS NULL;
