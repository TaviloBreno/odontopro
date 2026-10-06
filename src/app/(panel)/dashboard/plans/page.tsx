import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { GridPlans } from './_components/grid-plans'
import { getSubscription } from '@/utils/get-subscription'
import { SubscriptionDetail } from './_components/subscription-detail'
import { getClinicAccess } from '@/lib/clinic-access'
import prisma from "@/lib/prisma"

export default async function Plans() {
  const access = await getClinicAccess()
  if (!access) redirect("/login")
  if (access.role !== "ADMIN") redirect("/dashboard/employee")

  const subscription = await getSubscription({ userId: access.clinicId })

  if (subscription?.status === "active") {
    const plan = await prisma.platformPlan.findUnique({
      where: { key: subscription.plan },
    })
    return <SubscriptionDetail subscription={subscription} plan={plan} />
  }

  const plans = await prisma.platformPlan.findMany({
    where: { active: true },
    orderBy: { monthlyPriceCents: "asc" },
  })

  return <GridPlans plans={plans} />
}