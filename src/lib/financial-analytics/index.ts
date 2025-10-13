interface FinancialMetrics {
  revenue: {
    total: number
    monthly: number
    yearly: number
    growth: number
    forecast: number
  }
  profitability: {
    grossMargin: number
    netMargin: number
    operatingMargin: number
    treatmentProfitability: TreatmentProfitability[]
  }
  expenses: {
    total: number
    categories: ExpenseCategory[]
    trends: ExpenseTrend[]
  }
  cashFlow: {
    current: number
    projected: CashFlowProjection[]
    burnRate: number
  }
  kpis: {
    arpu: number // Average Revenue Per User
    ltv: number // Lifetime Value
    cac: number // Customer Acquisition Cost
    churnRate: number
  }
}

interface TreatmentProfitability {
  treatmentId: string
  treatmentName: string
  category: string
  revenue: number
  cost: number
  profit: number
  margin: number
  volume: number
  averagePrice: number
  trends: {
    period: string
    revenue: number
    volume: number
    margin: number
  }[]
}

interface ExpenseCategory {
  id: string
  name: string
  amount: number
  percentage: number
  budget: number
  variance: number
  subcategories: {
    name: string
    amount: number
    percentage: number
  }[]
}

interface ExpenseTrend {
  period: string
  amount: number
  change: number
  category: string
}

interface CashFlowProjection {
  period: string
  inflow: number
  outflow: number
  netFlow: number
  cumulativeFlow: number
}

interface RevenueBreakdown {
  byTreatment: {
    treatmentName: string
    revenue: number
    percentage: number
    growth: number
  }[]
  byPeriod: {
    period: string
    revenue: number
    growth: number
    transactions: number
  }[]
  byPaymentMethod: {
    method: string
    amount: number
    percentage: number
    fees: number
  }[]
  byInsurance: {
    provider: string
    amount: number
    percentage: number
    pendingClaims: number
  }[]
}

interface ProfitLossStatement {
  period: string
  revenue: {
    treatmentServices: number
    products: number
    insurance: number
    other: number
    total: number
  }
  expenses: {
    salaries: number
    rent: number
    equipment: number
    supplies: number
    insurance: number
    marketing: number
    utilities: number
    other: number
    total: number
  }
  grossProfit: number
  operatingExpenses: number
  ebitda: number
  depreciation: number
  ebit: number
  taxes: number
  netIncome: number
}

interface BudgetAnalysis {
  categories: {
    name: string
    budgeted: number
    actual: number
    variance: number
    variancePercentage: number
    ytdBudgeted: number
    ytdActual: number
  }[]
  overallVariance: number
  forecastAccuracy: number
}

interface FinancialForecast {
  revenueProjections: {
    conservative: number
    realistic: number
    optimistic: number
    period: string
  }[]
  expenseProjections: {
    fixed: number
    variable: number
    total: number
    period: string
  }[]
  profitProjections: {
    gross: number
    net: number
    period: string
  }[]
  scenarios: {
    name: string
    assumptions: string[]
    projectedRevenue: number
    projectedProfit: number
    riskLevel: 'low' | 'medium' | 'high'
  }[]
}

interface PatientValueAnalysis {
  segments: {
    name: string
    count: number
    averageValue: number
    totalValue: number
    retentionRate: number
    frequency: number
  }[]
  cohortAnalysis: {
    cohort: string
    initialPatients: number
    retainedPatients: number[]
    revenue: number[]
    ltv: number
  }[]
  rfmAnalysis: {
    segment: string
    recency: number
    frequency: number
    monetary: number
    patientCount: number
    characteristics: string[]
  }[]
}

class FinancialAnalyticsService {
  private static instance: FinancialAnalyticsService
  private metrics!: FinancialMetrics
  private revenueBreakdown!: RevenueBreakdown
  private profitLoss!: ProfitLossStatement[]
  private budgetAnalysis!: BudgetAnalysis
  private forecast!: FinancialForecast
  private patientAnalysis!: PatientValueAnalysis

  private constructor() {
    this.initializeData()
  }

  public static getInstance(): FinancialAnalyticsService {
    if (!FinancialAnalyticsService.instance) {
      FinancialAnalyticsService.instance = new FinancialAnalyticsService()
    }
    return FinancialAnalyticsService.instance
  }

