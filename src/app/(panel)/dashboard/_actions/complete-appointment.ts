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
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: parsed.data.appointmentId,
        userId: access.clinicId,
        status: "SCHEDULED",
      },
      select: {
        appointmentDate: true,
        time: true,
        durationAtBooking: true,
      },
    })

    if (!appointment) {
      return { error: "Agendamento não encontrado ou já tratado." }
    }

    const clinic = await prisma.user.findUnique({
      where: { id: access.clinicId },
      select: { timeZone: true },
    })
    const timeZone = clinic?.timeZone || "America/Sao_Paulo"
    const nowParts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date())
    const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
      nowParts.find((part) => part.type === type)?.value ?? ""
    const today = `${valueOf("year")}-${valueOf("month")}-${valueOf("day")}`
    const nowMinutes = Number(valueOf("hour")) * 60 + Number(valueOf("minute"))
    const appointmentDate = appointment.appointmentDate.toISOString().slice(0, 10)
    const [hour, minute] = appointment.time.split(":").map(Number)
    const appointmentEnd = hour * 60 + minute + appointment.durationAtBooking

    if (
      appointmentDate > today ||
      (appointmentDate === today && appointmentEnd > nowMinutes)
    ) {
      return { error: "Só é possível concluir um atendimento após o horário reservado." }
    }

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
