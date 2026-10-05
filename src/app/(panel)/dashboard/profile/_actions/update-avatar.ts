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

  let uploadedUrl: URL
  try {
    uploadedUrl = new URL(avatarUrl)
  } catch {
    return { error: "URL de imagem inválida." }
  }

  const cloudName = process.env.CLOUDINARY_NAME
  const path = uploadedUrl.pathname.split("/").filter(Boolean)
  const uploadedPublicId = path.at(-1)?.replace(/\.(png|jpe?g|webp)$/i, "")
  const avatarFolderIndex = path.findIndex((segment, index) =>
    segment === "odontopro" && path[index + 1] === "avatars"
  )
  if (
    uploadedUrl.protocol !== "https:" ||
    uploadedUrl.hostname !== "res.cloudinary.com" ||
    !cloudName ||
    path[0] !== cloudName ||
    avatarFolderIndex < 0 ||
    uploadedPublicId !== access.clinicId ||
    uploadedUrl.search ||
    uploadedUrl.hash
  ) {
    return { error: "A imagem precisa ter sido enviada ao armazenamento autorizado desta clínica." }
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
    console.error("Falha ao salvar avatar da clínica:", err)
    return {
      error: "Falha ao alterar imagem"
    }
  }

}