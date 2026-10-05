"use server"

import { getClinicAccess } from '@/lib/clinic-access'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const formSchema = z.object({
  serviceId: z.string().min(1, "O id do serviço é obrigatório").max(191),
  name: z.string().trim().min(1, "O nome do serviço é obrigatório").max(120),
  price: z.number().int().min(1, "O preço deve ser maior que zero").max(100_000_000),
  duration: z.number().int().min(1, "A duração deve ser maior que zero").max(1440),
})

type FromSchema = z.infer<typeof formSchema>

export async function updateService(formData: FromSchema) {
  const access = await getClinicAccess()

  if (!access || access.role !== "ADMIN") {
    return {
      error: "Falha ao atualizar serviço",
    }
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }


  try {

    const result = await prisma.service.updateMany({
      where: {
        id: formData.serviceId,
        userId: access.clinicId,
        status: true,
      },
      data: {
        name: schema.data.name,
        price: schema.data.price,
        duration: schema.data.duration,
      }
    })

    if (result.count === 0) {
      return { error: "Serviço não encontrado nesta clínica." }
    }

    revalidatePath("/dashboard/services")

    return {
      data: "Serviço atualizado com sucesso"
    }

  } catch (err) {
    console.error("Falha ao atualizar serviço:", err)
    return {
      error: "Falha ao atualizar serviço",
    }
  }

}