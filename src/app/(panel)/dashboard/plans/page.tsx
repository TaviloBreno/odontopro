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
    <div className="container mx-auto px-4 py-8">

      {/* Header */}
      {!subscritpion?.status && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Selecione o plano ideal para sua clínica e tenha acesso a todas as ferramentas necessárias para gerenciar seus agendamentos e pacientes.
          </p>
        </div>
      )}

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