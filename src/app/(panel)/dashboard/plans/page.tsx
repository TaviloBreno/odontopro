import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { GridPlans } from './_components/grid-plans'
import { getSubscription } from '@/utils/get-subscription'
import { SubscriptionDetail } from './_components/subscription-detail'
import { getClinicAccess } from '@/lib/clinic-access'

export default async function Plans() {
  const access = await getClinicAccess()
  if (!access) redirect("/login")
  if (access.role !== "ADMIN") redirect("/dashboard/employee")

  const subscritpion = await getSubscription({ userId: access.clinicId })

  return (
    <div>

      {subscritpion?.status !== "active" && (
        <GridPlans />
      )}

      {subscritpion?.status === "active" && (
        <SubscriptionDetail subscription={subscritpion!} />
      )}

    </div>
  )
}