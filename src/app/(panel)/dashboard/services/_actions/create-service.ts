"use server"

import { getClinicAccess } from '@/lib/clinic-access'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { getServiceLimitStatus } from '@/utils/permissions/service-limit'

const formSchema = z.object({
  name: z.string().trim().min(1, "O nome do serviço é obrigatório").max(120),
  price: z.number().int().min(1, "O preço deve ser maior que zero").max(100_000_000),
  duration: z.number().int().min(1, "A duração deve ser maior que zero").max(1440),
})

type FromSchema = z.infer<typeof formSchema>

export async function createNewService(formData: FromSchema) {
  const access = await getClinicAccess()

  if (!access || access.role !== "ADMIN") {
    return {
      error: "Falha ao cadastra serviço",
    }
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const permission = await getServiceLimitStatus(transaction, access.clinicId)
      if (!permission.hasPermission) {
        return {
          error: permission.expired
            ? "Seu período de teste expirou. Escolha um plano para cadastrar serviços."
            : `O limite de ${permission.maxServices} serviços do plano ${permission.planId} foi atingido.`,
        }
      }

      const service = await transaction.service.create({
        data: {
          name: schema.data.name,
          price: schema.data.price,
          duration: schema.data.duration,
          userId: access.clinicId,
        },
      })

      return { service }
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })

    if ("error" in result) {
      return result
    }

    revalidatePath("/dashboard/services")

    return {
      data: result.service
    }

  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2034") {
      return { error: "O limite de serviços foi atingido. Atualize a lista e tente novamente." }
    }
    console.error("Falha ao cadastrar serviço:", err)
    return {
      error: "Falha ao cadastrar serviço",
    }
  }
}