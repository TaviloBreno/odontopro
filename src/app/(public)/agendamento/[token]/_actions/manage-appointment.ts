"use server"

import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { hashAppointmentManagementToken, isAppointmentManagementToken } from "@/lib/appointment-management-token"
import prisma from "@/lib/prisma"
import { z } from "zod"

const tokenSchema = z.string().refine(isAppointmentManagementToken, "Link inválido.")
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.")
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido.")

const manageSchema = z.object({ token: tokenSchema })
const availableTimesSchema = z.object({ token: tokenSchema, date: dateSchema })
const rescheduleSchema = availableTimesSchema.extend({ time: timeSchema })

function dateKeyToUtcDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toISOString().slice(0, 10) === dateKey ? date : null
}

function datePartsAt(date: Date, timeZone: string | null) {
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

function timeToMinutes(time: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time)
  return match ? Number(match[1]) * 60 + Number(match[2]) : null
}

function isFutureSlot(date: string, time: string, timeZone: string | null) {
  const minutes = timeToMinutes(time)
  if (minutes === null) return false

  const now = datePartsAt(new Date(), timeZone)
  return date > now.date || (date === now.date && minutes > now.minutes)
}

function isValidSlotSequence(times: string[], time: string, duration: number) {
  const startIndex = times.indexOf(time)
  if (startIndex === -1 || duration < 1) return false

  const requiredSlots = Math.ceil(duration / 30)
  if (startIndex + requiredSlots > times.length) return false

  const requestedStart = timeToMinutes(time)
  if (requestedStart === null) return false

  for (let index = 0; index < requiredSlots; index += 1) {
    if (timeToMinutes(times[startIndex + index]) !== requestedStart + index * 30) {
      return false
    }
  }
  return true
}

function overlapsScheduledAppointment(
  time: string,
  duration: number,
  appointments: Array<{ time: string; durationAtBooking: number }>,
) {
  const requestedStart = timeToMinutes(time)
  if (requestedStart === null) return true
  const requestedEnd = requestedStart + Math.ceil(duration / 30) * 30

  return appointments.some((appointment) => {
    const existingStart = timeToMinutes(appointment.time)
    if (existingStart === null || appointment.durationAtBooking < 1) return true
    const existingEnd =
      existingStart + Math.ceil(appointment.durationAtBooking / 30) * 30
    return requestedStart < existingEnd && existingStart < requestedEnd
  })
}

async function findAppointmentForToken(token: string) {
  return prisma.appointment.findUnique({
    where: { managementTokenHash: hashAppointmentManagementToken(token) },
    select: {
      id: true,
      status: true,
      userId: true,
      appointmentDate: true,
      time: true,
      durationAtBooking: true,
      user: {
        select: {
          times: true,
          timeZone: true,
          isPublished: true,
        },
      },
    },
  })
}

export async function getAvailableRescheduleTimes(input: unknown) {
  const parsed = availableTimesSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const appointmentDate = dateKeyToUtcDate(parsed.data.date)
  if (!appointmentDate) return { error: "Data inválida." }

  try {
    const appointment = await findAppointmentForToken(parsed.data.token)
    if (!appointment || appointment.status !== "SCHEDULED" || !appointment.user.isPublished) {
      return { error: "Este agendamento não pode ser alterado online." }
    }
    if (!isFutureSlot(
      appointment.appointmentDate.toISOString().slice(0, 10),
      appointment.time,
      appointment.user.timeZone,
    )) {
      return { error: "O horário do agendamento já começou ou passou." }
    }
    if (parsed.data.date < datePartsAt(new Date(), appointment.user.timeZone).date) {
      return { error: "Não é possível escolher uma data passada." }
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: appointment.userId,
        status: "SCHEDULED",
        appointmentDate,
        id: { not: appointment.id },
      },
      select: { time: true, durationAtBooking: true },
    })

    const availableTimes = appointment.user.times.filter((time) =>
      isValidSlotSequence(appointment.user.times, time, appointment.durationAtBooking) &&
      isFutureSlot(parsed.data.date, time, appointment.user.timeZone) &&
      !overlapsScheduledAppointment(time, appointment.durationAtBooking, appointments),
    )

    return { data: availableTimes }
  } catch (error) {
    console.error("Falha ao consultar horários para reagendamento:", error)
    return { error: "Não foi possível carregar os horários. Tente novamente." }
  }
}

