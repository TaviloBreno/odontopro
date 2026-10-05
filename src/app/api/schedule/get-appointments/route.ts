// Backend meusite.com/api/schedule/get-appointments

import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const userId = searchParams.get('userId')
  const dateParam = searchParams.get('date')

  if (
    !userId ||
    userId === "null" ||
    !dateParam ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)
  ) {
    return NextResponse.json({
      error: "Nenhum agendamento encotnrado"
    }, {
      status: 400
    })
  }

  try {
    // Converte a data recebida em um objeto Date
    const [year, month, day] = dateParam.split("-").map(Number)
    const startDate = new Date(Date.UTC(year, month - 1, day))
    if (startDate.toISOString().slice(0, 10) !== dateParam) {
      return NextResponse.json({ error: "Data inválida." }, { status: 400 })
    }
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1)

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isPublished: true,
        role: "ADMIN",
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Clínica não encontrada." }, { status: 404 })
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
        status: "SCHEDULED",
        appointmentDate: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        time: true,
        durationAtBooking: true,
      }
    })

    const blockedSlots = new Set<string>()

    for (const apt of appointments) {
      const startMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(apt.time)
      if (!startMatch || apt.durationAtBooking < 1) {
        continue
      }

      const appointmentStart = Number(startMatch[1]) * 60 + Number(startMatch[2])
      const appointmentEnd =
        appointmentStart + Math.ceil(apt.durationAtBooking / 30) * 30

      for (const slot of user.times) {
        const slotMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(slot)
        if (!slotMatch) continue

        const slotStart = Number(slotMatch[1]) * 60 + Number(slotMatch[2])
        if (slotStart < appointmentEnd && appointmentStart < slotStart + 30) {
          blockedSlots.add(slot)
        }
      }
    }

    return NextResponse.json(Array.from(blockedSlots))


  } catch (err) {
    console.error("Falha ao consultar horários reservados:", err)
    return NextResponse.json({
      error: "Nenhum agendamento encotnrado"
    }, {
      status: 400
    })
  }

}