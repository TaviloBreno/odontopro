import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import type { PlatformPlan } from "@prisma/client"
import { SubscriptionButton } from "./subscription-button"

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

export function GridPlans({ plans }: { plans: PlatformPlan[] }) {
  if (plans.length === 0) {
    return (
      <p className="rounded-md border bg-white p-5">
        Nenhum plano está disponível no momento.
      </p>
    )
  }

  return (
    <section className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3">
      {plans.map((plan, index) => (
        <Card
          key={plan.key}
          className={`mx-auto flex w-full flex-col ${index === 1 ? "border-emerald-500" : ""}`}
        >
          {index === 1 && (
            <div className="w-full rounded-t-xl bg-emerald-500 py-3 text-center">
              <p className="font-semibold text-white">PLANO EM DESTAQUE</p>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature} className="text-sm md:text-base">{feature}</li>
              ))}
            </ul>
            <div className="mt-4">
              {plan.previousPriceCents !== null && (
                <p className="text-gray-600 line-through">
                  {formatPrice(plan.previousPriceCents)}
                </p>
              )}
              <p className="text-2xl font-bold text-black">
                {formatPrice(plan.monthlyPriceCents)} / mês
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <SubscriptionButton type={plan.key} />
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}
