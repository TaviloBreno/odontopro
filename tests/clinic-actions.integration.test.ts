import { describe, expect, it } from "vitest"
import prisma from "@/lib/prisma"
import { createNewService } from "@/app/(panel)/dashboard/services/_actions/create-service"
import { updateService } from "@/app/(panel)/dashboard/services/_actions/update-service"
import { deleteService } from "@/app/(panel)/dashboard/services/_actions/delete-service"
import { getAllServices } from "@/app/(panel)/dashboard/services/_data-access/get-all-services"
import { getTimesClinic } from "@/app/(panel)/dashboard/_data-access/get-times-clinic"
import { getReminders } from "@/app/(panel)/dashboard/_data-access/get-reminders"
import { cancelAppointment } from "@/app/(panel)/dashboard/_actions/cancel-appointment"
import { completeAppointment } from "@/app/(panel)/dashboard/_actions/complete-appointment"
import { createReminder } from "@/app/(panel)/dashboard/_actions/create-reminder"
import { deleteReminder } from "@/app/(panel)/dashboard/_actions/delete-reminder"
import { setReminderCompletion } from "@/app/(panel)/dashboard/_actions/set-reminder-completion"
import { createEmployee } from "@/app/(panel)/dashboard/_actions/create-employee"
import { getClinicAccess } from "@/lib/clinic-access"
import { getServiceLimitStatus } from "@/utils/permissions/service-limit"
import { PLANS } from "@/utils/plans"
import { setAuthenticatedUser, useClinicFixture } from "./helpers/fixtures"

const fixture = useClinicFixture()

