'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  LineChart,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  Download,
  Filter,
  Calendar,
  CreditCard,
  Wallet,
  Building,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { 
  financialAnalyticsService,
  type FinancialMetrics,
  type RevenueBreakdown,
  type ProfitLossStatement,
  type BudgetAnalysis,
  type FinancialForecast,
  type PatientValueAnalysis
} from '@/lib/financial-analytics'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function FinancialAnalyticsPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'profitability' | 'cashflow' | 'budget' | 'forecast' | 'patients'>('overview')
  
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null)
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdown | null>(null)
  const [profitLoss, setProfitLoss] = useState<ProfitLossStatement[]>([])
  const [budgetAnalysis, setBudgetAnalysis] = useState<BudgetAnalysis | null>(null)
  const [forecast, setForecast] = useState<FinancialForecast | null>(null)
  const [patientAnalysis, setPatientAnalysis] = useState<PatientValueAnalysis | null>(null)
  
  const [selectedPeriod, setSelectedPeriod] = useState('3months')
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    // Verificar plano do usuário
    const checkUserPlan = async () => {
      try {
        const session = await getSession()
        setUserPlan(session?.user?.plan || 'BASIC')
      } catch (error) {
        console.error('Erro ao verificar plano:', error)
      }
    }
    checkUserPlan()

    // Carregar dados
    loadFinancialData()
  }, [])

  // Se não for plano premium, mostrar upgrade
  if (userPlan !== 'PREMIUM') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <BarChart3 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Analytics Financeiros Avançados
          </h2>
          <p className="text-gray-600 mb-6">
            Análises financeiras detalhadas com métricas avançadas, previsões de receita, análise de lucratividade por tratamento e relatórios executivos.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Esta funcionalidade está disponível apenas no plano Premium.
          </p>
          <Link href="/dashboard/plans">
            <Button className="bg-green-600 hover:bg-green-700">
              <Star className="w-4 h-4 mr-2" />
              Fazer Upgrade para Premium
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const loadFinancialData = () => {
    setMetrics(financialAnalyticsService.getFinancialMetrics())
    setRevenueBreakdown(financialAnalyticsService.getRevenueBreakdown())
    setProfitLoss(financialAnalyticsService.getProfitLossStatement())
    setBudgetAnalysis(financialAnalyticsService.getBudgetAnalysis())
    setForecast(financialAnalyticsService.getFinancialForecast())
    setPatientAnalysis(financialAnalyticsService.getPatientValueAnalysis())
  }

  const toggleDetails = (key: string) => {
    setShowDetails(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600'
    if (variance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const renderOverview = () => {
    if (!metrics) return null

    const executiveSummary = financialAnalyticsService.generateExecutiveSummary()
    const kpiTrends = financialAnalyticsService.getKPITrends()
    const cashFlowHealth = financialAnalyticsService.getCashFlowHealth()

    return (
      <div className="space-y-6">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Mensal</p>
                <p className="text-3xl font-bold text-green-600">
                  {financialAnalyticsService.formatCurrency(metrics.revenue.monthly)}
                </p>
                <p className={`text-sm flex items-center mt-1 ${getVarianceColor(metrics.revenue.growth)}`}>
                  {getTrendIcon('up')}
                  <span className="ml-1">{metrics.revenue.growth}%</span>
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Margem Líquida</p>
                <p className="text-3xl font-bold text-blue-600">{metrics.profitability.netMargin}%</p>
                <p className="text-sm text-gray-500 mt-1">Acima da média</p>
              </div>
              <Target className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fluxo de Caixa</p>
                <p className="text-3xl font-bold text-purple-600">
                  {financialAnalyticsService.formatCurrency(metrics.cashFlow.current)}
                </p>
                <p className={`text-sm mt-1 ${
                  cashFlowHealth.status === 'healthy' ? 'text-green-600' :
                  cashFlowHealth.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(cashFlowHealth.daysOfCash)} dias de caixa
                </p>
              </div>
              <Wallet className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ARPU</p>
                <p className="text-3xl font-bold text-orange-600">
                  {financialAnalyticsService.formatCurrency(metrics.kpis.arpu)}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  {getTrendIcon('up')}
                  <span className="ml-1">4.9%</span>
                </p>
              </div>
              <Users className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Status do Fluxo de Caixa */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 text-purple-600 mr-2" />
              Status Financeiro
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  {cashFlowHealth.status === 'healthy' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  ) : cashFlowHealth.status === 'warning' ? (
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                  )}
                  <h4 className="text-lg font-semibold text-gray-900">
                    Fluxo de Caixa: {
                      cashFlowHealth.status === 'healthy' ? 'Saudável' :
                      cashFlowHealth.status === 'warning' ? 'Atenção' : 'Crítico'
                    }
                  </h4>
                </div>
                <div className="space-y-2">
                  {cashFlowHealth.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Tendência de KPIs</h4>
                <div className="space-y-3">
                  {kpiTrends.map(kpi => (
                    <div key={kpi.kpi} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{kpi.kpi}</span>
                        {getTrendIcon(kpi.trend)}
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">
                          {kpi.kpi.includes('Rate') || kpi.kpi.includes('Margin') ? 
                            `${kpi.current}%` : 
                            financialAnalyticsService.formatCurrency(kpi.current)
                          }
                        </span>
                        <span className={`text-sm ml-2 ${getVarianceColor(kpi.change)}`}>
                          {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
              Resumo Executivo
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Principais Insights</h4>
                <div className="space-y-3">
                  {executiveSummary.keyInsights.map((insight, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                      <span className="text-sm text-gray-700">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Ações Recomendadas</h4>
                <div className="space-y-3">
                  {executiveSummary.actionItems.map((action, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></span>
                      <span className="text-sm text-gray-700">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {financialAnalyticsService.formatCurrency(executiveSummary.revenue.value)}
                  </p>
                  <p className="text-sm text-gray-600">Receita Mensal</p>
                  <p className="text-sm text-green-600">+{executiveSummary.revenue.change}%</p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {financialAnalyticsService.formatCurrency(executiveSummary.profit.value)}
                  </p>
                  <p className="text-sm text-gray-600">Lucro Líquido</p>
                  <p className="text-sm text-gray-500">{executiveSummary.profit.margin}% margem</p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {executiveSummary.topTreatments.length}
                  </p>
                  <p className="text-sm text-gray-600">Tratamentos Top</p>
                  <p className="text-sm text-gray-500">
                    {executiveSummary.topTreatments.slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderRevenueAnalysis = () => {
    if (!revenueBreakdown || !metrics) return null

    return (
      <div className="space-y-6">
        {/* Receita por Tratamento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="w-5 h-5 text-green-600 mr-2" />
                Receita por Tratamento
              </h3>
              <Button onClick={() => toggleDetails('treatments')} variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                {showDetails.treatments ? 'Ocultar' : 'Ver'} Detalhes
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {revenueBreakdown.byTreatment.map((treatment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{treatment.treatmentName}</h4>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-gray-700">
                          {treatment.percentage}%
                        </span>
                        <span className={`text-sm flex items-center ${getVarianceColor(treatment.growth)}`}>
                          {getTrendIcon(treatment.growth > 0 ? 'up' : 'down')}
                          <span className="ml-1">{treatment.growth}%</span>
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${treatment.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        {financialAnalyticsService.formatCurrency(treatment.revenue)}
                      </span>
                      {showDetails.treatments && (
                        <div className="text-sm text-gray-600">
                          Crescimento: {treatment.growth}% | Participação: {treatment.percentage}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Métodos de Pagamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                Métodos de Pagamento
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {revenueBreakdown.byPaymentMethod.map((method, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{method.method}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {financialAnalyticsService.formatCurrency(method.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {method.percentage}% • Taxa: {financialAnalyticsService.formatCurrency(method.fees)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-5 h-5 text-purple-600 mr-2" />
                Receita por Convênio
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {revenueBreakdown.byInsurance.map((insurance, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{insurance.provider}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {financialAnalyticsService.formatCurrency(insurance.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {insurance.percentage}% • {insurance.pendingClaims} pendentes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Evolução da Receita */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <LineChart className="w-5 h-5 text-green-600 mr-2" />
              Evolução da Receita
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              {revenueBreakdown.byPeriod.map((period, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {financialAnalyticsService.formatCurrency(period.revenue)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{period.period}</div>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <span className={`flex items-center ${getVarianceColor(period.growth)}`}>
                      {getTrendIcon(period.growth > 0 ? 'up' : 'down')}
                      <span className="ml-1">{period.growth}%</span>
                    </span>
                    <span className="text-gray-500">
                      {period.transactions} transações
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderProfitabilityAnalysis = () => {
    if (!metrics) return null

    const treatmentROI = financialAnalyticsService.getTreatmentROI()

    return (
      <div className="space-y-6">
        {/* Margens de Lucratividade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Margem Bruta</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {metrics.profitability.grossMargin}%
              </div>
              <p className="text-sm text-gray-600">Excelente performance</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Margem Operacional</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {metrics.profitability.operatingMargin}%
              </div>
              <p className="text-sm text-gray-600">Acima da média do setor</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Margem Líquida</h3>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {metrics.profitability.netMargin}%
              </div>
              <p className="text-sm text-gray-600">Ótima rentabilidade</p>
            </div>
          </div>
        </div>

        {/* Lucratividade por Tratamento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 text-green-600 mr-2" />
              Lucratividade por Tratamento
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {metrics.profitability.treatmentProfitability.map((treatment, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{treatment.treatmentName}</h4>
                      <p className="text-sm text-gray-600">{treatment.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {treatment.margin}%
                      </div>
                      <p className="text-sm text-gray-500">margem</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Receita</p>
                      <p className="font-semibold text-green-600">
                        {financialAnalyticsService.formatCurrency(treatment.revenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Custo</p>
                      <p className="font-semibold text-red-600">
                        {financialAnalyticsService.formatCurrency(treatment.cost)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lucro</p>
                      <p className="font-semibold text-blue-600">
                        {financialAnalyticsService.formatCurrency(treatment.profit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Volume</p>
                      <p className="font-semibold text-gray-900">{treatment.volume} un.</p>
                    </div>
                  </div>

                  {showDetails[`treatment-${index}`] && (
                    <div className="pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">Tendência (últimos 3 meses)</h5>
                      <div className="grid grid-cols-3 gap-4">
                        {treatment.trends.map((trend, tIndex) => (
                          <div key={tIndex} className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-sm font-medium text-gray-900">{trend.period}</div>
                            <div className="text-lg font-semibold text-green-600">
                              {financialAnalyticsService.formatCurrency(trend.revenue)}
                            </div>
                            <div className="text-sm text-gray-600">{trend.volume} un. • {trend.margin}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      ROI: <span className="font-semibold text-green-600">
                        {treatmentROI.find(roi => roi.treatmentId === treatment.treatmentId)?.roi.toFixed(1)}%
                      </span>
                    </div>
                    <Button
                      onClick={() => toggleDetails(`treatment-${index}`)}
                      variant="outline"
                      size="sm"
                    >
                      {showDetails[`treatment-${index}`] ? 'Ocultar' : 'Ver'} Tendência
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Analytics Financeiros Avançados
                </h1>
                <p className="text-sm text-gray-600">
                  Análises detalhadas e métricas de performance
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Premium
              </span>
            </div>
          </div>

          {/* Navegação de Tabs */}
          <div className="flex space-x-1 mt-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Activity },
              { id: 'revenue', label: 'Receita', icon: DollarSign },
              { id: 'profitability', label: 'Lucratividade', icon: Target },
              { id: 'cashflow', label: 'Fluxo de Caixa', icon: Wallet },
              { id: 'budget', label: 'Orçamento', icon: Calculator },
              { id: 'forecast', label: 'Previsões', icon: TrendingUp },
              { id: 'patients', label: 'Pacientes', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'revenue' && renderRevenueAnalysis()}
        {activeTab === 'profitability' && renderProfitabilityAnalysis()}
        {activeTab === 'cashflow' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Análise de Fluxo de Caixa</h3>
            <p className="text-gray-600">Projeções detalhadas e análise de liquidez...</p>
          </div>
        )}
        {activeTab === 'budget' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Controle Orçamentário</h3>
            <p className="text-gray-600">Análise de variações e performance vs orçado...</p>
          </div>
        )}
        {activeTab === 'forecast' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Previsões Financeiras</h3>
            <p className="text-gray-600">Cenários e projeções futuras...</p>
          </div>
        )}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Análise de Valor do Paciente</h3>
            <p className="text-gray-600">LTV, segmentação e análise de cohort...</p>
          </div>
        )}
      </main>
    </div>
  )
}