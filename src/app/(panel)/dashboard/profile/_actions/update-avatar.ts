"use server"

import prisma from "@/lib/prisma"
import { getClinicAccess } from '@/lib/clinic-access'
import { revalidatePath } from "next/cache";


export async function updateProfileAvatar({ avatarUrl }: { avatarUrl: string }) {
  const access = await getClinicAccess()

  if (!access || access.role !== "ADMIN") {
    return {
      error: "Usuário não encontrado"
    }
  }

  if (!avatarUrl) {
    return {
      error: "Falha ao alterar imagem"
    }
  }

  try {

    await prisma.user.update({
      where: {
        id: access.clinicId,
      },
      data: {
        image: avatarUrl
      }
    })

    revalidatePath("/dashboard/profile")

    return {
      data: "Imagem alterada com sucesso!"
    }


  } catch (err) {
    return {
      error: "Falha ao alterar imagem"
    }
  }

}