import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { GridPlans } from './_components/grid-plans'
import { getSubscription } from '@/utils/get-subscription'
import { SubscriptionDetail } from './_components/subscription-detail'
import { SuccessMessage } from './_components/success-message'

interface PlansProps {
  searchParams: Promise<{ 
    success?: string
    canceled?: string
    plan?: string
  }>
}

export default async function Plans({ searchParams }: PlansProps) {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const params = await searchParams
  const subscritpion = await getSubscription({ userId: session?.user?.id! })

  return (
    <div>

      {params.success && (
        <SuccessMessage plan={params.plan || 'BASIC'} />
      )}

      {params.canceled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            ⚠️ Pagamento cancelado. Você pode tentar novamente quando quiser.
          </p>
        </div>
      )}

      {subscritpion?.status !== "active" && (
        <GridPlans />
      )}

      {subscritpion?.status === "active" && (
        <SubscriptionDetail subscription={subscritpion!} />
      )}

    </div>
  )
}