"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido.").max(254).transform((email) => email.toLowerCase()),
})

export async function createEmployee(input: { email: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Você precisa entrar como administrador da clínica." }
  }

  const schema = formSchema.safeParse(input)
  if (!schema.success) {
    return { error: schema.error.issues[0].message }
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, status: true },
  })

  if (!admin?.status || admin.role !== "ADMIN") {
    return { error: "Somente o administrador da clínica pode gerenciar a equipe." }
  }

  const { email } = schema.data

  try {
    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing && (existing.role !== "EMPLOYEE" || existing.clinicOwnerId !== admin.id)) {
      return {
        error: "Este e-mail já pertence a outra conta. Use um e-mail ainda não cadastrado.",
      }
    }

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { status: true },
      })
    } else {
      await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          role: "EMPLOYEE",
          clinicOwnerId: admin.id,
          status: true,
        },
      })
    }

    revalidatePath("/dashboard/team")
    return { data: "Funcionário adicionado. Ele pode entrar com Google usando este e-mail." }
  } catch (error) {
    console.error("Falha ao adicionar funcionário:", error)
    return { error: "Não foi possível adicionar o funcionário." }
  }
}
