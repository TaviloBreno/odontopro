"use server"

import prisma from "@/lib/prisma"

export async function getSubscription({ userId }: { userId: string }) {

  if (!userId) {
    return null;
  }

  try {

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId
      }
    })

    return subscription;

  } catch (err) {
    return null;
  }

}