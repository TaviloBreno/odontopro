import { redirect } from 'next/navigation'
import { getClinicReport } from './_data-access/get-clinic-report'
import { getClinicAccess } from '@/lib/clinic-access'
import Link from "next/link"
import { formatCurrency } from "@/utils/formatCurrency"

export default async function Reports() {

  const access = await getClinicAccess()
  if (!access) redirect("/login")
  if (access.role !== "ADMIN") redirect("/dashboard/employee")

  const report = await getClinicReport()

  if (!report) {
    return (
      <main className="mx-auto max-w-3xl space-y-3">
        <h1 className="text-2xl font-bold">Relatórios avançados</h1>
        <p>Este relatório está disponível nos planos Profissional e Premium ativos.</p>
        <Link className="text-emerald-700 underline" href="/dashboard/plans">
          Consultar planos
        </Link>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Relatório da clínica</h1>
        <p className="mt-1 text-sm capitalize text-gray-600">{report.month}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-lg border bg-white p-5">
          <p className="text-sm text-gray-500">Agendamentos ativos no mês</p>
          <p className="mt-2 text-3xl font-bold">{report.scheduledAppointments}</p>
        </article>
        <article className="rounded-lg border bg-white p-5">
          <p className="text-sm text-gray-500">Atendimentos concluídos</p>
          <p className="mt-2 text-3xl font-bold">{report.completedAppointments}</p>
        </article>
        <article className="rounded-lg border bg-white p-5">
          <p className="text-sm text-gray-500">Agendamentos cancelados</p>
          <p className="mt-2 text-3xl font-bold">{report.cancelledAppointments}</p>
        </article>
        <article className="rounded-lg border bg-white p-5">
          <p className="text-sm text-gray-500">Serviços ativos</p>
          <p className="mt-2 text-3xl font-bold">{report.activeServices}</p>
        </article>
        <article className="rounded-lg border bg-white p-5 sm:col-span-2">
          <p className="text-sm text-gray-500">Valor previsto das reservas ativas no mês</p>
          <p className="mt-2 text-3xl font-bold">
            {formatCurrency(report.scheduledValueCents / 100)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Estimativa baseada no valor registrado no momento da reserva; não representa receita recebida.
          </p>
        </article>
      </section>
    </main>
  )
}