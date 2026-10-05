"use server"

import prisma from "@/lib/prisma"

export async function getProfessionals() {

  try {
    const professionals = await prisma.user.findMany({
      where: {
        isPublished: true,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        address: true,
        image: true,
        subscription: {
          select: {
            status: true,
            plan: true,
          },
        },
      }
    })

    return professionals;

  } catch (error) {
    console.error("Falha ao carregar clínicas públicas:", error)
    throw error
  }

}