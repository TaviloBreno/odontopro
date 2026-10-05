const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  const email = process.env.TEST_LOGIN_EMAIL?.trim().toLowerCase()

  if (!email) {
    throw new Error("TEST_LOGIN_EMAIL deve estar definido no arquivo .env.")
  }

  const today = new Date()
  const appointmentDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  )
  const clinic = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Clínica Odonto PRO Demo",
      role: "ADMIN",
      clinicOwnerId: null,
      address: "Av. Paulista, 1000 - São Paulo, SP",
      phone: "(11) 99999-0000",
      status: true,
      isPublished: true,
      timeZone: "America/Sao_Paulo",
      times: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
      ],
    },
    create: {
      email,
      name: "Clínica Odonto PRO Demo",
      role: "ADMIN",
      clinicOwnerId: null,
      emailVerified: new Date(),
      address: "Av. Paulista, 1000 - São Paulo, SP",
      phone: "(11) 99999-0000",
      status: true,
      isPublished: true,
      timeZone: "America/Sao_Paulo",
      times: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
      ],
    },
  })

  const employeeEmail = process.env.TEST_EMPLOYEE_EMAIL?.trim().toLowerCase()
  if (!employeeEmail) {
    throw new Error("TEST_EMPLOYEE_EMAIL deve estar definido no arquivo .env.")
  }

  const employee = await prisma.user.upsert({
    where: { email: employeeEmail },
    update: {
      name: "Funcionário de demonstração",
      role: "EMPLOYEE",
      clinicOwnerId: clinic.id,
      status: true,
    },
    create: {
      email: employeeEmail,
      name: "Funcionário de demonstração",
      emailVerified: new Date(),
      role: "EMPLOYEE",
      clinicOwnerId: clinic.id,
      status: true,
      timeZone: "America/Sao_Paulo",
    },
  })

  const services = [
    {
      id: "odontopro-demo-consulta",
      name: "Consulta odontológica",
      price: 25000,
      duration: 60,
    },
    {
      id: "odontopro-demo-limpeza",
      name: "Limpeza e prevenção",
      price: 18000,
      duration: 60,
    },
    {
      id: "odontopro-demo-avaliacao",
      name: "Avaliação inicial",
      price: 10000,
      duration: 30,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: { ...service, userId: clinic.id, status: true },
      create: { ...service, userId: clinic.id },
    })
  }

  const appointments = [
    {
      id: "odontopro-demo-appointment-1",
      name: "Mariana Oliveira",
      email: "mariana@example.com",
      phone: "(11) 98888-1111",
      time: "09:00",
      serviceId: services[0].id,
    },
    {
      id: "odontopro-demo-appointment-2",
      name: "Rafael Santos",
      email: "rafael@example.com",
      phone: "(11) 97777-2222",
      time: "10:30",
      serviceId: services[1].id,
    },
  ]

  for (const appointment of appointments) {
    const service = services.find(({ id }) => id === appointment.serviceId)
    if (!service) {
      throw new Error(`Serviço de demonstração ausente: ${appointment.serviceId}`)
    }

    await prisma.appointment.upsert({
      where: { id: appointment.id },
      update: {
        ...appointment,
        userId: clinic.id,
        appointmentDate,
        status: "SCHEDULED",
        priceAtBooking: service.price,
        durationAtBooking: service.duration,
      },
      create: {
        ...appointment,
        userId: clinic.id,
        appointmentDate,
        status: "SCHEDULED",
        priceAtBooking: service.price,
        durationAtBooking: service.duration,
      },
    })
  }

  const reminders = [
    {
      id: "odontopro-demo-reminder-1",
      description: "Confirmar os agendamentos do próximo dia.",
    },
    {
      id: "odontopro-demo-reminder-2",
      description: "Conferir o estoque de materiais odontológicos.",
    },
    {
      id: "odontopro-demo-reminder-3",
      description: "Enviar lembrete de retorno para os pacientes.",
    },
  ]

  for (const reminder of reminders) {
    await prisma.reminder.upsert({
      where: { id: reminder.id },
      update: { ...reminder, userId: clinic.id, isCompleted: false },
      create: { ...reminder, userId: clinic.id },
    })
  }

  console.info(
    `Dados de demonstração prontos: clínica ${email}, funcionário ${employeeEmail}, ${services.length} serviços, ${appointments.length} agendamentos e ${reminders.length} lembretes.`
  )
  return employee
}

main()
  .catch((error) => {
    console.error("Falha ao inserir os dados de demonstração:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
