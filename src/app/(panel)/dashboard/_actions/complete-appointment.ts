"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getClinicAccess } from "@/lib/clinic-access"
import prisma from "@/lib/prisma"

const formSchema = z.object({
  appointmentId: z.string().min(1).max(191),
})

export async function completeAppointment(input: { appointmentId: string }) {
  const parsed = formSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Agendamento inválido." }
  }

  const access = await getClinicAccess()
  if (!access) {
    return { error: "Você precisa entrar para atualizar o agendamento." }
  }

  try {
    const result = await prisma.appointment.updateMany({
      where: {
        id: parsed.data.appointmentId,
        userId: access.clinicId,
        status: "SCHEDULED",
      },
      data: { status: "COMPLETED" },
    })

    if (result.count === 0) {
      return { error: "Agendamento não encontrado ou já tratado." }
    }

    revalidatePath("/dashboard")
    return { data: "Agendamento marcado como concluído." }
  } catch (error) {
    console.error("Falha ao concluir agendamento:", error)
    return { error: "Não foi possível concluir o agendamento." }
  }
}
