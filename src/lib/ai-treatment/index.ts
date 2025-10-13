export interface Treatment {
  id: string
  name: string
  category: TreatmentCategory
  description: string
  duration: number // em minutos
  baseCost: number
  complexity: 'low' | 'medium' | 'high' | 'very_high'
  prerequisites?: string[]
  contraindications?: string[]
}

export interface TreatmentCategory {
  id: string
  name: string
  color: string
  icon: string
}

export interface PatientCondition {
  id: string
  patientId: string
  condition: string
  severity: 'mild' | 'moderate' | 'severe'
  symptoms: string[]
  diagnosisDate: Date
  status: 'active' | 'treated' | 'monitoring'
}

export interface AIRecommendation {
  id: string
  patientId: string
  treatmentId: string
  treatment: Treatment
  
  // Pontuação e confiança
  confidenceScore: number // 0-100
  priority: 'low' | 'medium' | 'high' | 'urgent'
  
  // Justificativa da IA
  reasoning: string[]
  basedOn: {
    symptoms: string[]
    conditions: string[]
    history: string[]
    riskFactors: string[]
  }
  
  // Predições
  successProbability: number // 0-100
  estimatedOutcome: string
  alternativeTreatments?: string[]
  
  // Cronograma sugerido
  suggestedStartDate: Date
  estimatedDuration: number // dias
  
  // Status
  status: 'pending' | 'accepted' | 'rejected' | 'modified'
  reviewedBy?: string
  reviewDate?: Date
  reviewNotes?: string
  
  // Metadados
  createdAt: Date
  updatedAt: Date
  aiModel: string
  modelVersion: string
}

export interface AIInsight {
  id: string
  type: 'risk_alert' | 'prevention' | 'optimization' | 'trend'
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  patientId?: string
  clinicWide: boolean
  
  // Dados
  data: any
  actionItems?: string[]
  
  // Status
  isRead: boolean
  isDismissed: boolean
  
  createdAt: Date
}

// Dados de tratamentos predefinidos
export const treatmentCategories: TreatmentCategory[] = [
  {
    id: 'preventive',
    name: 'Preventivo',
    color: '#10B981',
    icon: '🛡️'
  },
  {
    id: 'restorative',
    name: 'Restaurador',
    color: '#3B82F6',
    icon: '🔧'
  },
  {
    id: 'surgical',
    name: 'Cirúrgico',
    color: '#EF4444',
    icon: '⚕️'
  },
  {
    id: 'orthodontic',
    name: 'Ortodôntico',
    color: '#8B5CF6',
    icon: '📐'
  },
  {
    id: 'endodontic',
    name: 'Endodôntico',
    color: '#F59E0B',
    icon: '🦷'
  },
  {
    id: 'periodontal',
    name: 'Periodontal',
    color: '#06B6D4',
    icon: '🌱'
  },
  {
    id: 'prosthodontic',
    name: 'Protético',
    color: '#84CC16',
    icon: '👄'
  }
]

export const treatments: Treatment[] = [
  // Preventivo
  {
    id: 'cleaning',
    name: 'Limpeza Dental',
    category: treatmentCategories[0],
    description: 'Profilaxia e remoção de tártaro',
    duration: 30,
    baseCost: 80,
    complexity: 'low'
  },
  {
    id: 'fluoride',
    name: 'Aplicação de Flúor',
    category: treatmentCategories[0],
    description: 'Aplicação tópica de flúor para prevenção',
    duration: 15,
    baseCost: 40,
    complexity: 'low'
  },
  
  // Restaurador
  {
    id: 'filling_composite',
    name: 'Restauração em Resina',
    category: treatmentCategories[1],
    description: 'Restauração com resina composta',
    duration: 45,
    baseCost: 150,
    complexity: 'medium'
  },
  {
    id: 'crown',
    name: 'Coroa Dentária',
    category: treatmentCategories[1],
    description: 'Prótese unitária fixa',
    duration: 90,
    baseCost: 800,
    complexity: 'high',
    prerequisites: ['root_canal']
  },
  
  // Cirúrgico
  {
    id: 'extraction',
    name: 'Extração Dentária',
    category: treatmentCategories[2],
    description: 'Remoção cirúrgica do dente',
    duration: 30,
    baseCost: 120,
    complexity: 'medium'
  },
  {
    id: 'implant',
    name: 'Implante Dentário',
    category: treatmentCategories[2],
    description: 'Implante osteointegrado',
    duration: 120,
    baseCost: 2500,
    complexity: 'very_high'
  },
  
  // Endodôntico
  {
    id: 'root_canal',
    name: 'Tratamento de Canal',
    category: treatmentCategories[4],
    description: 'Endodontia completa',
    duration: 90,
    baseCost: 400,
    complexity: 'high'
  }
]

