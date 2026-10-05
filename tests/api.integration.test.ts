import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"
import prisma from "@/lib/prisma"
import { GET as getClinicAppointments } from "@/app/api/clinic/appointments/route"
import { GET as getPublicAvailability } from "@/app/api/schedule/get-appointments/route"
import { futureDateKey, setAuthenticatedUser, useClinicFixture } from "./helpers/fixtures"

const fixture = useClinicFixture()

describe("appointment APIs", () => {
  it("returns only occupied public slots and validates public clinic/date inputs", async () => {
    const service = await fixture.addService(fixture.clinic.id, { duration: 60 })
    const date = futureDateKey(20)
    await fixture.addAppointment(fixture.clinic.id, service.id, {
      appointmentDate: new Date(`${date}T00:00:00.000Z`),
      time: "09:00",
      durationAtBooking: 60,
    })

    const response = await getPublicAvailability(new NextRequest(
      `http://localhost/api/schedule/get-appointments?userId=${fixture.clinic.id}&date=${date}`,
    ))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(["09:00", "09:30"])

    const invalidDate = await getPublicAvailability(new NextRequest(
      `http://localhost/api/schedule/get-appointments?userId=${fixture.clinic.id}&date=2026-02-31`,
    ))
    expect(invalidDate.status).toBe(400)

    const invalidClinic = await getPublicAvailability(new NextRequest(
      "http://localhost/api/schedule/get-appointments?userId=missing&date=2026-10-20",
    ))
    expect(invalidClinic.status).toBe(404)
  })

  it("requires authentication and scopes private appointment API results to the clinic", async () => {
    const service = await fixture.addService(fixture.clinic.id)
    const otherService = await fixture.addService(fixture.otherClinic.id)
    const date = futureDateKey(21)
    await fixture.addAppointment(fixture.clinic.id, service.id, {
      appointmentDate: new Date(`${date}T00:00:00.000Z`),
      time: "09:00",
    })
    await fixture.addAppointment(fixture.otherClinic.id, otherService.id, {
      appointmentDate: new Date(`${date}T00:00:00.000Z`),
      time: "09:30",
    })

    setAuthenticatedUser(null)
    const unauthorized = await getClinicAppointments(new NextRequest(
      `http://localhost/api/clinic/appointments?date=${date}`,
    ))
    expect(unauthorized.status).toBe(401)

    setAuthenticatedUser(fixture.clinic.id)
    const response = await getClinicAppointments(new NextRequest(
      `http://localhost/api/clinic/appointments?date=${date}`,
    ))
    expect(response.status).toBe(200)
    const records = await response.json()
    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      service: { id: service.id },
      time: "09:00",
    })

    const invalidDate = await getClinicAppointments(new NextRequest(
      "http://localhost/api/clinic/appointments?date=2026-02-31",
    ))
    expect(invalidDate.status).toBe(400)
    expect(await prisma.appointment.count({
      where: { userId: fixture.otherClinic.id, appointmentDate: new Date(`${date}T00:00:00.000Z`) },
    })).toBe(1)
  })
})
