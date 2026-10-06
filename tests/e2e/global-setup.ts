import bcrypt from "bcryptjs"
import type { FullConfig } from "@playwright/test"
import prisma from "../../src/lib/prisma"

export default async function globalSetup(_config: FullConfig) {
  await prisma.user.deleteMany({
    where: { id: { in: ["e2e-test-clinic", "e2e-test-client", "e2e-test-platform-admin"] } },
  })
  const clinic = await prisma.user.create({
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
  const client = await prisma.user.create({
    data: {
      id: "e2e-test-client",
      email: "e2e-client@example.test",
      name: "Cliente E2E",
      password: await bcrypt.hash("e2e-client-password", 4),
      role: "CLIENT",
      status: true,
    },
  })
  await prisma.user.create({
    data: {
      id: "e2e-test-platform-admin",
      email: "e2e-platform@example.test",
      name: "Administrador da Plataforma E2E",
      password: await bcrypt.hash("e2e-platform-password", 4),
      role: "PLATFORM_ADMIN",
      status: true,
    },
  })
  await prisma.appointment.create({
    data: {
      id: "e2e-test-client-appointment",
      name: client.name ?? "Cliente E2E",
      email: client.email,
      phone: "11999999999",
      time: "10:00",
      appointmentDate: new Date(Date.now() + 7 * 86400000),
      status: "SCHEDULED",
      priceAtBooking: 10000,
      durationAtBooking: 30,
      serviceNameAtBooking: "Consulta automatizada",
      serviceId: "e2e-test-service",
      userId: clinic.id,
      clientUserId: client.id,
    },
  })
}
