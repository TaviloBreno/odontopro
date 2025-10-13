
export type PlanDetailsProps = {
  maxServices: number;
}

export type PlansProps = {
  BASIC: PlanDetailsProps;
  PROFESSIONAL: PlanDetailsProps;
}

export const PLANS: PlansProps = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
    maxServices: 50
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
      `Até ${PLANS["BASIC"].maxServices} serviços cadastrados`,
      'Agendamentos ilimitados online',
      'Calendário de disponibilidade',
      'Perfil público da clínica',
      'Notificações por email',
      'Suporte por chat',
      'Relatórios básicos de agendamentos',
      'Integração com Google Calendar'
    ]
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    description: "Ideal para clinicas grandes",
    oldPrice: "R$ 197,90",
    price: "R$ 97,90",
    features: [
      `Até ${PLANS["PROFESSIONAL"].maxServices} serviços cadastrados`,
      'Agendamentos ilimitados online',
      'Calendário avançado com múltiplos horários',
      'Perfil público personalizado com tema',
      'Notificações por email e SMS',
      'Suporte prioritário 24/7',
      'Relatórios avançados com gráficos',
      'Integração com Google e Outlook Calendar',
      'Sistema de lembretes automáticos',
      'Gestão de múltiplos profissionais',
      'Controle de estoque básico',
      'Backup automático dos dados',
      'Badge "Profissional Verificado"'
    ]
  }
]