// Serviço principal de IA
export class AITreatmentService {
  private recommendations: Map<string, AIRecommendation[]> = new Map()
  private insights: AIInsight[] = []
  private patientConditions: Map<string, PatientCondition[]> = new Map()

  constructor() {
    this.initializeSampleData()
  }

  private initializeSampleData() {
    // Simular condições de pacientes
    const sampleConditions: PatientCondition[] = [
      {
        id: 'cond-1',
        patientId: 'patient-1',
        condition: 'Cárie Dentária',
        severity: 'moderate',
        symptoms: ['dor ao mastigar', 'sensibilidade ao doce', 'cavidade visível'],
        diagnosisDate: new Date(),
        status: 'active'
      },
      {
        id: 'cond-2',
        patientId: 'patient-1',
        condition: 'Gengivite',
        severity: 'mild',
        symptoms: ['sangramento gengival', 'inflamação'],
        diagnosisDate: new Date(),
        status: 'active'
      }
    ]

    this.patientConditions.set('patient-1', sampleConditions)
    
    // Gerar recomendações
    this.generateRecommendations('patient-1')
    this.generateClinicalInsights()
  }

  // Gerar recomendações de tratamento usando IA
  generateRecommendations(patientId: string): AIRecommendation[] {
    const conditions = this.patientConditions.get(patientId) || []
    const recommendations: AIRecommendation[] = []

    // Simular análise de IA baseada nas condições
    conditions.forEach(condition => {
      const treatmentRecommendations = this.analyzeCondition(condition, patientId)
      recommendations.push(...treatmentRecommendations)
    })

    // Adicionar recomendações preventivas baseadas em risco
    const preventiveRecommendations = this.generatePreventiveRecommendations(patientId)
    recommendations.push(...preventiveRecommendations)

    this.recommendations.set(patientId, recommendations)
    return recommendations
  }

  private analyzeCondition(condition: PatientCondition, patientId: string): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []

    switch (condition.condition) {
      case 'Cárie Dentária':
        if (condition.severity === 'mild') {
          recommendations.push(this.createRecommendation({
            patientId,
            treatmentId: 'fluoride',
            confidenceScore: 95,
            priority: 'medium',
            reasoning: [
              'Cárie em estágio inicial detectada',
              'Aplicação de flúor pode reverter desmineralização',
              'Tratamento não invasivo recomendado'
            ],
            basedOn: {
              symptoms: condition.symptoms,
              conditions: [condition.condition],
              history: [],
              riskFactors: ['higiene oral inadequada']
            }
          }))
        } else {
          recommendations.push(this.createRecommendation({
            patientId,
            treatmentId: 'filling_composite',
            confidenceScore: 92,
            priority: 'high',
            reasoning: [
              'Cárie em estágio avançado requer restauração',
              'Resina composta preserva estrutura dental',
              'Tratamento definitivo necessário'
            ],
            basedOn: {
              symptoms: condition.symptoms,
              conditions: [condition.condition],
              history: [],
              riskFactors: ['cárie profunda']
            }
          }))
        }
        break

      case 'Gengivite':
        recommendations.push(this.createRecommendation({
          patientId,
          treatmentId: 'cleaning',
          confidenceScore: 98,
          priority: 'medium',
          reasoning: [
            'Inflamação gengival detectada',
            'Remoção de biofilme necessária',
            'Prevenção de progressão para periodontite'
          ],
          basedOn: {
            symptoms: condition.symptoms,
            conditions: [condition.condition],
            history: [],
            riskFactors: ['acúmulo de placa']
          }
        }))
        break
    }

