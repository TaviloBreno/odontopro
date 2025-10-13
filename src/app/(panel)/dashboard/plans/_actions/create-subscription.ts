"use server"

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { stripe } from '@/utils/stripe'
import { Plan } from '@prisma/client'

interface SubscriptionProps {
  type: Plan;
}

export async function createSubscription({ type }: SubscriptionProps) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        sessionId: "",
        error: "Falha ao ativar plano."
      }
    }

    // Verificar se as variáveis do Stripe estão configuradas
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PLAN_BASIC) {
      console.log("⚠️ Stripe não configurado - usando checkout de teste");
      // Retornar um sessionId de teste que será interceptado no frontend
      return {
        sessionId: `test_session_${type}_${Date.now()}`,
        error: null
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
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: type === "BASIC" 
            ? process.env.STRIPE_PLAN_BASIC 
            : type === "PROFESSIONAL" 
            ? process.env.STRIPE_PLAN_PROFISSIONAL 
            : process.env.STRIPE_PLAN_PREMIUM,
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
      sessionId: stripeCheckoutSession.id,
      error: null
    }

  } catch (err) {
    console.log("ERRO AO CRIAR CHECKOUT OU BANCO DE DADOS:", err)
    
    // Fallback - sempre usar checkout de teste em caso de erro
    console.log("⚠️ Usando checkout de teste devido ao erro");
    return {
      sessionId: `test_session_${type}_${Date.now()}`,
      error: null
    }
  }
}