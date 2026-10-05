import { spawnSync } from "node:child_process"
import { afterAll, describe, expect, it } from "vitest"
import prisma from "@/lib/prisma"

const adminEmail = process.env.TEST_LOGIN_EMAIL?.trim().toLowerCase()
const employeeEmail = process.env.TEST_EMPLOYEE_EMAIL?.trim().toLowerCase()

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

  it("leaves exactly one demo clinic, employee, each demo service, appointment and reminder", async () => {
    const clinic = await prisma.user.findUniqueOrThrow({
      where: { email: adminEmail },
    })
    expect(await prisma.user.count({ where: { email: adminEmail } })).toBe(1)
    expect(await prisma.user.count({
      where: { email: employeeEmail, clinicOwnerId: clinic.id },
    })).toBe(1)

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
    if (adminEmail) await prisma.user.deleteMany({ where: { email: adminEmail } })
    if (employeeEmail) await prisma.user.deleteMany({ where: { email: employeeEmail } })
  })
})
