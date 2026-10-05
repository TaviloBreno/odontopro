import { Suspense } from 'react'
import getSesion from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { ServicesContent } from './_components/service-content'
import { getClinicAccess } from '@/lib/clinic-access'

export default async function Services() {
  const access = await getClinicAccess()
  if (!access) redirect("/login")
  if (access.role !== "ADMIN") redirect("/dashboard/employee")


  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ServicesContent userId={access.clinicId} />
    </Suspense>
  )
}