export async function cancelPatientAppointment(input: unknown) {
  const parsed = manageSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  try {
    const appointment = await findAppointmentForToken(parsed.data.token)
    if (!appointment || appointment.status !== "SCHEDULED") {
      return { error: "Este agendamento não está mais disponível para cancelamento." }
    }
    if (!isFutureSlot(
      appointment.appointmentDate.toISOString().slice(0, 10),
      appointment.time,
      appointment.user.timeZone,
    )) {
      return { error: "O cancelamento online só é permitido antes do início da consulta." }
    }

    const result = await prisma.appointment.updateMany({
      where: {
        id: appointment.id,
        managementTokenHash: hashAppointmentManagementToken(parsed.data.token),
        status: "SCHEDULED",
      },
      data: { status: "CANCELLED" },
    })
    if (result.count === 0) {
      return { error: "Este agendamento já foi atualizado." }
    }

    revalidatePath("/dashboard")
    return { data: true }
  } catch (error) {
    console.error("Falha ao cancelar agendamento pelo paciente:", error)
    return { error: "Não foi possível cancelar o agendamento. Tente novamente." }
  }
}

export async function reschedulePatientAppointment(input: unknown) {
  const parsed = rescheduleSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const targetDate = dateKeyToUtcDate(parsed.data.date)
  if (!targetDate) return { error: "Data inválida." }

  try {
    return await prisma.$transaction(async (transaction) => {
      const appointment = await transaction.appointment.findUnique({
        where: { managementTokenHash: hashAppointmentManagementToken(parsed.data.token) },
        select: {
          id: true,
          status: true,
          userId: true,
          appointmentDate: true,
          time: true,
          durationAtBooking: true,
          user: { select: { times: true, timeZone: true, isPublished: true } },
        },
      })

      if (!appointment || appointment.status !== "SCHEDULED") {
        return { error: "Este agendamento não está mais disponível para alteração." }
      }
      if (!appointment.user.isPublished) {
        return { error: "A clínica não está aceitando alterações de agendamento no momento." }
      }
      if (!isFutureSlot(
        appointment.appointmentDate.toISOString().slice(0, 10),
        appointment.time,
        appointment.user.timeZone,
      )) {
        return { error: "O horário do agendamento já começou ou passou." }
      }
      if (!isFutureSlot(parsed.data.date, parsed.data.time, appointment.user.timeZone)) {
        return { error: "Escolha uma data e um horário futuros." }
      }
      if (!isValidSlotSequence(
        appointment.user.times,
        parsed.data.time,
        appointment.durationAtBooking,
      )) {
        return { error: "O serviço não cabe nos horários consecutivos da clínica." }
      }

      const conflicts = await transaction.appointment.findMany({
        where: {
          userId: appointment.userId,
          status: "SCHEDULED",
          appointmentDate: targetDate,
          id: { not: appointment.id },
        },
        select: { time: true, durationAtBooking: true },
      })
      if (overlapsScheduledAppointment(
        parsed.data.time,
        appointment.durationAtBooking,
        conflicts,
      )) {
        return { error: "Este horário acabou de ser reservado. Escolha outro horário." }
      }

      await transaction.appointment.update({
        where: { id: appointment.id },
        data: { appointmentDate: targetDate, time: parsed.data.time },
      })

      return { data: { date: parsed.data.date, time: parsed.data.time } }
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
      .then((result) => {
        if ("data" in result) revalidatePath("/dashboard")
        return result
      })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return { error: "Este horário acabou de ser reservado. Escolha outro horário." }
    }
    console.error("Falha ao reagendar consulta pelo paciente:", error)
    return { error: "Não foi possível alterar o agendamento. Tente novamente." }
  }
}
