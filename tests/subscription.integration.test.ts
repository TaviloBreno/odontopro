import { beforeEach, describe, expect, it, vi } from "vitest"
import prisma from "@/lib/prisma"
import { manageSubscription } from "@/utils/manage-subscription"
import { useClinicFixture } from "./helpers/fixtures"

const retrieve = vi.fn()
vi.mock("@/utils/stripe", () => ({
  getStripe: () => ({
    subscriptions: { retrieve },
  }),
}))

const fixture = useClinicFixture()

describe("Stripe subscription synchronization", () => {
  beforeEach(async () => {
    retrieve.mockReset()
    await prisma.user.update({
      where: { id: fixture.clinic.id },
      data: { stripe_customer_id: "cus-vitest-subscription" },
    })
  })

  it("handles repeated checkout subscription events without duplicate subscriptions", async () => {
    retrieve.mockResolvedValue({
      id: "sub-vitest-repeat",
      status: "active",
      items: { data: [{ price: { id: "price-vitest" } }] },
    })

    await manageSubscription(
      "sub-vitest-repeat",
      "cus-vitest-subscription",
      true,
      false,
      "PROFESSIONAL",
    )
    await manageSubscription(
      "sub-vitest-repeat",
      "cus-vitest-subscription",
      true,
      false,
      "PROFESSIONAL",
    )

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: fixture.clinic.id },
    })
    expect(subscriptions).toHaveLength(1)
    expect(subscriptions[0]).toMatchObject({
      id: "sub-vitest-repeat",
      status: "active",
      plan: "PROFESSIONAL",
      priceId: "price-vitest",
    })
  })

  it("updates subscription status and removes a deleted subscription", async () => {
    await prisma.subscription.create({
      data: {
        id: "sub-vitest-update",
        userId: fixture.clinic.id,
        status: "active",
        plan: "BASIC",
        priceId: "price-old",
      },
    })
    retrieve.mockResolvedValue({
      id: "sub-vitest-update",
      status: "past_due",
      items: { data: [{ price: { id: "price-new" } }] },
    })

    await manageSubscription("sub-vitest-update", "cus-vitest-subscription")
    expect(await prisma.subscription.findUniqueOrThrow({
      where: { id: "sub-vitest-update" },
    })).toMatchObject({ status: "past_due", priceId: "price-new" })

    await manageSubscription(
      "sub-vitest-update",
      "cus-vitest-subscription",
      false,
      true,
    )
    expect(await prisma.subscription.findUnique({
      where: { id: "sub-vitest-update" },
    })).toBeNull()
  })
})