describe("clinic authorization, appointments, reminders and plan limits", () => {
  it("resolves an administrator and employee only to their own clinic", async () => {
    expect(await getClinicAccess()).toMatchObject({
      userId: fixture.clinic.id,
      clinicId: fixture.clinic.id,
      role: "ADMIN",
    })

    const employee = await fixture.addEmployee(fixture.otherClinic.id)
    setAuthenticatedUser(employee.id)
    expect(await getClinicAccess()).toMatchObject({
      userId: employee.id,
      clinicId: fixture.otherClinic.id,
      role: "EMPLOYEE",
    })

    await prisma.user.update({ where: { id: employee.id }, data: { status: false } })
    expect(await getClinicAccess()).toBeNull()
  })

  it("revokes clinic access when an administrator account is disabled", async () => {
    const employee = await fixture.addEmployee(fixture.clinic.id)
    await prisma.user.update({
      where: { id: fixture.clinic.id },
      data: { status: false },
    })

    expect(await getClinicAccess()).toBeNull()
    await expect(createReminder({ description: "Não deve ser criado" }))
      .resolves.toHaveProperty("error")
    await expect(createEmployee({ email: "disabled-admin-employee@example.test" }))
      .resolves.toHaveProperty("error")
    expect(await prisma.reminder.count({ where: { userId: fixture.clinic.id } })).toBe(0)
    expect(await prisma.user.findUnique({
      where: { email: "disabled-admin-employee@example.test" },
    })).toBeNull()

    setAuthenticatedUser(employee.id)
    expect(await getClinicAccess()).toBeNull()
    await expect(getReminders({ userId: fixture.clinic.id })).rejects.toThrow(
      "Acesso não autorizado aos lembretes da clínica.",
    )
  })

  it("denies employees access to administrator-only service creation", async () => {
    const employee = await fixture.addEmployee(fixture.clinic.id)
    setAuthenticatedUser(employee.id)

    await expect(createNewService({
      name: "Serviço não autorizado",
      price: 1000,
      duration: 30,
    })).resolves.toHaveProperty("error")
    expect(await prisma.service.count({ where: { userId: fixture.clinic.id } })).toBe(0)
  })

  it("prevents cross-clinic service reads and mutations through direct calls", async () => {
    const service = await fixture.addService(fixture.otherClinic.id)

    await expect(getAllServices({ userId: fixture.otherClinic.id })).rejects.toThrow(
      "Acesso não autorizado aos serviços da clínica.",
    )
    await expect(getTimesClinic({ userId: fixture.otherClinic.id })).rejects.toThrow(
      "Acesso não autorizado à agenda da clínica.",
    )
    await expect(getReminders({ userId: fixture.otherClinic.id })).rejects.toThrow(
      "Acesso não autorizado aos lembretes da clínica.",
    )
    await expect(updateService({
      serviceId: service.id,
      name: "Alterado por outra clínica",
      price: 15000,
      duration: 30,
    })).resolves.toHaveProperty("error")
    await expect(deleteService({ serviceId: service.id })).resolves.toHaveProperty("error")

    expect(await prisma.service.findUniqueOrThrow({ where: { id: service.id } }))
      .toMatchObject({
        userId: fixture.otherClinic.id,
        name: "Consulta teste",
        status: true,
      })
  })

  it("denies private operations without a session and prevents cross-clinic reminder changes", async () => {
    const reminder = await prisma.reminder.create({
      data: { description: "Somente da outra clínica", userId: fixture.otherClinic.id },
    })

    setAuthenticatedUser(null)
    await expect(setReminderCompletion({
      reminderId: reminder.id,
      isCompleted: true,
    })).resolves.toHaveProperty("error")

    setAuthenticatedUser(fixture.clinic.id)
    await expect(setReminderCompletion({
      reminderId: reminder.id,
      isCompleted: true,
    })).resolves.toHaveProperty("error")
    await expect(deleteReminder({ reminderId: reminder.id })).resolves.toHaveProperty("error")

    expect(await prisma.reminder.findUniqueOrThrow({ where: { id: reminder.id } }))
      .toMatchObject({ userId: fixture.otherClinic.id, isCompleted: false })
  })

  it("creates, completes, reopens and deletes clinic-owned reminders", async () => {
    await expect(createReminder({ description: "   " })).resolves.toHaveProperty("error")
    await expect(createReminder({ description: "Confirmar paciente" }))
      .resolves.toHaveProperty("data")

    const reminder = await prisma.reminder.findFirstOrThrow({
      where: { userId: fixture.clinic.id, description: "Confirmar paciente" },
    })
    await expect(setReminderCompletion({
      reminderId: reminder.id,
      isCompleted: true,
    })).resolves.toHaveProperty("data")
    expect((await prisma.reminder.findUniqueOrThrow({ where: { id: reminder.id } })).isCompleted)
      .toBe(true)

    await expect(setReminderCompletion({
      reminderId: reminder.id,
      isCompleted: false,
    })).resolves.toHaveProperty("data")
    await expect(deleteReminder({ reminderId: reminder.id })).resolves.toHaveProperty("data")
    expect(await prisma.reminder.findUnique({ where: { id: reminder.id } })).toBeNull()
  })

  it("cancels only appointments owned by the authenticated clinic and retains the row", async () => {
    const service = await fixture.addService(fixture.otherClinic.id)
    const appointment = await fixture.addAppointment(fixture.otherClinic.id, service.id)

    await expect(cancelAppointment({ appointmentId: appointment.id }))
      .resolves.toHaveProperty("error")
    await expect(completeAppointment({ appointmentId: appointment.id }))
      .resolves.toHaveProperty("error")
    expect((await prisma.appointment.findUniqueOrThrow({ where: { id: appointment.id } })).status)
      .toBe("SCHEDULED")

    setAuthenticatedUser(fixture.otherClinic.id)
    await expect(cancelAppointment({ appointmentId: appointment.id }))
      .resolves.toHaveProperty("data")
    const saved = await prisma.appointment.findUniqueOrThrow({
      where: { id: appointment.id },
    })
    expect(saved.status).toBe("CANCELLED")
    expect(saved.name).toBe("Paciente teste")
  })

  it("allows completion only after the appointment end and preserves the appointment", async () => {
    const service = await fixture.addService(fixture.clinic.id)
    const futureAppointment = await fixture.addAppointment(
      fixture.clinic.id,
      service.id,
      { appointmentDate: new Date(`${new Date(Date.now() + 86400000).toISOString().slice(0, 10)}T00:00:00Z`) },
    )
    await expect(completeAppointment({ appointmentId: futureAppointment.id }))
      .resolves.toHaveProperty("error")

    const pastAppointment = await fixture.addAppointment(fixture.clinic.id, service.id)
    await expect(completeAppointment({ appointmentId: pastAppointment.id }))
      .resolves.toHaveProperty("data")
    const saved = await prisma.appointment.findUniqueOrThrow({
      where: { id: pastAppointment.id },
    })
    expect(saved.status).toBe("COMPLETED")
    expect(saved.serviceNameAtBooking).toBe("Consulta teste")
    await expect(completeAppointment({ appointmentId: pastAppointment.id }))
      .resolves.toHaveProperty("error")
  })

  it("enforces plan service limits in the persisted service-creation action", async () => {
    const maxBasicServices = PLANS.BASIC.maxServices
    for (let index = 0; index < maxBasicServices; index += 1) {
      await fixture.addService(fixture.clinic.id, { name: `Serviço ${index}` })
    }

    const limit = await getServiceLimitStatus(prisma, fixture.clinic.id)
    expect(limit).toMatchObject({
      planId: "TRIAL",
      maxServices: maxBasicServices,
      serviceCount: maxBasicServices,
      hasPermission: false,
    })
    await expect(createNewService({
      name: "Serviço excedente",
      price: 1000,
      duration: 30,
    })).resolves.toHaveProperty("error")

    await expect(createNewService({
      name: "Preço inválido",
      price: 0,
      duration: 30,
    })).resolves.toHaveProperty("error")
  })

  it("allows services within an active paid plan and rejects expired trial accounts", async () => {
    await prisma.subscription.create({
      data: {
        userId: fixture.clinic.id,
        status: "active",
        plan: "PROFESSIONAL",
        priceId: "test-price",
      },
    })
    await expect(createNewService({
      name: "Serviço profissional",
      price: 1000,
      duration: 30,
    })).resolves.toHaveProperty("data")

    await prisma.user.update({
      where: { id: fixture.otherClinic.id },
      data: { createdAt: new Date(Date.now() - 10 * 86400000) },
    })
    expect(await getServiceLimitStatus(prisma, fixture.otherClinic.id)).toMatchObject({
      planId: "EXPIRED",
      expired: true,
      hasPermission: false,
    })
  })
})
