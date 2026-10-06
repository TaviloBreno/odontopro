"use server"

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { createHash, randomBytes } from 'node:crypto'
import { z } from 'zod'
import { logger } from '@/lib/structured-logger'

const formSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório").max(120),
  email: z.string().trim().email("O email é obrigatório").max(254).transform((email) => email.toLowerCase()),
  phone: z.string().trim().min(8, "Informe um telefone válido").max(32).refine(
    (phone) => {
      const digits = phone.replace(/\D/g, "")
      return digits.length >= 8 && digits.length <= 15
    },
    "Informe um telefone com 8 a 15 dígitos."
  ),
  privacyNoticeAccepted: z.boolean().refine(
    (accepted) => accepted,
    "Leia e aceite o aviso de privacidade para continuar.",
  ),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  serviceId: z.string().min(1, "O serviço é obrigatório").max(191),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  clinicId: z.string().min(1, "Clínica inválida").max(191),
})

type FormSchema = z.infer<typeof formSchema>

function datePartsAt(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
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

function dateKeyToUtcDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (date.toISOString().slice(0, 10) !== dateKey) {
    return null
  }

  return date
}

function timeToMinutes(time: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time)
  if (!match) return null

  return Number(match[1]) * 60 + Number(match[2])
}

function getClinicDateParts(date: Date, timeZone: string | null) {
  try {
    return datePartsAt(date, timeZone || "America/Sao_Paulo")
  } catch {
    return datePartsAt(date, "America/Sao_Paulo")
  }
}

export async function createNewAppointment(input: FormSchema) {
  const parsed = formSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const formData = parsed.data
  const appointmentDate = dateKeyToUtcDate(formData.date)
  const requestedStart = timeToMinutes(formData.time)

  if (!appointmentDate || requestedStart === null) {
    return { error: "Data ou horário inválido." }
  }

  const managementToken = randomBytes(32).toString("base64url")
  const managementTokenHash = createHash("sha256").update(managementToken).digest("hex")

  try {
    return await prisma.$transaction(async (transaction) => {
      const clinic = await transaction.user.findUnique({
        where: { id: formData.clinicId },
        select: { id: true, role: true, isPublished: true, times: true, timeZone: true },
      })

      if (!clinic || !clinic.isPublished || clinic.role !== "ADMIN") {
        return { error: "Esta clínica não está disponível para agendamentos." }
      }

      const service = await transaction.service.findFirst({
        where: {
          id: formData.serviceId,
          userId: clinic.id,
          status: true,
        },
        select: { id: true, name: true, duration: true, price: true },
      })

      if (!service) {
        return { error: "O serviço selecionado não está disponível nesta clínica." }
      }

      if (!Number.isInteger(service.duration) || service.duration < 1) {
        logger.error("appointment.booking.invalid_service_duration", undefined, {
          clinicId: clinic.id,
          serviceId: service.id,
        })
        return { error: "Não foi possível validar a duração deste serviço." }
      }

      const requestedDate = formData.date
      const clinicNow = getClinicDateParts(new Date(), clinic.timeZone)

      if (requestedDate < clinicNow.date) {
        return { error: "Não é possível agendar em uma data passada." }
      }

      const reservedMinutes = Math.ceil(service.duration / 30) * 30
      const requestedEnd = requestedStart + reservedMinutes

      if (requestedDate === clinicNow.date && requestedStart <= clinicNow.minutes) {
        return { error: "Não é possível agendar um horário que já passou." }
      }

      const startIndex = clinic.times.indexOf(formData.time)
      const requiredSlots = reservedMinutes / 30

      if (startIndex === -1 || startIndex + requiredSlots > clinic.times.length) {
        return { error: "O horário selecionado não está disponível." }
      }

      for (let index = 0; index < requiredSlots; index += 1) {
        const slotTime = clinic.times[startIndex + index]
        const slotMinutes = timeToMinutes(slotTime)

        if (slotMinutes !== requestedStart + index * 30) {
          return {
            error: "O serviço não cabe nos horários consecutivos da clínica.",
          }
        }
      }

      const appointments = await transaction.appointment.findMany({
        where: {
          userId: clinic.id,
          status: "SCHEDULED",
          appointmentDate,
        },
        select: { time: true, durationAtBooking: true },
      })

      const hasConflict = appointments.some((appointment) => {
        const existingStart = timeToMinutes(appointment.time)
        if (existingStart === null || appointment.durationAtBooking < 1) {
          return true
        }

        const existingEnd =
          existingStart + Math.ceil(appointment.durationAtBooking / 30) * 30
        return requestedStart < existingEnd && existingStart < requestedEnd
      })

      if (hasConflict) {
        return {
          error: "Este horário acabou de ser reservado. Escolha outro horário.",
        }
      }

      const appointment = await transaction.appointment.create({
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          time: formData.time,
          appointmentDate,
          serviceId: service.id,
          userId: clinic.id,
          priceAtBooking: service.price,
          durationAtBooking: service.duration,
          serviceNameAtBooking: service.name,
          managementTokenHash,
          privacyNoticeAcceptedAt: new Date(),
        },
        select: {
          id: true,
          appointmentDate: true,
          time: true,
          privacyNoticeAcceptedAt: true,
        },
      })

      return {
        data: appointment,
        managementPath: `/agendamento/${managementToken}`,
      }
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return {
        error: "Este horário acabou de ser reservado. Escolha outro horário.",
      }
    }

    logger.error("appointment.booking.failed", error)
    return { error: "Erro ao cadastrar agendamento. Tente novamente." }
  }
}