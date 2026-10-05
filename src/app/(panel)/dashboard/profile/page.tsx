import getSesion from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { getUserData } from './_data-access/get-info-user'
import { ProfileContent } from './_components/profile'
import { getClinicAccess } from '@/lib/clinic-access'

export default async function Profile() {
  const access = await getClinicAccess()
  if (!access) redirect("/login")
  if (access.role !== "ADMIN") redirect("/dashboard/employee")

  const user = await getUserData({ userId: access.clinicId })

  if (!user) {
    redirect("/")
  }

  return (
    <ProfileContent user={user} />
  )
}