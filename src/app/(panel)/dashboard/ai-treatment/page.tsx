'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Brain,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Eye,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Target,
  Zap,
  Activity,
  Award,
  Users,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import getSesion from '@/lib/getSession'
import { 
  aiTreatmentService,
  type AIRecommendation,
  type AIInsight,
  getConfidenceColor,
  getPriorityColor,
  getPriorityLabel,
  getComplexityLabel
} from '@/lib/ai-treatment'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AITreatmentPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recommendations' | 'insights' | 'analytics' | 'predictions'>('dashboard')
  
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string>('patient-1')
  
  useEffect(() => {
    // Verificar plano do usuário
    const checkUserPlan = async () => {
      try {
        const session = await getSesion()
        setUserPlan(session?.user?.plan || 'BASIC')
      } catch (error) {
        console.error('Erro ao verificar plano:', error)
      }
    }
    checkUserPlan()

    // Carregar dados
    loadAIData()
  }, [selectedPatient])

  // Se não for plano premium, mostrar upgrade
  if (userPlan !== 'PREMIUM') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            IA para Tratamentos
          </h2>
          <p className="text-gray-600 mb-6">
            Utilize inteligência artificial avançada para recomendações de tratamento personalizadas, análise preditiva e insights clínicos automatizados.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Esta funcionalidade está disponível apenas no plano Premium.
          </p>
          <Link href="/dashboard/plans">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Star className="w-4 h-4 mr-2" />
              Fazer Upgrade para Premium
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const loadAIData = () => {
    const recs = aiTreatmentService.getRecommendations(selectedPatient)
    const allInsights = aiTreatmentService.getInsights()
    
    setRecommendations(recs)
    setInsights(allInsights)
  }

  const handleAcceptRecommendation = (id: string) => {
    aiTreatmentService.updateRecommendationStatus(id, 'accepted', 'Dr. Sistema', 'Recomendação aceita pelo profissional')
    loadAIData()
  }

  const handleRejectRecommendation = (id: string) => {
    aiTreatmentService.updateRecommendationStatus(id, 'rejected', 'Dr. Sistema', 'Recomendação rejeitada após análise')
    loadAIData()
  }

  const renderDashboard = () => {
    const stats = aiTreatmentService.getAIStats()
    const trends = aiTreatmentService.analyzeTrends()
    
    return (
      <div className="space-y-6">
        {/* Estatísticas da IA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recomendações Geradas</p>
                <p className="text-3xl font-bold text-purple-600">{stats.recommendationsGenerated}</p>
              </div>
              <Brain className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Aceitação</p>
                <p className="text-3xl font-bold text-green-600">{stats.acceptanceRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confiança Média</p>
                <p className="text-3xl font-bold text-blue-600">{stats.averageConfidence.toFixed(1)}%</p>
              </div>
              <Target className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.treatmentSuccessRate}%</p>
              </div>
              <Award className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Insights Prioritários */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                Insights Prioritários ({insights.filter(i => !i.isDismissed).length})
              </h3>
              <Button
                onClick={() => setActiveTab('insights')}
                variant="outline"
                size="sm"
              >
                Ver Todos
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {insights.filter(i => !i.isDismissed).slice(0, 3).map(insight => (
                <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                  insight.severity === 'critical' ? 'bg-red-50 border-red-500' :
                  insight.severity === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`text-lg mr-2 ${
                          insight.type === 'trend' ? '📈' :
                          insight.type === 'risk_alert' ? '⚠️' :
                          insight.type === 'optimization' ? '⚡' : '💡'
                        }`}>
                          {insight.type === 'trend' ? '📈' :
                           insight.type === 'risk_alert' ? '⚠️' :
                           insight.type === 'optimization' ? '⚡' : '💡'}
                        </span>
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                      {insight.actionItems && insight.actionItems.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-2">Ações Recomendadas:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {insight.actionItems.slice(0, 2).map((action, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => aiTreatmentService.dismissInsight(insight.id)}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tendências de Tratamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                Tendências de Tratamento
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {trends.treatmentTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{trend.treatment}</p>
                      <p className="text-sm text-gray-600">{trend.period}</p>
                    </div>
                    <div className={`flex items-center ${
                      trend.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.change > 0 ? '↗' : '↘'}
                      <span className="ml-1 font-semibold">{Math.abs(trend.change)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                Padrões de Risco
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {trends.riskPatterns.map((pattern, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{pattern.riskFactor}</p>
                      <span className="text-sm font-semibold text-orange-600">
                        {pattern.prevalence}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{pattern.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recomendações Recentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Zap className="w-5 h-5 text-purple-600 mr-2" />
                Recomendações Recentes
              </h3>
              <Button
                onClick={() => setActiveTab('recommendations')}
                variant="outline"
                size="sm"
              >
                Ver Todas
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recommendations.slice(0, 3).map(recommendation => (
                <div key={recommendation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {recommendation.treatment.category.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{recommendation.treatment.name}</h4>
                      <p className="text-sm text-gray-600">
                        Confiança: <span className={getConfidenceColor(recommendation.confidenceScore)}>
                          {recommendation.confidenceScore}%
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recommendation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      recommendation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      recommendation.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getPriorityLabel(recommendation.priority)}
                    </span>
                    {recommendation.status === 'pending' && (
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => handleAcceptRecommendation(recommendation.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleRejectRecommendation(recommendation.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          ✕
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderRecommendations = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Paciente
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="patient-1">Maria Silva</option>
              <option value="patient-2">João Santos</option>
              <option value="patient-3">Ana Costa</option>
            </select>
          </div>

          <Button
            onClick={() => {
              aiTreatmentService.generateRecommendations(selectedPatient)
              loadAIData()
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            Gerar Novas Recomendações
          </Button>
        </div>
      </div>

      {/* Lista de Recomendações */}
      <div className="space-y-4">
        {recommendations.map(recommendation => (
          <div key={recommendation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">
                    {recommendation.treatment.category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {recommendation.treatment.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {recommendation.treatment.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recommendation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        recommendation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        recommendation.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        Prioridade: {getPriorityLabel(recommendation.priority)}
                      </span>
                      <span className={`text-sm font-medium ${getConfidenceColor(recommendation.confidenceScore)}`}>
                        Confiança: {recommendation.confidenceScore}%
                      </span>
                      <span className="text-sm text-gray-500">
                        Sucesso Estimado: {recommendation.successProbability}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {recommendation.status === 'pending' ? (
                    <>
                      <Button
                        onClick={() => handleAcceptRecommendation(recommendation.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Aceitar
                      </Button>
                      <Button
                        onClick={() => handleRejectRecommendation(recommendation.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Rejeitar
                      </Button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      recommendation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      recommendation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {recommendation.status === 'accepted' ? 'Aceito' :
                       recommendation.status === 'rejected' ? 'Rejeitado' : 'Modificado'}
                    </span>
                  )}
                </div>
              </div>

              {/* Justificativa da IA */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Justificativa da IA:</h4>
                <ul className="space-y-1">
                  {recommendation.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Baseado em */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {recommendation.basedOn.symptoms.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-gray-600 mb-1">Sintomas:</h5>
                    <ul className="text-xs text-gray-600">
                      {recommendation.basedOn.symptoms.map((symptom, index) => (
                        <li key={index}>• {symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recommendation.basedOn.conditions.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-gray-600 mb-1">Condições:</h5>
                    <ul className="text-xs text-gray-600">
                      {recommendation.basedOn.conditions.map((condition, index) => (
                        <li key={index}>• {condition}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recommendation.basedOn.riskFactors.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-gray-600 mb-1">Fatores de Risco:</h5>
                    <ul className="text-xs text-gray-600">
                      {recommendation.basedOn.riskFactors.map((risk, index) => (
                        <li key={index}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Predição de Resultado */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Resultado Esperado:</h4>
                <p className="text-sm text-gray-700 mb-2">{recommendation.estimatedOutcome}</p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Duração estimada: {recommendation.estimatedDuration} dias</span>
                  <span>Modelo: {recommendation.aiModel}</span>
                  <span>{format(recommendation.createdAt, 'dd/MM/yyyy HH:mm')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma recomendação encontrada</h3>
          <p className="text-gray-600 mb-4">Clique em "Gerar Novas Recomendações" para analisar este paciente</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  IA para Tratamentos
                </h1>
                <p className="text-sm text-gray-600">
                  Recomendações inteligentes e insights clínicos
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Premium
              </span>
            </div>
          </div>

          {/* Navegação de Tabs */}
          <div className="flex space-x-1 mt-4 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'recommendations', label: 'Recomendações', icon: Zap },
              { id: 'insights', label: 'Insights', icon: Lightbulb },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'predictions', label: 'Predições', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'recommendations' && renderRecommendations()}
        {activeTab === 'insights' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Insights Detalhados</h3>
            <p className="text-gray-600">Análise aprofundada de padrões e tendências...</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Avançados</h3>
            <p className="text-gray-600">Métricas de performance da IA...</p>
          </div>
        )}
        {activeTab === 'predictions' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Predições Futuras</h3>
            <p className="text-gray-600">Análise preditiva para planejamento...</p>
          </div>
        )}
      </main>
    </div>
  )
}