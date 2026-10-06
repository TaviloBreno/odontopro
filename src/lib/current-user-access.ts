import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function getCurrentUserAccess() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      clinicOwnerId: true,
      status: true,
    },
  })

  if (!user?.status) return null

  if (user.role === "EMPLOYEE") {
    if (!user.clinicOwnerId) return null
    const owner = await prisma.user.findFirst({
      where: { id: user.clinicOwnerId, role: "ADMIN", status: true },
      select: { id: true },
    })
    if (!owner) return null
  }

  return user
}

export async function getPlatformAdminAccess() {
  const user = await getCurrentUserAccess()
  return user?.role === "PLATFORM_ADMIN" ? user : null
}

export async function getClientAccess() {
  const user = await getCurrentUserAccess()
  return user?.role === "CLIENT" ? user : null
}
