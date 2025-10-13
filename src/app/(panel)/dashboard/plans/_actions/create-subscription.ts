"use server"

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { stripe } from '@/utils/stripe'
import { Plan } from '@prisma/client'

interface SubscriptionProps {
  type: Plan;
}


export async function createSubscription({ type }: SubscriptionProps) {

  const session = await auth();
  const userId = session?.user?.id;

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
          price: type === "BASIC" ? process.env.STRIPE_PLAN_BASIC : process.env.STRIPE_PLAN_PROFISSIONAL,
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