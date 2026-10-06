"use server"

import prisma from "@/lib/prisma"
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getClinicAccess } from '@/lib/clinic-access'
import { logger } from '@/lib/structured-logger'

const formSchema = z.object({
  appointmentId: z.string().min(1, "Você precisa fornecer um agendamento"),
})

type FormSchema = z.infer<typeof formSchema>;

export async function cancelAppointment(formData: FormSchema) {

  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0]?.message
    }
  }

  const access = await getClinicAccess()
  if (!access) {
    return {
      error: "Usuário não encontrado"
    }
  }


  try {

    const result = await prisma.appointment.updateMany({
      where: {
        id: formData.appointmentId,
        userId: access.clinicId,
        status: "SCHEDULED",
      },
      data: { status: "CANCELLED" },
    })

    if (result.count === 0) {
      return { error: "Agendamento não encontrado ou já cancelado." }
    }

    revalidatePath("/dashboard")

    return {
      data: "Agendamento cancelado com sucesso"
    }

  } catch (err) {
    logger.error("appointment.cancel.failed", err)
    return {
      error: "Ocorreu um erro ao cancelar este agendamento."
    }
  }




}