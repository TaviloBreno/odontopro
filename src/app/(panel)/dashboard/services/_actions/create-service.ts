"use server"

import { getClinicAccess } from '@/lib/clinic-access'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const formSchema = z.object({
  name: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
  price: z.number().min(1, { message: "O preço do serviço é obrigatório" }),
  duration: z.number(),
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

    const newService = await prisma.service.create({
      data: {
        name: formData.name,
        price: formData.price,
        duration: formData.duration,
        userId: access.clinicId
      }
    })

    revalidatePath("/dashboard/services")

    return {
      data: newService
    }

  } catch (err) {
    console.log(err);
    return {
      error: "Falha ao cadastra serviço",
    }
  }


}