  private initializeData() {
    // Métricas Financeiras
    this.metrics = {
      revenue: {
        total: 125000,
        monthly: 25000,
        yearly: 300000,
        growth: 15.7,
        forecast: 350000
      },
      profitability: {
        grossMargin: 68.5,
        netMargin: 22.3,
        operatingMargin: 28.7,
        treatmentProfitability: [
          {
            treatmentId: 'implant',
            treatmentName: 'Implante Dentário',
            category: 'Cirurgia',
            revenue: 45000,
            cost: 18000,
            profit: 27000,
            margin: 60,
            volume: 15,
            averagePrice: 3000,
            trends: [
              { period: 'Jan', revenue: 12000, volume: 4, margin: 62 },
              { period: 'Fev', revenue: 15000, volume: 5, margin: 58 },
              { period: 'Mar', revenue: 18000, volume: 6, margin: 61 }
            ]
          },
          {
            treatmentId: 'orthodontics',
            treatmentName: 'Ortodontia',
            category: 'Estética',
            revenue: 35000,
            cost: 15000,
            profit: 20000,
            margin: 57,
            volume: 25,
            averagePrice: 1400,
            trends: [
              { period: 'Jan', revenue: 10000, volume: 7, margin: 55 },
              { period: 'Fev', revenue: 12000, volume: 8, margin: 58 },
              { period: 'Mar', revenue: 13000, volume: 10, margin: 59 }
            ]
          },
          {
            treatmentId: 'cleaning',
            treatmentName: 'Limpeza e Prevenção',
            category: 'Preventiva',
            revenue: 18000,
            cost: 6000,
            profit: 12000,
            margin: 67,
            volume: 120,
            averagePrice: 150,
            trends: [
              { period: 'Jan', revenue: 5500, volume: 37, margin: 68 },
              { period: 'Fev', revenue: 6000, volume: 40, margin: 66 },
              { period: 'Mar', revenue: 6500, volume: 43, margin: 68 }
            ]
          }
        ]
      },
      expenses: {
        total: 78000,
        categories: [
          {
            id: 'salaries',
            name: 'Salários e Encargos',
            amount: 35000,
            percentage: 44.9,
            budget: 32000,
            variance: 3000,
            subcategories: [
              { name: 'Salários', amount: 28000, percentage: 80 },
              { name: 'Encargos', amount: 7000, percentage: 20 }
            ]
          },
          {
            id: 'supplies',
            name: 'Material e Insumos',
            amount: 18000,
            percentage: 23.1,
            budget: 20000,
            variance: -2000,
            subcategories: [
              { name: 'Material Clínico', amount: 12000, percentage: 66.7 },
              { name: 'Medicamentos', amount: 4000, percentage: 22.2 },
              { name: 'Material de Limpeza', amount: 2000, percentage: 11.1 }
            ]
          },
          {
            id: 'infrastructure',
            name: 'Infraestrutura',
            amount: 15000,
            percentage: 19.2,
            budget: 15500,
            variance: -500,
            subcategories: [
              { name: 'Aluguel', amount: 8000, percentage: 53.3 },
              { name: 'Utilities', amount: 3500, percentage: 23.3 },
              { name: 'Manutenção', amount: 2000, percentage: 13.3 },
              { name: 'Segurança', amount: 1500, percentage: 10 }
            ]
          },
          {
            id: 'marketing',
            name: 'Marketing e Publicidade',
            amount: 6000,
            percentage: 7.7,
            budget: 8000,
            variance: -2000,
            subcategories: [
              { name: 'Marketing Digital', amount: 3500, percentage: 58.3 },
              { name: 'Material Gráfico', amount: 1500, percentage: 25 },
              { name: 'Eventos', amount: 1000, percentage: 16.7 }
            ]
          },
          {
            id: 'other',
            name: 'Outros',
            amount: 4000,
            percentage: 5.1,
            budget: 5000,
            variance: -1000,
            subcategories: [
              { name: 'Seguros', amount: 2000, percentage: 50 },
              { name: 'Taxas e Impostos', amount: 1200, percentage: 30 },
              { name: 'Diversos', amount: 800, percentage: 20 }
            ]
          }
        ],
        trends: [
          { period: 'Jan', amount: 25000, change: -2.5, category: 'Total' },
          { period: 'Fev', amount: 26000, change: 4.0, category: 'Total' },
          { period: 'Mar', amount: 27000, change: 3.8, category: 'Total' }
        ]
      },
      cashFlow: {
        current: 47000,
        projected: [
          { period: 'Abr', inflow: 28000, outflow: 25000, netFlow: 3000, cumulativeFlow: 50000 },
          { period: 'Mai', inflow: 30000, outflow: 26000, netFlow: 4000, cumulativeFlow: 54000 },
          { period: 'Jun', inflow: 32000, outflow: 27000, netFlow: 5000, cumulativeFlow: 59000 },
          { period: 'Jul', inflow: 35000, outflow: 28000, netFlow: 7000, cumulativeFlow: 66000 },
          { period: 'Ago', inflow: 33000, outflow: 29000, netFlow: 4000, cumulativeFlow: 70000 },
          { period: 'Set', inflow: 36000, outflow: 30000, netFlow: 6000, cumulativeFlow: 76000 }
        ],
        burnRate: 2.5
      },
      kpis: {
        arpu: 850, // Receita média por paciente
        ltv: 3400, // Valor vitalício do cliente
        cac: 150, // Custo de aquisição de cliente
        churnRate: 8.5 // Taxa de cancelamento
      }
    }

    // Breakdown de Receita
    this.revenueBreakdown = {
      byTreatment: [
        { treatmentName: 'Implante Dentário', revenue: 45000, percentage: 36, growth: 22 },
        { treatmentName: 'Ortodontia', revenue: 35000, percentage: 28, growth: 18 },
        { treatmentName: 'Limpeza', revenue: 18000, percentage: 14.4, growth: 8 },
        { treatmentName: 'Canal', revenue: 15000, percentage: 12, growth: 12 },
        { treatmentName: 'Clareamento', revenue: 8000, percentage: 6.4, growth: 25 },
        { treatmentName: 'Outros', revenue: 4000, percentage: 3.2, growth: 5 }
      ],
      byPeriod: [
        { period: 'Jan', revenue: 38000, growth: 12, transactions: 156 },
        { period: 'Fev', revenue: 41000, growth: 15, transactions: 168 },
        { period: 'Mar', revenue: 46000, growth: 18, transactions: 185 }
      ],
      byPaymentMethod: [
        { method: 'Cartão de Crédito', amount: 62500, percentage: 50, fees: 1875 },
        { method: 'Dinheiro', amount: 31250, percentage: 25, fees: 0 },
        { method: 'PIX', amount: 18750, percentage: 15, fees: 93.75 },
        { method: 'Convênio', amount: 12500, percentage: 10, fees: 625 }
      ],
      byInsurance: [
        { provider: 'Unimed', amount: 35000, percentage: 28, pendingClaims: 8 },
        { provider: 'Bradesco Saúde', amount: 28000, percentage: 22.4, pendingClaims: 5 },
        { provider: 'SulAmérica', amount: 22000, percentage: 17.6, pendingClaims: 3 },
        { provider: 'Particular', amount: 40000, percentage: 32, pendingClaims: 0 }
      ]
    }

    // Demonstrativo de Resultados
    this.profitLoss = [
      {
        period: 'Mar 2024',
        revenue: {
          treatmentServices: 110000,
          products: 8000,
          insurance: 5000,
          other: 2000,
          total: 125000
        },
        expenses: {
          salaries: 35000,
          rent: 8000,
          equipment: 3000,
          supplies: 18000,
          insurance: 2000,
          marketing: 6000,
          utilities: 3500,
          other: 2500,
          total: 78000
        },
        grossProfit: 47000,
        operatingExpenses: 78000,
        ebitda: 47000,
        depreciation: 3000,
        ebit: 44000,
        taxes: 15400,
        netIncome: 28600
      }
    ]

    // Análise de Orçamento
    this.budgetAnalysis = {
      categories: [
        {
          name: 'Receita',
          budgeted: 120000,
          actual: 125000,
          variance: 5000,
          variancePercentage: 4.17,
          ytdBudgeted: 360000,
          ytdActual: 375000
        },
        {
          name: 'Salários',
          budgeted: 32000,
          actual: 35000,
          variance: -3000,
          variancePercentage: -9.38,
          ytdBudgeted: 96000,
          ytdActual: 105000
        },
        {
          name: 'Material',
          budgeted: 20000,
          actual: 18000,
          variance: 2000,
          variancePercentage: 10,
          ytdBudgeted: 60000,
          ytdActual: 54000
        },
        {
          name: 'Marketing',
          budgeted: 8000,
          actual: 6000,
          variance: 2000,
          variancePercentage: 25,
          ytdBudgeted: 24000,
          ytdActual: 18000
        }
      ],
      overallVariance: 6000,
      forecastAccuracy: 92.5
    }

    // Previsões Financeiras
    this.forecast = {
      revenueProjections: [
        { conservative: 130000, realistic: 140000, optimistic: 155000, period: 'Abr' },
        { conservative: 135000, realistic: 145000, optimistic: 160000, period: 'Mai' },
        { conservative: 140000, realistic: 150000, optimistic: 165000, period: 'Jun' }
      ],
      expenseProjections: [
        { fixed: 45000, variable: 35000, total: 80000, period: 'Abr' },
        { fixed: 45000, variable: 37000, total: 82000, period: 'Mai' },
        { fixed: 46000, variable: 39000, total: 85000, period: 'Jun' }
      ],
      profitProjections: [
        { gross: 95000, net: 35000, period: 'Abr' },
        { gross: 98000, net: 37000, period: 'Mai' },
        { gross: 104000, net: 41000, period: 'Jun' }
      ],
      scenarios: [
        {
          name: 'Cenário Conservador',
          assumptions: ['Crescimento 5%/mês', 'Sem novos investimentos', 'Mercado estável'],
          projectedRevenue: 1560000,
          projectedProfit: 390000,
          riskLevel: 'low'
        },
        {
          name: 'Cenário Realista',
          assumptions: ['Crescimento 8%/mês', 'Investimento em marketing', 'Expansão gradual'],
          projectedRevenue: 1680000,
          projectedProfit: 420000,
          riskLevel: 'medium'
        },
        {
          name: 'Cenário Otimista',
          assumptions: ['Crescimento 12%/mês', 'Expansão agressiva', 'Novos serviços'],
          projectedRevenue: 1980000,
          projectedProfit: 495000,
          riskLevel: 'high'
        }
      ]
    }

    // Análise de Valor do Paciente
    this.patientAnalysis = {
      segments: [
        {
          name: 'Pacientes Premium',
          count: 85,
          averageValue: 5200,
          totalValue: 442000,
          retentionRate: 95,
          frequency: 4.2
        },
        {
          name: 'Pacientes Regulares',
          count: 320,
          averageValue: 1800,
          totalValue: 576000,
          retentionRate: 78,
          frequency: 2.8
        },
        {
          name: 'Pacientes Ocasionais',
          count: 180,
          averageValue: 650,
          totalValue: 117000,
          retentionRate: 45,
          frequency: 1.2
        }
      ],
      cohortAnalysis: [
        {
          cohort: 'Jan 2023',
          initialPatients: 50,
          retainedPatients: [48, 45, 42, 40, 38, 36, 35, 34, 33, 32, 31, 30],
          revenue: [75000, 72000, 68000, 65000, 62000, 58000, 55000, 52000, 50000, 48000, 46000, 44000],
          ltv: 3800
        },
        {
          cohort: 'Fev 2023',
          initialPatients: 65,
          retainedPatients: [62, 58, 55, 52, 50, 48, 46, 44, 43, 42, 41, 40],
          revenue: [95000, 89000, 84000, 80000, 76000, 72000, 68000, 65000, 62000, 59000, 57000, 55000],
          ltv: 3650
        }
      ],
      rfmAnalysis: [
        {
          segment: 'Champions',
          recency: 1,
          frequency: 5,
          monetary: 4500,
          patientCount: 45,
          characteristics: ['Alta frequência', 'Alto valor', 'Recente']
        },
        {
          segment: 'Loyal Customers',
          recency: 2,
          frequency: 4,
          monetary: 3200,
          patientCount: 89,
          characteristics: ['Frequência alta', 'Valor médio-alto', 'Lealdade']
        },
        {
          segment: 'Potential Loyalists',
          recency: 1,
          frequency: 2,
          monetary: 1800,
          patientCount: 125,
          characteristics: ['Recentes', 'Potencial de crescimento']
        },
        {
          segment: 'At Risk',
          recency: 4,
          frequency: 3,
          monetary: 2800,
          patientCount: 67,
          characteristics: ['Não vieram recentemente', 'Alto valor histórico']
        }
      ]
    }
  }

