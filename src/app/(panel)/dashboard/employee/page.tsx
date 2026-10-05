import { redirect } from "next/navigation"
import { getClinicAccess } from "@/lib/clinic-access"
import { Appointments } from "../_components/appointments/appointments"
import { Reminders } from "../_components/reminder/reminders"

export default async function EmployeeDashboard() {
  const access = await getClinicAccess()

  if (!access) redirect("/login")
  if (access.role !== "EMPLOYEE") redirect("/dashboard")

  return (
    <main>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Painel do funcionário</h1>
        <p className="text-sm text-gray-600">
          Agenda e lembretes da clínica. Para perfil, serviços e equipe, fale com o administrador.
        </p>
      </header>
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Appointments userId={access.clinicId} />
        <Reminders userId={access.clinicId} />
      </section>
    </main>
  )
}
