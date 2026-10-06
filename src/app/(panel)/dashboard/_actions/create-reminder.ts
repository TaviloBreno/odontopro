"use server"

import prisma from "@/lib/prisma"
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getClinicAccess } from '@/lib/clinic-access'
import { logger } from '@/lib/structured-logger'

const formSchema = z.object({
  description: z.string().trim().min(1, "A descrição do lembrete é obrigatória").max(500),
})

type FormSchema = z.infer<typeof formSchema>


export async function createReminder(formData: FormSchema) {

  const access = await getClinicAccess()
  if (!access) {
    return {
      error: "Você precisa entrar para cadastrar um lembrete."
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
        description: schema.data.description,
        userId: access.clinicId
      }
    })

    revalidatePath("/dashboard")

    return {
      data: "Lembrete cadastrado com sucesso!"
    }

  } catch (err) {
    logger.error("reminder.create.failed", err)
    return {
      error: "Falha ao cadastrar lembrete"
    }
  }

}