  // Métodos de acesso aos dados
  public getFinancialMetrics(): FinancialMetrics {
    return this.metrics
  }

  public getRevenueBreakdown(): RevenueBreakdown {
    return this.revenueBreakdown
  }

  public getProfitLossStatement(period?: string): ProfitLossStatement[] {
    return this.profitLoss
  }

  public getBudgetAnalysis(): BudgetAnalysis {
    return this.budgetAnalysis
  }

  public getFinancialForecast(): FinancialForecast {
    return this.forecast
  }

  public getPatientValueAnalysis(): PatientValueAnalysis {
    return this.patientAnalysis
  }

  // Análises personalizadas
  public getTreatmentROI(): { treatmentId: string; roi: number; paybackPeriod: number }[] {
    return this.metrics.profitability.treatmentProfitability.map(treatment => ({
      treatmentId: treatment.treatmentId,
      roi: (treatment.profit / treatment.cost) * 100,
      paybackPeriod: treatment.cost / (treatment.profit / 12) // meses para recuperar investimento
    }))
  }

  public getCashFlowHealth(): {
    status: 'healthy' | 'warning' | 'critical'
    daysOfCash: number
    recommendations: string[]
  } {
    const monthlyBurn = this.metrics.expenses.total
    const currentCash = this.metrics.cashFlow.current
    const daysOfCash = (currentCash / monthlyBurn) * 30

    let status: 'healthy' | 'warning' | 'critical'
    let recommendations: string[] = []

    if (daysOfCash > 90) {
      status = 'healthy'
      recommendations.push('Considere investir em crescimento')
    } else if (daysOfCash > 30) {
      status = 'warning'
      recommendations.push('Monitore fluxo de caixa de perto', 'Considere reduzir gastos não essenciais')
    } else {
      status = 'critical'
      recommendations.push('Ação imediata necessária', 'Acelere cobrança', 'Reduza gastos urgentemente')
    }

    return { status, daysOfCash, recommendations }
  }

