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

    const stripe = await getStripeJs();

    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: sessionId })
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