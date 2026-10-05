import bcrypt from "bcryptjs"
import type { FullConfig } from "@playwright/test"
import prisma from "../../src/lib/prisma"

export default async function globalSetup(_config: FullConfig) {
  await prisma.user.deleteMany({ where: { id: "e2e-test-clinic" } })
  await prisma.user.create({
    data: {
      id: "e2e-test-clinic",
      email: "e2e-clinic@example.test",
      name: "Clínica E2E",
      password: await bcrypt.hash("e2e-test-password", 4),
      role: "ADMIN",
      status: true,
      isPublished: true,
      timeZone: "America/Sao_Paulo",
      times: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
      services: {
        create: {
          id: "e2e-test-service",
          name: "Consulta automatizada",
          price: 10000,
          duration: 30,
        },
      },
    },
  })
}
