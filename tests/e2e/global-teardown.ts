import type { FullConfig } from "@playwright/test"
import prisma from "../../src/lib/prisma"

export default async function globalTeardown(_config: FullConfig) {
  await prisma.user.deleteMany({
    where: { id: { in: ["e2e-test-clinic", "e2e-test-employee", "e2e-test-client", "e2e-test-platform-admin"] } },
  })
  await prisma.$disconnect()
}
