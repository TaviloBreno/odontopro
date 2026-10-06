"use server"

import prisma from '@/lib/prisma'
import { getStripe } from '@/utils/stripe'
import { Plan } from '@prisma/client'
import { getClinicAccess } from '@/lib/clinic-access'

interface SubscriptionProps {
  type: Plan;
}


export async function createSubscription({ type }: SubscriptionProps) {
  const stripe = getStripe();

  const access = await getClinicAccess()
  const userId = access?.role === "ADMIN" ? access.clinicId : null

  if (!userId) {
    return {
      sessionId: "",
      error: "Falha ao ativar plano."
    }
  }

  const findUser = await prisma.user.findFirst({
    where: {
      id: userId
    }
  })

  if (!findUser) {
    return {
      sessionId: "",
      error: "Falha ao ativar plano."
    }
  }

  const configuredPriceId = {
    BASIC: process.env.STRIPE_PLAN_BASIC,
    PROFESSIONAL: process.env.STRIPE_PLAN_PROFISSIONAL,
    PREMIUM: process.env.STRIPE_PLAN_PREMIUM,
  }[type]
  const platformPlan = await prisma.platformPlan.findUnique({
    where: { key: type },
    select: { active: true, stripePriceId: true },
  })

  if (platformPlan && !platformPlan.active) {
    return { sessionId: "", error: "Este plano não está disponível para contratação." }
  }
  const priceId = platformPlan?.stripePriceId || configuredPriceId
  if (!priceId) {
    return {
      sessionId: "",
      error: "O preço deste plano ainda não está configurado.",
    }
  }

  let customerId = findUser.stripe_customer_id;

  if (!customerId) {
    // Caso o user não tenha um stripe_customer_id então criamos ele como cliente
    const stripeCustomer = await stripe.customers.create({
      email: findUser.email
    })

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripe_customer_id: stripeCustomer.id
      }
    })

    customerId = stripeCustomer.id;
  }


  // CRIAR O CHECKOUT
  try {

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        }
      ],
      metadata: {
        type: type
      },
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    })


    return {
      sessionId: stripeCheckoutSession.id
    }

  } catch (err) {
    console.log("ERRO AO CRIAR CHECKOUT")
    console.log(err)
    return {
      sessionId: "",
      error: "Falha ao ativar plano."
    }
  }

}