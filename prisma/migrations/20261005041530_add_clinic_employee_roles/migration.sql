-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EMPLOYEE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clinicOwnerId" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ADMIN';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clinicOwnerId_fkey" FOREIGN KEY ("clinicOwnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
