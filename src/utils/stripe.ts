import Stripe from 'stripe';

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY must be configured to use Stripe.");
  }

  return new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia"
  });
}