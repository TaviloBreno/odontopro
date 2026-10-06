import { redirect } from "next/navigation"
import { getClientAccess } from "@/lib/current-user-access"
import prisma from "@/lib/prisma"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "America/Fortaleza",
})

export default async function ClientDashboardPage() {
  const client = await getClientAccess()
  if (!client) redirect("/dashboard")

  const appointments = await prisma.appointment.findMany({
    where: { clientUserId: client.id },
    select: {
      id: true,
      name: true,
      appointmentDate: true,
      time: true,
      status: true,
      serviceNameAtBooking: true,
      user: { select: { name: true, address: true } },
    },
    orderBy: [{ appointmentDate: "desc" }, { time: "desc" }],
  })

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Meus agendamentos</h1>
        <p className="mt-1 text-sm text-gray-600">
          Aqui aparecem somente reservas realizadas enquanto você estava conectado
          a esta conta.
        </p>
      </header>

      {appointments.length === 0 ? (
        <p className="rounded-lg border bg-white p-5 text-gray-600">
          Você ainda não tem agendamentos vinculados a esta conta.
        </p>
      ) : (
        <ul className="space-y-3">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="rounded-lg border bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{appointment.serviceNameAtBooking}</h2>
                  <p className="text-sm text-gray-700">{appointment.user.name}</p>
                  <p className="text-sm text-gray-600">{appointment.user.address}</p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {appointment.status === "SCHEDULED"
                    ? "Agendado"
                    : appointment.status === "COMPLETED"
                      ? "Concluído"
                      : "Cancelado"}
                </span>
              </div>
              <p className="mt-3 text-sm">
                {dateFormatter.format(appointment.appointmentDate)} às {appointment.time}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
