"use server"

import prisma from "@/lib/prisma"
import { logger } from "@/lib/structured-logger";
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getClinicAccess } from "@/lib/clinic-access"

const formSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido.").max(254).transform((email) => email.toLowerCase()),
})

export async function createEmployee(input: { email: string }) {
  const access = await getClinicAccess()
  if (!access || access.role !== "ADMIN") {
    return { error: "Você precisa entrar como administrador da clínica." }
  }

  const schema = formSchema.safeParse(input)
  if (!schema.success) {
    return { error: schema.error.issues[0].message }
  }

  const { email } = schema.data

  try {
    const existing = await prisma.user.findUnique({ where: { email } })

    if (
      existing &&
      (existing.role !== "EMPLOYEE" || existing.clinicOwnerId !== access.clinicId)
    ) {
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
          clinicOwnerId: access.clinicId,
          status: true,
        },
      })
    }

    revalidatePath("/dashboard/team")
    return { data: "Funcionário adicionado. Ele pode entrar com Google usando este e-mail." }
  } catch (error) {
    logger.error("employee.create.failed", error)
    return { error: "Não foi possível adicionar o funcionário." }
  }
}
