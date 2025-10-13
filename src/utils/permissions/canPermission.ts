"use server"

import { auth } from "@/lib/auth";
import { PlanDetailInfo } from "./get-plans";
import { canCreateService } from "./canCreateService";

export type PLAN_PROP = "BASIC" | "PROFESSIONAL" | "TRIAL" | "EXPIRED";
type TypeCheck = "service";

export interface ResultPermissionProp {
  hasPermission: boolean;
  planId: PLAN_PROP;
  expired: boolean;
  plan: PlanDetailInfo | null;
}

interface CanPermissionProps {
  type: TypeCheck;
}

export async function canPermission({ type }: CanPermissionProps): Promise<ResultPermissionProp> {

  const session = await auth();

  if (!session?.user?.id) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    }
  }

  // Verificar se DATABASE_URL está configurada
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  DATABASE_URL não configurada - usando permissões fictícias");
    // Retornar permissões padrão para desenvolvimento
    return {
      hasPermission: true,
      planId: "PROFESSIONAL",
      expired: false,
      plan: {
        maxServices: 999
      }
    }
  }

  // Se DATABASE_URL estiver configurada, usar Prisma
  try {
    const prisma = (await import("@/lib/prisma")).default;
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session?.user?.id
      }
    });

    switch (type) {
      case "service":
        const permission = await canCreateService(subscription, session)
        return permission;

      default:
        return {
          hasPermission: false,
          planId: "EXPIRED",
          expired: true,
          plan: null,
        }
    }
  } catch (error) {
    console.error("❌ Erro ao acessar banco de dados:", error);
    // Fallback em caso de erro no banco
    return {
      hasPermission: true,
      planId: "PROFESSIONAL",
      expired: false,
      plan: {
        maxServices: 999
      }
    }
  }
}