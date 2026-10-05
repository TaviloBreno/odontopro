import { redirect } from "next/navigation"
import { getClinicAccess } from "@/lib/clinic-access"
import prisma from "@/lib/prisma"
import { AddEmployeeForm } from "./add-employee-form"

export default async function TeamPage() {
  const access = await getClinicAccess()
  if (!access) redirect("/login")
  if (access.role !== "ADMIN") redirect("/dashboard/employee")

  const employees = await prisma.user.findMany({
    where: { clinicOwnerId: access.clinicId, role: "EMPLOYEE" },
    select: { id: true, name: true, email: true, status: true },
    orderBy: { createdAt: "asc" },
  })

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Equipe da clínica</h1>
        <p className="mt-2 text-sm text-gray-600">
          Adicione funcionários usando o e-mail da conta Google com que entrarão.
          Funcionários podem acessar a agenda e os lembretes desta clínica.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-5">
        <AddEmployeeForm />
      </div>

      <div className="rounded-lg border bg-white p-5">
        <h2 className="font-semibold">Funcionários cadastrados</h2>
        {employees.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">Nenhum funcionário cadastrado.</p>
        ) : (
          <ul className="mt-3 divide-y">
            {employees.map((employee) => (
              <li className="flex items-center justify-between py-3" key={employee.id}>
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.email}</p>
                </div>
                <span className={employee.status ? "text-sm text-emerald-700" : "text-sm text-gray-500"}>
                  {employee.status ? "Ativo" : "Desativado"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
