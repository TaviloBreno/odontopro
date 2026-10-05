"use server"

import { getClinicAccess } from '@/lib/clinic-access'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const formSchema = z.object({
  serviceId: z.string().min(1, "O id do serviço é obrigatório"),
})

type FromSchema = z.infer<typeof formSchema>

export async function deleteService(formData: FromSchema) {
  const access = await getClinicAccess()

  if (!access || access.role !== "ADMIN") {
    return {
      error: "Falha ao deeletar serviço",
    }
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }


  try {

    await prisma.service.update({
      where: {
        id: formData.serviceId,
        userId: access.clinicId,
      },
      data: {
        status: false
      }
    })

    revalidatePath("/dashboard/services")

    return {
      data: "Serviço deletado com sucesso"
    }


  } catch (err) {
    //console.log(err)
    return {
      error: "Falha ao deeletar serviço",
    }
  }

} 