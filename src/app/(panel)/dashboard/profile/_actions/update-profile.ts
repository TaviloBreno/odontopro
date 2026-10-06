"use server"

import { getClinicAccess } from '@/lib/clinic-access'
import { logger } from '@/lib/structured-logger'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório").max(120),
  address: z.string().trim().max(500).optional(),
  phone: z.string().trim().max(32).optional().refine((value) => {
    if (!value) return true
    const digits = value.replace(/\D/g, "")
    return digits.length >= 8 && digits.length <= 15
  }, "Informe um telefone com 8 a 15 dígitos."),
  isPublished: z.boolean(),
  timeZone: z.string().min(1).refine((timeZone) => {
    try {
      new Intl.DateTimeFormat("pt-BR", { timeZone })
      return true
    } catch {
      return false
    }
  }, "Fuso horário inválido."),
  times: z.array(z.string().regex(/^([01]\d|2[0-3]):(00|30)$/, "Horário inválido."))
    .max(32, "Selecione no máximo 32 horários.")
    .refine((times) => new Set(times).size === times.length, "Não repita horários.")
    .transform((times) => [...times].sort()),
})

type FormSchema = z.infer<typeof formSchema>

export async function updateProfile(formData: FormSchema) {

  const access = await getClinicAccess()

  if (!access || access.role !== "ADMIN") {
    return {
      error: "Usuário não encontrado",
    }
  }

  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0]?.message ?? "Revise os dados informados.",
    }
  }

  if (schema.data.isPublished && schema.data.times.length === 0) {
    return { error: "Configure ao menos um horário antes de publicar a clínica." }
  }

  if (schema.data.isPublished) {
    const serviceCount = await prisma.service.count({
      where: { userId: access.clinicId, status: true },
    })
    if (serviceCount === 0) {
      return { error: "Cadastre ao menos um serviço antes de publicar a clínica." }
    }
  }

  try {

    await prisma.user.update({
      where: {
        id: access.clinicId
      },
      data: {
        name: schema.data.name,
        address: schema.data.address,
        phone: schema.data.phone,
        isPublished: schema.data.isPublished,
        timeZone: schema.data.timeZone,
        times: schema.data.times,
      }
    })

    revalidatePath("/dashboard/profile")
    revalidatePath("/")
    revalidatePath(`/clinica/${access.clinicId}`)

    return {
      data: "Clinica atualizada com sucesso!"
    }

  } catch (err) {
    logger.error("clinic.profile.update.failed", err)
    return {
      error: "Falha ao atualizar clincia",
    }
  }

}