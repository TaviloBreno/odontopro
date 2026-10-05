import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

const signupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(256),
  phone: z.string().trim().max(32).optional(),
  address: z.string().trim().max(255).optional(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 })
  }

  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados de cadastro inválidos." },
      { status: 400 }
    )
  }

  const { name, email, password, phone, address } = parsed.data

  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
        role: "ADMIN",
        clinicOwnerId: null,
      },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    return NextResponse.json(
      { message: "Usuário criado com sucesso", user },
      { status: 201 }
    )
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Já existe uma conta com este e-mail." },
        { status: 409 }
      )
    }

    console.error("Erro ao criar usuário:", error)
    return NextResponse.json(
      { error: "Não foi possível criar a conta." },
      { status: 500 }
    )
  }
}