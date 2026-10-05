"use server"

import prisma from "@/lib/prisma";
import { getStripe } from '@/utils/stripe'
import { getClinicAccess } from '@/lib/clinic-access'


export async function createPortalCustomer() {
  const stripe = getStripe();
  const access = await getClinicAccess()

  if (!access || access.role !== "ADMIN") {
    return {
      sessionId: "",
      error: "Usuário nao encontrado"
    }
  }

  const user = await prisma.user.findFirst({
    where: {
      id: access.clinicId
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