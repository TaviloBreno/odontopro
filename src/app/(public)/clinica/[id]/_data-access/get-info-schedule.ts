"use server"

import prisma from "@/lib/prisma"

export async function getInfoSchedule({ userId }: { userId: string }) {
  if (!userId) return null

  return prisma.user.findFirst({
    where: {
      id: userId,
      isPublished: true,
      role: "ADMIN",
    },
    select: {
      id: true,
      name: true,
      address: true,
      image: true,
      times: true,
      timeZone: true,
      isPublished: true,
      services: {
        where: { status: true },
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
        },
      },
    },
  })
}
