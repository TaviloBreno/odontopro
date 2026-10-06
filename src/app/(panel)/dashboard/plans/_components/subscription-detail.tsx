"use client"

import { PlatformPlan, Subscription } from "@prisma/client";
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { createPortalCustomer } from '../_actions/create-portal-customer'

interface SubscriptionDetailProps {
  subscription: Subscription;
  plan: PlatformPlan | null
}

export function SubscriptionDetail({ subscription, plan }: SubscriptionDetailProps) {


  async function handleManageSubscription() {
    const portal = await createPortalCustomer()

    if (portal.error) {
      toast.error("Ocorreu um erro ao criar o portal de assinatura")
      return;
    }

    window.location.href = portal.sessionId;

  }


  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Seu Plano Atual</CardTitle>
        <CardDescription>
          Sua assinatura está ativa!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg md:text-xl">
            {plan?.name ?? subscription.plan}
          </h3>

          <div className="bg-green-500 text-white w-fit px-4 py-1 rounded-md">
            {subscription.status === "active" ? "ATIVO" : "INATIVO"}
          </div>
        </div>

        <ul className="list-disc list-inside space-y-2">
          {plan?.features.map(feature => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleManageSubscription}
        >
          Gerenciar assinatura
        </Button>
      </CardFooter>
    </Card>
  )

}