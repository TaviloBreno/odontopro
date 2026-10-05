ALTER TABLE "Appointment"
ADD COLUMN "serviceNameAtBooking" TEXT NOT NULL DEFAULT '';

UPDATE "Appointment" AS appointment
SET "serviceNameAtBooking" = service."name"
FROM "Service" AS service
WHERE appointment."serviceId" = service."id";

ALTER TABLE "Appointment"
ALTER COLUMN "serviceNameAtBooking" DROP DEFAULT;
