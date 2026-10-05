import { redirect } from 'next/navigation'
import { getPermissionUserToReports } from './_data-access/get-permission-reprots'
import getSession from '@/lib/getSession'
import { getClinicAccess } from '@/lib/clinic-access'

export default async function Reports() {

  const access = await getClinicAccess()
  if (!access) redirect("/login")
  if (access.role !== "ADMIN") redirect("/dashboard/employee")

  const user = await getPermissionUserToReports({ userId: access.clinicId })

  if (!user) {
    return (
      <main>
        <h1>Você não tem permissão para acessar essa pagina</h1>
        <p>Assine o plano PROFISSIONAL para ter acesso completo!</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Página de relatórios</h1>
    </main>
  )
}