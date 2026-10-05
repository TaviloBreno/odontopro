"use server"

import { getClinicAccess } from "@/lib/clinic-access"
import prisma from "@/lib/prisma"
import { addDays } from "date-fns"

export async function getClinicReport() {
  const access = await getClinicAccess()
  if (!access || access.role !== "ADMIN") {
    throw new Error("Acesso não autorizado aos relatórios da clínica.")
  }

  const clinic = await prisma.user.findUnique({
    where: { id: access.clinicId },
    select: {
      createdAt: true,
      timeZone: true,
      subscription: { select: { status: true, plan: true } },
    },
  })

  if (!clinic) return null

  const subscription = clinic?.subscription
  const trialActive = new Date() <= addDays(clinic.createdAt, 3)
  if (subscription?.status !== "active" && !trialActive) {
    return null
  }

  const nowParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: clinic.timeZone || "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date())
  const year = Number(nowParts.find((part) => part.type === "year")?.value)
  const month = Number(nowParts.find((part) => part.type === "month")?.value)
  const monthStart = new Date(Date.UTC(year, month - 1, 1))
  const nextMonth = new Date(Date.UTC(year, month, 1))

  const [appointments, activeServices] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        userId: access.clinicId,
        appointmentDate: { gte: monthStart, lt: nextMonth },
      },
      select: { status: true, priceAtBooking: true },
    }),
    prisma.service.count({
      where: { userId: access.clinicId, status: true },
    }),
  ])

  const scheduled = appointments.filter(({ status }) => status === "SCHEDULED")
  const completed = appointments.filter(({ status }) => status === "COMPLETED")
  const cancelled = appointments.filter(({ status }) => status === "CANCELLED")

  return {
    month: new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(monthStart),
    scheduledAppointments: scheduled.length,
    completedAppointments: completed.length,
    cancelledAppointments: cancelled.length,
    activeServices,
    scheduledValueCents: scheduled.reduce((total, item) => total + item.priceAtBooking, 0),
  }
}
