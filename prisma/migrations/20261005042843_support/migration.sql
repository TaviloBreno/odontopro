-- AlterEnum
ALTER TYPE "Plan" ADD VALUE 'PREMIUM';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;
