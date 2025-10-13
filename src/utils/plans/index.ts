
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
    maxServices: 999
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
  },
  {
    id: "PREMIUM",
    name: "Premium IA",
    description: "Tecnologia de ponta com Inteligência Artificial",
    oldPrice: "R$ 397,90",
    price: "R$ 197,90",
    features: [
      `Serviços ilimitados (até ${PLANS["PREMIUM"].maxServices})`,
      'Todos os recursos do plano Profissional',
      '🤖 Assistente IA para diagnósticos',
      '🤖 Análise de imagens radiológicas com IA',
      '🤖 Sugestões inteligentes de tratamento',
      '🤖 Chatbot IA para atendimento 24/7',
      '🤖 Predição de reagendamentos com IA',
      '🤖 Otimização automática da agenda',
      '🤖 Análise preditiva de receita',
      '🤖 Sistema de recomendações personalizado',
      '🤖 Transcrição automática de consultas',
      '🤖 Lembretes inteligentes por IA',
      'Dashboard analítico com insights de IA',
      'Integração com equipamentos inteligentes',
      'API exclusiva para desenvolvedores',
      'Suporte dedicado com especialista IA',
      'Treinamento personalizado da equipe',
      'Badge "Clínica do Futuro"'
    ]
  }
]