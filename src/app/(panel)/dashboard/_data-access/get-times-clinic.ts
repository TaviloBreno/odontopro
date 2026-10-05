"use server"

import prisma from "@/lib/prisma"
import { getClinicAccess } from "@/lib/clinic-access"

export async function getTimesClinic({ userId }: { userId: string }) {
  const access = await getClinicAccess()
  if (!access || access.clinicId !== userId) {
    throw new Error("Acesso não autorizado à agenda da clínica.")
  }

  const clinic = await prisma.user.findUnique({
    where: { id: access.clinicId },
    select: { id: true, times: true },
  })

  if (!clinic) {
    throw new Error("A clínica da sessão não foi encontrada.")
  }

  return { times: clinic.times, userId: clinic.id }
}