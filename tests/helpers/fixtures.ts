import { randomUUID } from "node:crypto"
import { afterEach, beforeEach, vi } from "vitest"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const clinicTimes = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
]

export function futureDateKey(daysAhead = 10) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + daysAhead)
  return date.toISOString().slice(0, 10)
}

export function pastDate() {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - 2)
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export function setAuthenticatedUser(userId: string | null) {
  vi.mocked(auth).mockResolvedValue(
    userId ? ({ user: { id: userId } } as never) : (null as never),
  )
}

export function useClinicFixture() {
  let createdUserIds: string[] = []
  let clinic: Awaited<ReturnType<typeof createClinic>>
  let otherClinic: Awaited<ReturnType<typeof createClinic>>

  beforeEach(async () => {
    clinic = await createClinic("primary")
    createdUserIds.push(clinic.id)
    otherClinic = await createClinic("other")
    createdUserIds.push(otherClinic.id)
    setAuthenticatedUser(clinic.id)
  })

  afterEach(async () => {
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } })
    }
    setAuthenticatedUser(null)
  })

  return {
    get clinic() {
      return clinic
    },
    get otherClinic() {
      return otherClinic
    },
    async addEmployee(ownerId: string) {
      const employee = await prisma.user.create({
        data: {
          email: `vitest-${randomUUID()}@example.test`,
          role: "EMPLOYEE",
          clinicOwnerId: ownerId,
          status: true,
        },
      })
      createdUserIds.push(employee.id)
      return employee
    },
    async addService(userId: string, overrides: Partial<{
      name: string
      duration: number
      price: number
      status: boolean
    }> = {}) {
      return prisma.service.create({
        data: {
          name: overrides.name ?? "Consulta teste",
          duration: overrides.duration ?? 60,
          price: overrides.price ?? 12500,
          status: overrides.status ?? true,
          userId,
        },
      })
    },
    async addAppointment(userId: string, serviceId: string, overrides: Partial<{
      appointmentDate: Date
      time: string
      status: "SCHEDULED" | "CANCELLED" | "COMPLETED"
      durationAtBooking: number
    }> = {}) {
      return prisma.appointment.create({
        data: {
          name: "Paciente teste",
          email: `patient-${randomUUID()}@example.test`,
          phone: "11987654321",
          appointmentDate: overrides.appointmentDate ?? pastDate(),
          time: overrides.time ?? "09:00",
          status: overrides.status ?? "SCHEDULED",
          priceAtBooking: 12500,
          durationAtBooking: overrides.durationAtBooking ?? 60,
          serviceNameAtBooking: "Consulta teste",
          serviceId,
          userId,
        },
      })
    },
  }
}

async function createClinic(label: string) {
  return prisma.user.create({
    data: {
      email: `vitest-${label}-${randomUUID()}@example.test`,
      name: `Clínica teste ${label}`,
      role: "ADMIN",
      status: true,
      isPublished: true,
      timeZone: "America/Sao_Paulo",
      times: clinicTimes,
    },
  })
}
