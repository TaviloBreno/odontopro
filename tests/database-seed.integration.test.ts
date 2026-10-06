import { spawnSync } from "node:child_process"
import { afterAll, describe, expect, it } from "vitest"
import prisma from "@/lib/prisma"

const adminEmail = process.env.TEST_LOGIN_EMAIL?.trim().toLowerCase()
const employeeEmail = process.env.TEST_EMPLOYEE_EMAIL?.trim().toLowerCase()
const demoClinicEmails = Array.from(
  { length: 20 },
  (_, index) => `demo.clinic${String(index + 1).padStart(2, "0")}@example.test`,
)
const demoEmployeeEmails = Array.from(
  { length: 20 },
  (_, index) => `demo.employee${String(index + 1).padStart(2, "0")}@example.test`,
)
const demoClientEmail = process.env.TEST_CLIENT_EMAIL?.trim().toLowerCase() || "cliente@odontopro.local"
const demoPlatformAdminEmail =
  process.env.TEST_PLATFORM_ADMIN_EMAIL?.trim().toLowerCase() || "plataforma@odontopro.local"

describe("PostgreSQL migrations and seed", () => {
  it("applies the seed twice without duplicating demo data", () => {
    expect(adminEmail).toBeTruthy()
    expect(employeeEmail).toBeTruthy()

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const result = spawnSync(
        process.execPath,
        ["prisma/seed.js"],
        { cwd: process.cwd(), env: process.env, encoding: "utf8" },
      )
      expect(result.status, result.stderr || result.stdout).toBe(0)
    }
  })

  it("seeds one access clinic plus 20 fictitious clinics and employees without duplicates", async () => {
    const clinic = await prisma.user.findUniqueOrThrow({
      where: { email: adminEmail },
    })
    expect(await prisma.user.count({ where: { email: adminEmail } })).toBe(1)
    expect(await prisma.user.count({
      where: { email: employeeEmail, clinicOwnerId: clinic.id },
    })).toBe(1)
    expect(await prisma.user.count({
      where: { email: demoClientEmail, role: "CLIENT" },
    })).toBe(1)
    expect(await prisma.user.count({
      where: { email: demoPlatformAdminEmail, role: "PLATFORM_ADMIN" },
    })).toBe(1)
    expect(await prisma.platformPlan.count()).toBe(3)
    expect(await prisma.appointment.count({
      where: {
        id: "odontopro-demo-client-appointment",
        clientUser: { email: demoClientEmail },
      },
    })).toBe(1)

    await prisma.platformPlan.update({
      where: { key: "BASIC" },
      data: { name: "Plano configurado pelo administrador" },
    })
    const reseed = spawnSync(
      process.execPath,
      ["prisma/seed.js"],
      { cwd: process.cwd(), env: process.env, encoding: "utf8" },
    )
    expect(reseed.status, reseed.stderr || reseed.stdout).toBe(0)
    expect(await prisma.platformPlan.findUniqueOrThrow({
      where: { key: "BASIC" },
    })).toMatchObject({ name: "Plano configurado pelo administrador" })

    const demoClinics = await prisma.user.findMany({
      where: { email: { in: demoClinicEmails }, role: "ADMIN" },
      select: { id: true, email: true, isPublished: true },
    })
    const demoEmployees = await prisma.user.findMany({
      where: { email: { in: demoEmployeeEmails }, role: "EMPLOYEE" },
      select: { email: true, clinicOwnerId: true },
    })
    expect(demoClinics).toHaveLength(20)
    expect(demoEmployees).toHaveLength(20)
    expect(demoClinics.every((demoClinic) => demoClinic.isPublished)).toBe(true)
    expect(new Set(demoEmployees.map(({ clinicOwnerId }) => clinicOwnerId)).size).toBe(20)
    expect(demoEmployees.every((employee) =>
      demoClinics.some((demoClinic) => demoClinic.id === employee.clinicOwnerId)
    )).toBe(true)
    expect(await prisma.service.count({
      where: { id: { startsWith: "odontopro-demo-clinic-" } },
    })).toBe(20)

    expect(await prisma.service.count({
      where: { id: { in: [
        "odontopro-demo-consulta",
        "odontopro-demo-limpeza",
        "odontopro-demo-avaliacao",
      ] } },
    })).toBe(3)
    expect(await prisma.appointment.count({
      where: { id: { in: [
        "odontopro-demo-appointment-1",
        "odontopro-demo-appointment-2",
      ] } },
    })).toBe(2)
    expect(await prisma.reminder.count({
      where: { id: { in: [
        "odontopro-demo-reminder-1",
        "odontopro-demo-reminder-2",
        "odontopro-demo-reminder-3",
      ] } },
    })).toBe(3)
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: demoEmployeeEmails } } })
    await prisma.user.deleteMany({ where: { email: { in: demoClinicEmails } } })
    await prisma.user.deleteMany({ where: { email: demoClientEmail } })
    await prisma.user.deleteMany({ where: { email: demoPlatformAdminEmail } })
    if (adminEmail) await prisma.user.deleteMany({ where: { email: adminEmail } })
    if (employeeEmail) await prisma.user.deleteMany({ where: { email: employeeEmail } })
  })
})
