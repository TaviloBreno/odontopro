"use server"

import prisma from "@/lib/prisma";
import { getClinicAccess } from "@/lib/clinic-access"
import { getServiceLimitStatus } from "./service-limit"

export type PLAN_PROP = "BASIC" | "PROFESSIONAL" | "PREMIUM" | "TRIAL" | "EXPIRED";
type TypeCheck = "service";

export interface ResultPermissionProp {
  hasPermission: boolean;
  planId: PLAN_PROP;
  expired: boolean;
  plan: { maxServices: number } | null;
}

interface CanPermissionProps {
  type: TypeCheck;
}

export async function canPermission({ type }: CanPermissionProps): Promise<ResultPermissionProp> {
  switch (type) {
    case "service": {
      const access = await getClinicAccess()
      if (!access || access.role !== "ADMIN") {
        return {
          hasPermission: false,
          planId: "EXPIRED",
          expired: true,
          plan: null,
        }
      }

      const permission = await getServiceLimitStatus(prisma, access.clinicId)
      const plan = permission.planId === "TRIAL" || permission.planId === "EXPIRED"
        ? null
        : { maxServices: permission.maxServices }

      return {
        hasPermission: permission.hasPermission,
        planId: permission.planId,
        expired: permission.expired,
        plan,
      }
    }

    default:
      return {
        hasPermission: false,
        planId: "EXPIRED",
        expired: true,
        plan: null,
      }
  }

}