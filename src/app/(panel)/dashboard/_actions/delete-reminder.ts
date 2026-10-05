"use server"

import prisma from "@/lib/prisma"
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { getClinicAccess } from '@/lib/clinic-access'

const formSchema = z.object({
  reminderId: z.string({ errorMap: () => ({ message: "O id do lembrete é obrigatório" }) }).min(1, "O id do lembrete é obrigatório"),
})

type FormSchema = z.infer<typeof formSchema>

export async function deleteReminder(formData: FormSchema) {

  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  const access = await getClinicAccess()
  if (!access) {
    return {
      error: "Você precisa entrar para excluir um lembrete."
    }
  }

  try {

    const result = await prisma.reminder.deleteMany({
      where: {
        id: formData.reminderId,
        userId: access.clinicId,
      }
    })

    if (result.count === 0) {
      return {
        error: "Lembrete não encontrado."
      }
    }

    revalidatePath("/dashboard")

    return {
      data: "Lembrete deletado com sucesso"
    }

  } catch (err) {
    console.error("Falha ao excluir lembrete:", err)
    return {
      error: "Não foi possivel deletar o lembrete."
    }
  }

}