import type { Plan, Prisma, PrismaClient } from "@prisma/client"
import { addDays, isAfter } from "date-fns"
import { PLANS } from "@/utils/plans"
import { TRIAL_DAYS } from "@/utils/permissions/trial-limits"

type ServiceLimitClient = Pick<PrismaClient, "user" | "service"> | Prisma.TransactionClient
type ServicePlanId = Plan | "TRIAL" | "EXPIRED"

export interface ServiceLimitStatus {
  hasPermission: boolean
  planId: ServicePlanId
  expired: boolean
  maxServices: number
  serviceCount: number
}

export async function getServiceLimitStatus(
  database: ServiceLimitClient,
  clinicId: string,
): Promise<ServiceLimitStatus> {
  const clinic = await database.user.findUnique({
    where: { id: clinicId },
    select: {
      role: true,
      createdAt: true,
      subscription: { select: { status: true, plan: true } },
    },
  })

  if (!clinic || clinic.role !== "ADMIN") {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      maxServices: 0,
      serviceCount: 0,
    }
  }

  const subscription = clinic.subscription
  let planId: ServicePlanId
  let maxServices: number
  let expired = false

  if (subscription?.status === "active") {
    planId = subscription.plan
    maxServices = PLANS[subscription.plan].maxServices
  } else if (isAfter(new Date(), addDays(clinic.createdAt, TRIAL_DAYS))) {
    planId = "EXPIRED"
    maxServices = 0
    expired = true
  } else {
    planId = "TRIAL"
    maxServices = PLANS.BASIC.maxServices
  }

  const serviceCount = await database.service.count({
    where: { userId: clinicId, status: true },
  })

  return {
    hasPermission: !expired && serviceCount < maxServices,
    planId,
    expired,
    maxServices,
    serviceCount,
  }
}
