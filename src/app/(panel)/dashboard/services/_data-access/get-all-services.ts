"use server"

import prisma from "@/lib/prisma"
import { getClinicAccess } from "@/lib/clinic-access"

export async function getAllServices({ userId }: { userId: string }) {
  const access = await getClinicAccess()
  if (!access || access.role !== "ADMIN" || access.clinicId !== userId) {
    throw new Error("Acesso não autorizado aos serviços da clínica.")
  }

  const services = await prisma.service.findMany({
    where: {
      userId: access.clinicId,
      status: true
    },
    orderBy: { createdAt: "desc" },
  })

  return { data: services }
}