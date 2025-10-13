"use client"

import { Button } from "@/components/ui/button"
import { Plan } from "@prisma/client"
import { createSubscription } from '../_actions/create-subscription'
import { toast } from 'sonner'
import { getStripeJs } from '@/utils/stripe-js'

interface SubscriptionButtonProps {
  type: Plan
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {

  async function handleCreateBilling() {

    const { sessionId, error } = await createSubscription({ type: type })

    if (error) {
      toast.error(error)
      return;
    }

    // Verificar se é um sessionId de teste
    if (sessionId.startsWith('test_session_')) {
      // Redirecionar para página de checkout de teste
      toast.success(`🛒 Redirecionando para checkout de teste...`)
      
      // Redirecionar para a tela de checkout de teste
      window.location.href = `/checkout/test?session_id=${sessionId}`
      
      return;
    }

    // Fluxo normal do Stripe
    try {
      const stripe = await getStripeJs();

      if (stripe && 'redirectToCheckout' in stripe) {
        const { error } = await (stripe as any).redirectToCheckout({ sessionId: sessionId })
        
        if (error) {
          toast.error(error.message || 'Erro no checkout')
        }
      } else {
        toast.error('Stripe não configurado corretamente')
      }
    } catch (stripeError) {
      toast.error('Erro ao processar pagamento')
      console.error('Stripe error:', stripeError)
    }

  }


  return (
    <Button
      className={`w-full ${type === "PROFESSIONAL" && "bg-emerald-500 hover:bg-emerald-400"}`}
      onClick={handleCreateBilling}

    >
      Ativar assinatura
    </Button>
  )
}