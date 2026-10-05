import type { FullConfig } from "@playwright/test"
import prisma from "../../src/lib/prisma"

export default async function globalTeardown(_config: FullConfig) {
  await prisma.user.deleteMany({ where: { id: "e2e-test-clinic" } })
  await prisma.$disconnect()
}
