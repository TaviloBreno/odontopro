
export type PlanDetailsProps = {
  maxServices: number;
}

export type PlansProps = {
  BASIC: PlanDetailsProps;
  PROFESSIONAL: PlanDetailsProps;
  PREMIUM: PlanDetailsProps;
}

export const PLANS: PlansProps = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
    maxServices: 50
  },
  PREMIUM: {
    maxServices: 999,
  }
}


export const subscriptionPlans = [
  {
    id: "BASIC",
    name: "Basic",
    description: "Perfeito para clinicas menores",
    oldPrice: "R$ 97,90",
    price: "R$ 27,90",
    features: [
      `Até ${PLANS["BASIC"].maxServices} serviços`,
      'Agendamentos ilimitados',
      'Suporte',
      'Relatórios',
    ]
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    description: "Ideal para clinicas grandes",
    oldPrice: "R$ 197,90",
    price: "R$ 97,90",
    features: [
      `Até ${PLANS["PROFESSIONAL"].maxServices} serviços`,
      'Agendamentos ilimitados',
      'Suporte prioritário',
      'Relatórios avançados',
    ]
  },
  {
    id: "PREMIUM",
    name: "Premium IA",
    description: "Tecnologia de ponta com Inteligência Artificial",
    oldPrice: "R$ 397,90",
    price: "R$ 197,90",
    features: [
      `Até ${PLANS["PREMIUM"].maxServices} serviços`,
      "Todos os recursos do plano Profissional",
      "Ferramentas de IA e análise avançada",
    ],
  }
]