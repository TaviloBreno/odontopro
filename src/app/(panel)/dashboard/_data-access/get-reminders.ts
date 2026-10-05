"use server"

import prisma from '@/lib/prisma'
import { getClinicAccess } from '@/lib/clinic-access'

export async function getReminders({ userId }: { userId: string }) {
  const access = await getClinicAccess()
  if (!access || access.clinicId !== userId) {
    throw new Error("Acesso não autorizado aos lembretes da clínica.")
  }

  return prisma.reminder.findMany({
    where: { userId: access.clinicId },
    orderBy: [{ isCompleted: "asc" }, { createdAt: "desc" }],
  })
}