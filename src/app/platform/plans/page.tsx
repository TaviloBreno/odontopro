import { Plan } from "@prisma/client"
import { PlanEditor } from "./plan-editor"
import prisma from "@/lib/prisma"

const defaultPlans = [
  {
    key: Plan.BASIC,
    name: "Básico",
    description: "Para clínicas menores",
    monthlyPriceCents: 2790,
    previousPriceCents: 9790,
    features: ["Até 3 serviços", "Agendamentos ilimitados", "Suporte", "Relatórios"],
    stripePriceId: null,
    active: true,
  },
  {
    key: Plan.PROFESSIONAL,
    name: "Profissional",
    description: "Para clínicas em crescimento",
    monthlyPriceCents: 9790,
    previousPriceCents: 19790,
    features: ["Até 50 serviços", "Agendamentos ilimitados", "Suporte prioritário", "Relatórios avançados"],
    stripePriceId: null,
    active: true,
  },
  {
    key: Plan.PREMIUM,
    name: "Premium IA",
    description: "Tecnologia e recursos avançados",
    monthlyPriceCents: 19790,
    previousPriceCents: 39790,
    features: ["Até 999 serviços", "Todos os recursos Profissional", "Ferramentas de IA e análise avançada"],
    stripePriceId: null,
    active: true,
  },
]

export default async function PlatformPlansPage() {
  const storedPlans = await prisma.platformPlan.findMany({
    orderBy: { monthlyPriceCents: "asc" },
  })
  const planByKey = new Map(storedPlans.map((plan) => [plan.key, plan]))
  const plans = defaultPlans.map((defaults) => planByKey.get(defaults.key) ?? defaults)

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Planos comerciais</h1>
        <p className="max-w-3xl text-gray-600">
          Configure nome, preço, recursos e Price ID do Stripe. Administradores
          de clínicas visualizam os planos ativos e podem contratar; somente a
          administração da plataforma pode editar esta configuração.
        </p>
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
          As categorias e seus limites funcionais (Básico, Profissional e Premium)
          são fixos no sistema. Preencha o Stripe Price ID para habilitar a compra
          de cada plano.
        </p>
      </header>
      <PlanEditor plans={plans} />
    </div>
  )
}
