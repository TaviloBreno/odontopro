"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { logger } from "@/lib/structured-logger"
import { getClinicAccess } from "@/lib/clinic-access"
import prisma from "@/lib/prisma"

const formSchema = z.object({
  reminderId: z.string().min(1).max(191),
  isCompleted: z.boolean(),
})

export async function setReminderCompletion(input: {
  reminderId: string
  isCompleted: boolean
}) {
  const parsed = formSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Lembrete inválido." }
  }

  const access = await getClinicAccess()
  if (!access) {
    return { error: "Você precisa entrar para atualizar um lembrete." }
  }

  try {
    const result = await prisma.reminder.updateMany({
      where: {
        id: parsed.data.reminderId,
        userId: access.clinicId,
      },
      data: { isCompleted: parsed.data.isCompleted },
    })

    if (result.count === 0) {
      return { error: "Lembrete não encontrado nesta clínica." }
    }

    revalidatePath("/dashboard")
    return {
      data: parsed.data.isCompleted ? "Lembrete concluído." : "Lembrete reaberto.",
    }
  } catch (error) {
    logger.error("reminder.completion.update.failed", error)
    return { error: "Não foi possível atualizar o lembrete." }
  }
}
