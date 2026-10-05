-- AlterTable
ALTER TABLE "User" ADD COLUMN     "times" TEXT[] DEFAULT ARRAY[]::TEXT[];
