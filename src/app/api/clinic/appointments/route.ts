import prisma from "@/lib/prisma"
import { NextResponse, NextRequest } from 'next/server'
import { getClinicAccess } from '@/lib/clinic-access'


/*
  Rota para buscar todos os agendamentos de uma clinica

  > Preciso ter a data
  > Preciso ter o id da clinica (NAO POSSO RECEBER DA ROTA req.params)
*/


export async function GET(request: NextRequest) {
  const access = await getClinicAccess()
  if (!access) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams;
  const dateString = searchParams.get("date")
  const clinicId = access.clinicId

  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return NextResponse.json({ error: "Data não informada!" }, { status: 400 })
  }

  try {
    // Criar uma data formatada 
    const [year, month, day] = dateString.split("-").map(Number)

    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    if (startDate.toISOString().slice(0, 10) !== dateString) {
      return NextResponse.json({ error: "Data inválida." }, { status: 400 })
    }
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
        status: "SCHEDULED",
        appointmentDate: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        time: true,
        appointmentDate: true,
        status: true,
        priceAtBooking: true,
        durationAtBooking: true,
        serviceNameAtBooking: true,
        service: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(appointments)

  } catch (err) {
    console.error("Falha ao buscar agendamentos da clínica:", err)
    return NextResponse.json({ error: "Falha ao buscar agendamentos" }, { status: 500 })
  }



}