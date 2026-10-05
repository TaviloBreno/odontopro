CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'COMPLETED');

ALTER TABLE "Appointment"
ADD COLUMN "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED';

ALTER TABLE "User"
ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE "User"
SET "isPublished" = "status"
WHERE "role" = 'ADMIN';
