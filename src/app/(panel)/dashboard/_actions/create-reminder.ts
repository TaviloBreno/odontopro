"use server"

import prisma from "@/lib/prisma"
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getClinicAccess } from '@/lib/clinic-access'

const formSchema = z.object({
  description: z.string().min(1, "A descrição do lembrete é obrigatória"),
})

type FormSchema = z.infer<typeof formSchema>


export async function createReminder(formData: FormSchema) {

  const access = await getClinicAccess()
  if (!access) {
    return {
      error: "Falha ao cadastrar lembrete"
    }
  }

  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {

    await prisma.reminder.create({
      data: {
        description: formData.description,
        userId: access.clinicId
      }
    })

    revalidatePath("/dashboard")

    return {
      data: "Lembrete cadastrado com sucesso!"
    }

  } catch (err) {
    return {
      error: "Falha ao cadastrar lembrete"
    }
  }

}