import { describe, expect, it } from "vitest"
import prisma from "@/lib/prisma"
import { cancelPatientAppointment, getAvailableRescheduleTimes, reschedulePatientAppointment } from "@/app/(public)/agendamento/[token]/_actions/manage-appointment"
import { createNewAppointment } from "@/app/(public)/clinica/[id]/_actions/create-appointment"
import { clinicTimes, futureDateKey, useClinicFixture } from "./helpers/fixtures"

const fixture = useClinicFixture()

function bookingInput(
  clinicId: string,
  serviceId: string,
  overrides: Partial<{
    date: string
    time: string
    email: string
  }> = {},
) {
  return {
    name: "Paciente de teste",
    email: overrides.email ?? "patient@example.test",
    phone: "(11) 98765-4321",
    date: overrides.date ?? futureDateKey(),
    time: overrides.time ?? "09:00",
    serviceId,
    clinicId,
  }
}

describe("public appointment booking and patient management", () => {
  it("creates a valid appointment, snapshots service data and stores only the token hash", async () => {
    const service = await fixture.addService(fixture.clinic.id, {
      name: "Avaliação teste",
      duration: 45,
      price: 18750,
    })
    const otherClinicService = await fixture.addService(fixture.otherClinic.id)
    const nonexistentClinicResult = await createNewAppointment(
      bookingInput("missing-clinic", service.id),
    )
    expect(nonexistentClinicResult).toHaveProperty("error")

    const result = await createNewAppointment(
      bookingInput(fixture.clinic.id, service.id),
    )

    expect(result).toHaveProperty("data")
    if (!("data" in result) || !("managementPath" in result)) return

    const token = result.managementPath.split("/").at(-1)
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/)

    const saved = await prisma.appointment.findUniqueOrThrow({
      where: { id: result.data.id },
    })
    expect(saved).toMatchObject({
      status: "SCHEDULED",
      serviceNameAtBooking: "Avaliação teste",
      durationAtBooking: 45,
      priceAtBooking: 18750,
    })
    expect(saved.managementTokenHash).toMatch(/^[a-f0-9]{64}$/)
    expect(saved.managementTokenHash).not.toBe(token)

    await prisma.service.update({
      where: { id: service.id },
      data: { name: "Serviço atualizado", duration: 30, price: 25000 },
    })
    const historical = await prisma.appointment.findUniqueOrThrow({
      where: { id: saved.id },
    })
    expect(historical).toMatchObject({
      serviceNameAtBooking: "Avaliação teste",
      durationAtBooking: 45,
      priceAtBooking: 18750,
    })
    expect(otherClinicService.userId).toBe(fixture.otherClinic.id)
  })

  it("rejects unpublished clinics, foreign/inactive services and invalid/past dates", async () => {
    const service = await fixture.addService(fixture.clinic.id)
    const foreignService = await fixture.addService(fixture.otherClinic.id)
    const inactiveService = await fixture.addService(fixture.clinic.id, { status: false })

    await prisma.user.update({
      where: { id: fixture.clinic.id },
      data: { isPublished: false },
    })
    await expect(createNewAppointment(
      bookingInput(fixture.clinic.id, service.id),
    )).resolves.toHaveProperty("error")

    await prisma.user.update({
      where: { id: fixture.clinic.id },
      data: { isPublished: true },
    })
    await expect(createNewAppointment(
      bookingInput(fixture.clinic.id, foreignService.id),
    )).resolves.toHaveProperty("error")
    await expect(createNewAppointment(
      bookingInput(fixture.clinic.id, inactiveService.id),
    )).resolves.toHaveProperty("error")
    await expect(createNewAppointment(
      bookingInput(fixture.clinic.id, service.id, { date: "2026-02-31" }),
    )).resolves.toHaveProperty("error")
    await expect(createNewAppointment(
      bookingInput(fixture.clinic.id, service.id, { date: "2020-01-01" }),
    )).resolves.toHaveProperty("error")

    expect(await prisma.appointment.count({ where: { userId: fixture.clinic.id } })).toBe(0)
  })

  it("rejects slots outside configured hours and service duration gaps", async () => {
    const service = await fixture.addService(fixture.clinic.id, { duration: 60 })
    await prisma.user.update({
      where: { id: fixture.clinic.id },
      data: { times: ["09:00", "09:30", "11:00", "11:30"] },
    })

    await expect(createNewAppointment(
      bookingInput(fixture.clinic.id, service.id, { time: "10:00" }),
    )).resolves.toHaveProperty("error")
    await expect(createNewAppointment(
      bookingInput(fixture.clinic.id, service.id, { time: "09:30" }),
    )).resolves.toHaveProperty("error")
    expect(await prisma.appointment.count({ where: { userId: fixture.clinic.id } })).toBe(0)
  })

  it("rejects overlapping reservations and permits non-overlapping later slots", async () => {
    const service = await fixture.addService(fixture.clinic.id, { duration: 60 })
    const date = futureDateKey()

    const first = await createNewAppointment(
      bookingInput(fixture.clinic.id, service.id, { date, time: "09:00" }),
    )
    expect(first).toHaveProperty("data")

    await expect(createNewAppointment(
      bookingInput(fixture.clinic.id, service.id, {
        date,
        time: "09:30",
        email: "overlap@example.test",
      }),
    )).resolves.toHaveProperty("error")

    await expect(createNewAppointment(
      bookingInput(fixture.clinic.id, service.id, {
        date,
        time: "10:00",
        email: "next-slot@example.test",
      }),
    )).resolves.toHaveProperty("data")
  })

  it("allows at most one reservation for concurrent requests to the same slot", async () => {
    const service = await fixture.addService(fixture.clinic.id, { duration: 30 })
    const date = futureDateKey(11)

    const results = await Promise.all([
      createNewAppointment(bookingInput(fixture.clinic.id, service.id, {
        date,
        time: "11:00",
        email: "race-a@example.test",
      })),
      createNewAppointment(bookingInput(fixture.clinic.id, service.id, {
        date,
        time: "11:00",
        email: "race-b@example.test",
      })),
    ])

    expect(results.filter((result) => "data" in result)).toHaveLength(1)
    expect(results.filter((result) => "error" in result)).toHaveLength(1)
    expect(await prisma.appointment.count({
      where: { userId: fixture.clinic.id, appointmentDate: new Date(`${date}T00:00:00.000Z`) },
    })).toBe(1)
  })

  it("recalculates availability, atomically reschedules and rejects stale or invalid links", async () => {
    const service = await fixture.addService(fixture.clinic.id, { duration: 60 })
    const bookedDate = futureDateKey(12)
    const response = await createNewAppointment(
      bookingInput(fixture.clinic.id, service.id, { date: bookedDate }),
    )
    expect(response).toHaveProperty("managementPath")
    if (!("managementPath" in response)) return
    const token = response.managementPath.split("/").at(-1)!

    await fixture.addAppointment(fixture.clinic.id, service.id, {
      appointmentDate: new Date(`${futureDateKey(13)}T00:00:00.000Z`),
      time: "13:00",
      durationAtBooking: 60,
    })
    const available = await getAvailableRescheduleTimes({
      token,
      date: futureDateKey(13),
    })
    expect(available).toHaveProperty("data")
    if ("data" in available) {
      expect(available.data).not.toContain("13:00")
      expect(available.data).toContain("14:00")
    }

    await expect(reschedulePatientAppointment({
      token,
      date: futureDateKey(13),
      time: "13:00",
    })).resolves.toHaveProperty("error")

    await expect(reschedulePatientAppointment({
      token,
      date: futureDateKey(13),
      time: "14:00",
    })).resolves.toEqual({ data: { date: futureDateKey(13), time: "14:00" } })

    await expect(reschedulePatientAppointment({
      token: "invalid",
      date: futureDateKey(14),
      time: "09:00",
    })).resolves.toHaveProperty("error")

    const saved = await prisma.appointment.findFirstOrThrow({
      where: { userId: fixture.clinic.id, managementTokenHash: { not: null } },
    })
    expect(saved.appointmentDate.toISOString().slice(0, 10)).toBe(futureDateKey(13))
    expect(saved.time).toBe("14:00")
    expect(clinicTimes).toContain(saved.time)
  })

  it("cancels without deleting history and rejects a second cancellation", async () => {
    const service = await fixture.addService(fixture.clinic.id, { duration: 30 })
    const result = await createNewAppointment(
      bookingInput(fixture.clinic.id, service.id, { date: futureDateKey(15) }),
    )
    if (!("managementPath" in result)) throw new Error("Expected management link.")
    const token = result.managementPath.split("/").at(-1)!

    await expect(cancelPatientAppointment({ token })).resolves.toEqual({ data: true })
    await expect(cancelPatientAppointment({ token })).resolves.toHaveProperty("error")
    const saved = await prisma.appointment.findFirstOrThrow({
      where: { userId: fixture.clinic.id, managementTokenHash: { not: null } },
    })
    expect(saved.status).toBe("CANCELLED")
    expect(saved.name).toBe("Paciente de teste")
  })
})
