import { redirect } from "next/navigation"
import { getClinicAccess } from "@/lib/clinic-access"
import { Appointments } from "../_components/appointments/appointments"
import { Reminders } from "../_components/reminder/reminders"
import prisma from "@/lib/prisma"
import { CalendarDays, CheckCircle2, Clock3, ListChecks } from "lucide-react"

export default async function EmployeeDashboard() {
  const access = await getClinicAccess()

  if (!access) redirect("/login")
  if (access.role !== "EMPLOYEE") redirect("/dashboard")

  const now = new Date()
  const todayStart = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  ))
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

  const [employee, clinic, todayAppointments, pendingReminders, completedReminders] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: access.userId },
        select: { name: true },
      }),
      prisma.user.findUnique({
        where: { id: access.clinicId },
        select: { name: true },
      }),
      prisma.appointment.count({
        where: {
          userId: access.clinicId,
          status: "SCHEDULED",
          appointmentDate: { gte: todayStart, lt: tomorrowStart },
        },
      }),
      prisma.reminder.count({
        where: { userId: access.clinicId, isCompleted: false },
      }),
      prisma.reminder.count({
        where: { userId: access.clinicId, isCompleted: true },
      }),
    ])

  if (!employee || !clinic) {
    throw new Error("Não foi possível carregar os dados do funcionário e da clínica.")
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-cyan-700 to-teal-600 px-6 py-7 text-white shadow-sm sm:px-8">
        <p className="text-sm font-medium text-cyan-100">Painel do funcionário</p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Olá, {employee.name?.trim() || "Funcionário"}
            </h1>
            <p className="mt-2 text-sm text-cyan-50 sm:text-base">
              Acompanhe a agenda e os lembretes de {clinic.name ?? "sua clínica"}.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            <span>
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "full",
                timeZone: "America/Fortaleza",
              }).format(now)}
            </span>
          </div>
        </div>
      </header>

      <section aria-label="Resumo do dia" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Consultas de hoje"
          value={todayAppointments}
          detail="Agendamentos confirmados"
          color="text-sky-700 bg-sky-50"
        />
        <SummaryCard
          icon={<ListChecks className="h-5 w-5" />}
          label="Lembretes pendentes"
          value={pendingReminders}
          detail="Itens para acompanhar"
          color="text-amber-700 bg-amber-50"
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Lembretes concluídos"
          value={completedReminders}
          detail="Tarefas já resolvidas"
          color="text-emerald-700 bg-emerald-50"
        />
        <SummaryCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Próximo passo"
          value="Agenda"
          detail="Confira os horários abaixo"
          color="text-violet-700 bg-violet-50"
        />
      </section>

      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <Appointments userId={access.clinicId} />
        <Reminders userId={access.clinicId} />
      </section>

      <aside className="rounded-xl border border-sky-100 bg-sky-50 px-5 py-4 text-sm text-sky-950">
        <p className="font-semibold">Acesso da equipe</p>
        <p className="mt-1 text-sky-900">
          Este painel mostra a agenda e os lembretes da clínica. Para alterar
          serviços, dados da clínica ou equipe, procure o administrador.
        </p>
      </aside>
    </main>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  detail: string
  color: string
}) {
  return (
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">{value}</p>
        </div>
        <span className={`rounded-lg p-2.5 ${color}`} aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-xs text-gray-500">{detail}</p>
    </article>
  )
}
