ALTER TABLE "Appointment"
ADD COLUMN "priceAtBooking" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "durationAtBooking" INTEGER NOT NULL DEFAULT 0;

UPDATE "Appointment" AS appointment
SET
  "priceAtBooking" = service."price",
  "durationAtBooking" = service."duration"
FROM "Service" AS service
WHERE appointment."serviceId" = service."id";

ALTER TABLE "Appointment"
ALTER COLUMN "priceAtBooking" DROP DEFAULT,
ALTER COLUMN "durationAtBooking" DROP DEFAULT;

ALTER TABLE "Reminder"
ADD COLUMN "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE;
