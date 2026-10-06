ALTER TYPE "UserRole" ADD VALUE 'CLIENT';
ALTER TYPE "UserRole" ADD VALUE 'PLATFORM_ADMIN';

CREATE TABLE "PlatformPlan" (
    "key" "Plan" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monthlyPriceCents" INTEGER NOT NULL,
    "previousPriceCents" INTEGER,
    "features" TEXT[],
    "stripePriceId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformPlan_pkey" PRIMARY KEY ("key")
);

UPDATE "PlatformPlan" SET "features" = ARRAY[]::TEXT[] WHERE "features" IS NULL;
ALTER TABLE "PlatformPlan" ALTER COLUMN "features" SET NOT NULL;

ALTER TABLE "Appointment" ADD COLUMN "clientUserId" TEXT;

CREATE INDEX "Appointment_clientUserId_appointmentDate_idx"
ON "Appointment"("clientUserId", "appointmentDate");

ALTER TABLE "Appointment"
ADD CONSTRAINT "Appointment_clientUserId_fkey"
FOREIGN KEY ("clientUserId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
