import prisma from "@/lib/prisma"
import {
  hashAppointmentManagementToken,
  isAppointmentManagementToken,
} from "@/lib/appointment-management-token"

function getClinicDateParts(date: Date, timeZone: string | null) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone || "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  }
}

export async function getAppointmentManagement(token: string) {
  if (!isAppointmentManagementToken(token)) return null

  const appointment = await prisma.appointment.findUnique({
    where: { managementTokenHash: hashAppointmentManagementToken(token) },
    select: {
      status: true,
      name: true,
      appointmentDate: true,
      time: true,
      durationAtBooking: true,
      serviceNameAtBooking: true,
      priceAtBooking: true,
      user: {
        select: {
          name: true,
          times: true,
          timeZone: true,
          isPublished: true,
        },
      },
    },
  })

  if (!appointment) return null

  const date = appointment.appointmentDate.toISOString().slice(0, 10)
  const [hour, minute] = appointment.time.split(":").map(Number)
  const now = getClinicDateParts(new Date(), appointment.user.timeZone)
  const canManage =
    date > now.date ||
    (date === now.date && hour * 60 + minute > now.minutes)

  return { ...appointment, canManage }
}
