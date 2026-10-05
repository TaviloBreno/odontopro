ALTER TABLE "Appointment"
ADD COLUMN "managementTokenHash" TEXT;

CREATE UNIQUE INDEX "Appointment_managementTokenHash_key"
ON "Appointment"("managementTokenHash");
