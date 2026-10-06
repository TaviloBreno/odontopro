"use server"

import { Plan } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getPlatformAdminAccess } from "@/lib/current-user-access"
import { logger } from "@/lib/structured-logger"
import prisma from "@/lib/prisma"

const planSchema = z.object({
  key: z.nativeEnum(Plan),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(300),
  monthlyPriceCents: z.number().int().min(0).max(100_000_000),
  previousPriceCents: z.number().int().min(0).max(100_000_000).nullable(),
  features: z.array(z.string().trim().min(1).max(160)).min(1).max(20),
  stripePriceId: z.string().trim().max(191).nullable(),
  active: z.boolean(),
})

export async function savePlatformPlan(input: unknown) {
  const access = await getPlatformAdminAccess()
  if (!access) return { error: "Acesso restrito ao administrador da plataforma." }

  const parsed = planSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revise os dados do plano." }
  }

  try {
    await prisma.platformPlan.upsert({
      where: { key: parsed.data.key },
      create: parsed.data,
      update: parsed.data,
    })
    revalidatePath("/platform/plans")
    revalidatePath("/dashboard/plans")
    return { data: "Plano comercial salvo." }
  } catch (error) {
    logger.error("platform.plan.save.failed", error)
    return { error: "Não foi possível salvar o plano comercial." }
  }
}
