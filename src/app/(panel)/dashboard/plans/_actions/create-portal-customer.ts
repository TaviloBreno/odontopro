"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { stripe } from '@/utils/stripe'


export async function createPortalCustomer() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      sessionId: "",
      error: "Usuário nao encontrado"
    }
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session?.user?.id
    }
  })

  if (!user) {
    return {
      sessionId: "",
      error: "Usuário nao encontrado"
    }
  }


  const sessionId = user.stripe_customer_id;

  if (!sessionId) {
    return {
      sessionId: "",
      error: "Usuário nao encontrado"
    }
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sessionId,
      return_url: process.env.STRIPE_SUCCESS_URL as string
    })

    return {
      sessionId: portalSession.url
    }
  } catch (err) {
    console.log("ERRO AO CRIAR PORTAL: ", err)

    return {
      sessionId: "",
      error: "Usuário nao encontrado"
    }
  }

}