  public getKPITrends(): {
    kpi: string
    current: number
    previous: number
    change: number
    trend: 'up' | 'down' | 'stable'
  }[] {
    return [
      {
        kpi: 'ARPU',
        current: this.metrics.kpis.arpu,
        previous: 810,
        change: 4.94,
        trend: 'up'
      },
      {
        kpi: 'LTV',
        current: this.metrics.kpis.ltv,
        previous: 3200,
        change: 6.25,
        trend: 'up'
      },
      {
        kpi: 'CAC',
        current: this.metrics.kpis.cac,
        previous: 165,
        change: -9.09,
        trend: 'down'
      },
      {
        kpi: 'Churn Rate',
        current: this.metrics.kpis.churnRate,
        previous: 9.2,
        change: -7.61,
        trend: 'down'
      }
    ]
  }

  // Relatórios executivos
  public generateExecutiveSummary(): {
    revenue: { value: number; change: number }
    profit: { value: number; margin: number }
    cashFlow: { status: string; days: number }
    topTreatments: string[]
    keyInsights: string[]
    actionItems: string[]
  } {
    const cashFlowHealth = this.getCashFlowHealth()
    
    return {
      revenue: {
        value: this.metrics.revenue.monthly,
        change: this.metrics.revenue.growth
      },
      profit: {
        value: this.profitLoss[0].netIncome,
        margin: this.metrics.profitability.netMargin
      },
      cashFlow: {
        status: cashFlowHealth.status,
        days: cashFlowHealth.daysOfCash
      },
      topTreatments: this.revenueBreakdown.byTreatment
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3)
        .map(t => t.treatmentName),
      keyInsights: [
        `Receita cresceu ${this.metrics.revenue.growth}% no último período`,
        `Implantes representam ${this.revenueBreakdown.byTreatment[0].percentage}% da receita`,
        `Margem líquida de ${this.metrics.profitability.netMargin}% está acima da média do setor`,
        `${this.patientAnalysis.segments[0].count} pacientes premium geram ${((this.patientAnalysis.segments[0].totalValue / 1135000) * 100).toFixed(1)}% da receita`
      ],
      actionItems: [
        'Otimizar processos de tratamentos de alta margem',
        'Implementar programa de retenção para pacientes premium',
        'Analisar oportunidades de redução de custos operacionais',
        'Expandir marketing para tratamentos mais lucrativos'
      ]
    }
  }

  // Utilitários de formatação
  public formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  public formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`
  }

  public getVarianceColor(variance: number): string {
    if (variance > 0) return 'text-green-600'
    if (variance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  public getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'stable': return '➡️'
    }
  }
}

export const financialAnalyticsService = FinancialAnalyticsService.getInstance()

export type {
  FinancialMetrics,
  TreatmentProfitability,
  ExpenseCategory,
  ExpenseTrend,
  CashFlowProjection,
  RevenueBreakdown,
  ProfitLossStatement,
  BudgetAnalysis,
  FinancialForecast,
  PatientValueAnalysis
}