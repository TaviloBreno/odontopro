"use server"

import prisma from "@/lib/prisma";
import { getClinicAccess } from "@/lib/clinic-access";

interface GetUserDataProps {
  userId: string;
}

export async function getUserData({ userId }: GetUserDataProps) {
  const access = await getClinicAccess()
  if (!access || access.role !== "ADMIN" || access.clinicId !== userId) {
    throw new Error("Acesso não autorizado ao perfil da clínica.")
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: access.clinicId,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        isPublished: true,
        timeZone: true,
        times: true,
        image: true,
        subscription: {
          select: { plan: true, status: true },
        },
      },
    })

    if (!user) {
      return null;
    }

    return user;

  } catch (err) {
    console.error("Falha ao carregar perfil da clínica:", err)
    throw err
  }
}