    return recommendations
  }

  private generatePreventiveRecommendations(patientId: string): AIRecommendation[] {
    // Simular análise de risco baseada em histórico do paciente
    const riskFactors = this.analyzeRiskFactors(patientId)
    const recommendations: AIRecommendation[] = []

    if (riskFactors.cariesRisk > 0.7) {
      recommendations.push(this.createRecommendation({
        patientId,
        treatmentId: 'fluoride',
        confidenceScore: 85,
        priority: 'medium',
        reasoning: [
          'Alto risco de cáries identificado',
          'Aplicação preventiva de flúor recomendada',
          'Redução de 40% no risco de novas cáries'
        ],
        basedOn: {
          symptoms: [],
          conditions: [],
          history: ['múltiplas restaurações', 'higiene irregular'],
          riskFactors: ['dieta cariogênica', 'fluxo salivar reduzido']
        }
      }))
    }

    return recommendations
  }

  private analyzeRiskFactors(patientId: string): {
    cariesRisk: number
    periodontalRisk: number
    overallRisk: number
  } {
    // Simular análise de fatores de risco
    // Em produção, isso seria baseado em dados reais do paciente
    return {
      cariesRisk: Math.random() * 1,
      periodontalRisk: Math.random() * 1,
      overallRisk: Math.random() * 1
    }
  }

  private createRecommendation(data: {
    patientId: string
    treatmentId: string
    confidenceScore: number
    priority: AIRecommendation['priority']
    reasoning: string[]
    basedOn: AIRecommendation['basedOn']
  }): AIRecommendation {
    const treatment = treatments.find(t => t.id === data.treatmentId)!
    
    return {
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      patientId: data.patientId,
      treatmentId: data.treatmentId,
      treatment,
      confidenceScore: data.confidenceScore,
      priority: data.priority,
      reasoning: data.reasoning,
      basedOn: data.basedOn,
      successProbability: Math.floor(Math.random() * 30) + 70, // 70-100%
      estimatedOutcome: this.generateOutcomePrediction(treatment),
      suggestedStartDate: new Date(),
      estimatedDuration: this.estimateTreatmentDuration(treatment),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      aiModel: 'DentalAI-v2.1',
      modelVersion: '2.1.0'
    }
  }

  private generateOutcomePrediction(treatment: Treatment): string {
    const outcomes = {
      'cleaning': 'Redução significativa da inflamação gengival em 7-14 dias',
      'fluoride': 'Fortalecimento do esmalte e redução do risco de cáries em 40%',
      'filling_composite': 'Restauração funcional com durabilidade estimada de 8-12 anos',
      'crown': 'Proteção completa do dente com expectativa de vida de 15-20 anos',
      'root_canal': 'Eliminação da infecção com taxa de sucesso de 95%',
      'extraction': 'Remoção completa com cicatrização em 10-14 dias',
      'implant': 'Osteointegração completa em 3-6 meses com taxa de sucesso de 98%'
    }
    
    return outcomes[treatment.id as keyof typeof outcomes] || 'Melhora significativa dos sintomas'
  }

  private estimateTreatmentDuration(treatment: Treatment): number {
    // Estimar duração total do tratamento em dias
    const baseDuration = {
      'low': 1,
      'medium': 7,
      'high': 21,
      'very_high': 90
    }
    
    return baseDuration[treatment.complexity]
  }

  // Gerar insights clínicos
  generateClinicalInsights(): void {
    const insights: AIInsight[] = [
      {
        id: 'insight-1',
        type: 'trend',
        title: 'Aumento de Casos de Gengivite',
        description: 'Detectado aumento de 25% nos casos de gengivite nas últimas 4 semanas. Recomenda-se intensificar campanhas de higiene oral.',
        severity: 'warning',
        clinicWide: true,
        data: {
          increase: 25,
          period: '4 weeks',
          affectedPatients: 15
        },
        actionItems: [
          'Revisar protocolos de orientação de higiene',
          'Agendar consultas preventivas',
          'Criar campanha educativa'
        ],
        isRead: false,
        isDismissed: false,
        createdAt: new Date()
      },
      {
        id: 'insight-2',
        type: 'optimization',
        title: 'Oportunidade de Otimização',
        description: 'Análise de agendamentos sugere que consultas de 30min podem ser otimizadas para 25min, aumentando capacidade em 8%.',
        severity: 'info',
        clinicWide: true,
        data: {
          timeReduction: 5,
          capacityIncrease: 8,
          affectedProcedures: ['limpeza', 'consulta']
        },
        actionItems: [
          'Revisar protocolos de atendimento',
          'Treinar equipe para eficiência',
          'Ajustar templates de agendamento'
        ],
        isRead: false,
        isDismissed: false,
        createdAt: new Date()
      }
    ]

    this.insights.push(...insights)
  }

  // Métodos públicos
  getRecommendations(patientId: string): AIRecommendation[] {
    return this.recommendations.get(patientId) || []
  }

  getRecommendationById(id: string): AIRecommendation | null {
    for (const recs of this.recommendations.values()) {
      const found = recs.find(r => r.id === id)
      if (found) return found
    }
    return null
  }

  updateRecommendationStatus(
    id: string, 
    status: AIRecommendation['status'],
    reviewedBy?: string,
    reviewNotes?: string
  ): boolean {
    const recommendation = this.getRecommendationById(id)
    if (!recommendation) return false

    recommendation.status = status
    recommendation.reviewedBy = reviewedBy
    recommendation.reviewDate = new Date()
    recommendation.reviewNotes = reviewNotes
    recommendation.updatedAt = new Date()

    return true
  }

  getInsights(type?: AIInsight['type']): AIInsight[] {
    let insights = [...this.insights]
    
    if (type) {
      insights = insights.filter(i => i.type === type)
    }

    return insights.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  markInsightAsRead(id: string): boolean {
    const insight = this.insights.find(i => i.id === id)
    if (!insight) return false

    insight.isRead = true
    return true
  }

  dismissInsight(id: string): boolean {
    const insight = this.insights.find(i => i.id === id)
    if (!insight) return false

    insight.isDismissed = true
    return true
  }

  // Análise de padrões e tendências
  analyzeTrends(): {
    treatmentTrends: Array<{
      treatment: string
      change: number
      period: string
    }>
    riskPatterns: Array<{
      riskFactor: string
      prevalence: number
      impact: string
    }>
  } {
    return {
      treatmentTrends: [
        { treatment: 'Limpeza Dental', change: 15, period: 'último mês' },
        { treatment: 'Restaurações', change: -8, period: 'último mês' },
        { treatment: 'Tratamentos Preventivos', change: 22, period: 'último mês' }
      ],
      riskPatterns: [
        { riskFactor: 'Higiene Inadequada', prevalence: 35, impact: 'Alto risco de gengivite' },
        { riskFactor: 'Dieta Cariogênica', prevalence: 28, impact: 'Aumento de cáries' },
        { riskFactor: 'Bruxismo', prevalence: 12, impact: 'Desgaste dental' }
      ]
    }
  }

  // Predição de necessidades futuras
  predictFutureNeeds(patientId: string): {
    upcomingTreatments: Array<{
      treatment: string
      probability: number
      timeframe: string
      reasoning: string
    }>
    preventiveMeasures: Array<{
      measure: string
      effectiveness: number
      description: string
    }>
  } {
    return {
      upcomingTreatments: [
        {
          treatment: 'Limpeza Dental',
          probability: 95,
          timeframe: '6 meses',
          reasoning: 'Baseado no histórico de higiene oral'
        },
        {
          treatment: 'Verificação Ortodôntica',
          probability: 60,
          timeframe: '1 ano',
          reasoning: 'Crescimento ósseo e desenvolvimento dental'
        }
      ],
      preventiveMeasures: [
        {
          measure: 'Aplicação de Selante',
          effectiveness: 80,
          description: 'Prevenção de cáries em molares posteriores'
        },
        {
          measure: 'Orientação de Escovação',
          effectiveness: 70,
          description: 'Melhora na técnica de higienização'
        }
      ]
    }
  }

  // Estatísticas da IA
  getAIStats(): {
    recommendationsGenerated: number
    acceptanceRate: number
    averageConfidence: number
    treatmentSuccessRate: number
    insightsCreated: number
  } {
    const allRecommendations = Array.from(this.recommendations.values()).flat()
    const acceptedRecommendations = allRecommendations.filter(r => r.status === 'accepted')
    
    return {
      recommendationsGenerated: allRecommendations.length,
      acceptanceRate: allRecommendations.length > 0 
        ? (acceptedRecommendations.length / allRecommendations.length) * 100 
        : 0,
      averageConfidence: allRecommendations.length > 0
        ? allRecommendations.reduce((sum, r) => sum + r.confidenceScore, 0) / allRecommendations.length
        : 0,
      treatmentSuccessRate: 94.2, // Simulado
      insightsCreated: this.insights.length
    }
  }
}

// Instância singleton do serviço
export const aiTreatmentService = new AITreatmentService()

// Helpers e utilitários
export const getConfidenceColor = (score: number): string => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

export const getPriorityColor = (priority: AIRecommendation['priority']): string => {
  switch (priority) {
    case 'urgent': return 'text-red-600'
    case 'high': return 'text-orange-600'
    case 'medium': return 'text-blue-600'
    case 'low': return 'text-gray-600'
    default: return 'text-gray-600'
  }
}

export const getPriorityLabel = (priority: AIRecommendation['priority']): string => {
  const labels = {
    urgent: 'Urgente',
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa'
  }
  return labels[priority]
}

export const getComplexityLabel = (complexity: Treatment['complexity']): string => {
  const labels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    very_high: 'Muito Alta'
  }
  return labels[complexity]
}