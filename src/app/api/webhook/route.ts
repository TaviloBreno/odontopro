import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/utils/stripe'
import { manageSubscription } from '@/utils/manage-subscription'
import { Plan } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/structured-logger'



export const POST = async (request: Request) => {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_SECRET_WEBHOOK_KEY as string,
  )


  switch (event.type) {
    case "customer.subscription.deleted":
      const payment = event.data.object as Stripe.Subscription;

      await manageSubscription(
        payment.id,
        payment.customer.toString(),
        false,
        true
      )

      break;
    case "customer.subscription.updated":
      const paymentIntent = event.data.object as Stripe.Subscription;

      await manageSubscription(
        paymentIntent.id,
        paymentIntent.customer.toString(),
        false,
      )

      revalidatePath("/dashboard/plans")

      break;
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      const type = checkoutSession?.metadata?.type ? checkoutSession?.metadata?.type : "BASIC";

      if (checkoutSession.subscription && checkoutSession.customer) {
        await manageSubscription(
          checkoutSession.subscription.toString(),
          checkoutSession.customer.toString(),
          true,
          false,
          type as Plan
        )
      }

      revalidatePath("/dashboard/plans")

      break;

    default:
      logger.info("stripe.webhook.ignored", { eventType: event.type })
  }

  return NextResponse.json({ received: true })

}
