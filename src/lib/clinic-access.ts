import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function getClinicAccess() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      clinicOwnerId: true,
      status: true,
    },
  })

  if (!user || (user.role === "EMPLOYEE" && !user.status)) {
    return null
  }

  if (user.role === "ADMIN") {
    return { userId: user.id, clinicId: user.id, role: user.role }
  }

  if (!user.clinicOwnerId) {
    return null
  }

  const clinic = await prisma.user.findFirst({
    where: {
      id: user.clinicOwnerId,
      role: "ADMIN",
    },
    select: { id: true },
  })

  if (!clinic) {
    return null
  }

  return { userId: user.id, clinicId: clinic.id, role: user.role }
}
