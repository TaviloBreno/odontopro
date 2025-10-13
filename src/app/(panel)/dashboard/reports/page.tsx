'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  BarChart3,
  FileText,
  Download,
  Filter,
  ChevronDown,
  Star,
  AlertTriangle,
  PieChart,
  Activity,
  Target,
  Award,
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import Link from 'next/link'
import getSesion from '@/lib/getSession'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

// Dados fictícios para relatórios
const reportData = {
  summary: {
    totalAppointments: 156,
    totalRevenue: 18750,
    totalPatients: 89,
    averageTicket: 120.19,
    appointmentsThisMonth: 42,
    revenueThisMonth: 5040,
    newPatientsThisMonth: 12,
    appointmentsGrowth: 15.8,
    revenueGrowth: 23.5,
    patientsGrowth: 8.3
  },
  appointmentsByMonth: [
    { month: 'Jan', count: 32, revenue: 3840 },
    { month: 'Fev', count: 28, revenue: 3360 },
    { month: 'Mar', count: 35, revenue: 4200 },
    { month: 'Abr', count: 39, revenue: 4680 },
    { month: 'Mai', count: 42, revenue: 5040 }
  ],
  topServices: [
    { name: 'Limpeza Dental', count: 45, revenue: 5400, percentage: 28.8 },
    { name: 'Consulta Básica', count: 38, revenue: 3040, percentage: 24.4 },
    { name: 'Obturação', count: 25, revenue: 5000, percentage: 16.0 },
    { name: 'Tratamento Canal', count: 12, revenue: 3600, percentage: 7.7 },
    { name: 'Outros', count: 36, revenue: 1710, percentage: 23.1 }
  ],
  recentAppointments: [
    { id: 1, patient: 'Maria Silva', service: 'Limpeza Dental', date: '2024-05-15', value: 120, status: 'Concluída' },
    { id: 2, patient: 'João Santos', service: 'Consulta Básica', date: '2024-05-14', value: 80, status: 'Concluída' },
    { id: 3, patient: 'Ana Costa', service: 'Obturação', date: '2024-05-14', value: 200, status: 'Concluída' },
    { id: 4, patient: 'Pedro Lima', service: 'Limpeza Dental', date: '2024-05-13', value: 120, status: 'Concluída' },
    { id: 5, patient: 'Carmen Rocha', service: 'Tratamento Canal', date: '2024-05-13', value: 300, status: 'Agendada' }
  ]
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showFilters, setShowFilters] = useState(false)
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [selectedChart, setSelectedChart] = useState('revenue')

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
  }, [])

  // Dados avançados para plano profissional
  const professionalData = {
    patientSegments: [
      { name: 'Novos Pacientes', value: 35, color: '#3b82f6' },
      { name: 'Pacientes Recorrentes', value: 45, color: '#10b981' },
      { name: 'Pacientes Inativos', value: 20, color: '#f59e0b' }
    ],
    treatmentTypes: [
      { name: 'Limpeza', count: 85, revenue: 8500 },
      { name: 'Restauração', count: 42, revenue: 12600 },
      { name: 'Canal', count: 15, revenue: 22500 },
      { name: 'Implante', count: 8, revenue: 32000 },
      { name: 'Ortodontia', count: 12, revenue: 18000 }
    ],
    profitabilityTrend: [
      { month: 'Jan', receita: 15000, custos: 8000, lucro: 7000 },
      { month: 'Fev', receita: 18000, custos: 9500, lucro: 8500 },
      { month: 'Mar', receita: 22000, custos: 11000, lucro: 11000 },
      { month: 'Abr', receita: 25000, custos: 12500, lucro: 12500 },
      { month: 'Mai', receita: 20000, custos: 10500, lucro: 9500 },
      { month: 'Jun', receita: 28000, custos: 14000, lucro: 14000 }
    ],
    performanceMetrics: {
      avgSessionValue: 285.50,
      patientRetention: 78,
      conversionRate: 65,
      patientSatisfaction: 4.8,
      noShowRate: 12
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700">
                ← Dashboard
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Relatórios</h1>
                <p className="text-sm text-gray-600">
                  Acompanhe o desempenho da sua clínica
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden sm:flex"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Filter Bar */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="week">Última semana</option>
                  <option value="month">Último mês</option>
                  <option value="quarter">Último trimestre</option>
                  <option value="year">Último ano</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Plan Limitation Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Plano Básico - Relatórios Limitados</h3>
              <p className="text-sm text-yellow-700">
                Você tem acesso aos relatórios básicos. 
                <Link href="/dashboard/plans" className="underline hover:text-yellow-900 ml-1">
                  Faça upgrade para relatórios avançados, gráficos interativos e exportação em PDF
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{reportData.summary.appointmentsThisMonth}</p>
                <p className="text-gray-600 text-sm">Consultas este mês</p>
                <p className={`text-xs mt-1 ${reportData.summary.appointmentsGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(reportData.summary.appointmentsGrowth)} vs mês anterior
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.revenueThisMonth)}
                </p>
                <p className="text-gray-600 text-sm">Receita este mês</p>
                <p className={`text-xs mt-1 ${reportData.summary.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(reportData.summary.revenueGrowth)} vs mês anterior
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{reportData.summary.newPatientsThisMonth}</p>
                <p className="text-gray-600 text-sm">Novos pacientes</p>
                <p className={`text-xs mt-1 ${reportData.summary.patientsGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(reportData.summary.patientsGrowth)} vs mês anterior
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.averageTicket)}
                </p>
                <p className="text-gray-600 text-sm">Ticket médio</p>
                <p className="text-xs text-gray-500 mt-1">Receita / Consultas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Monthly Performance Chart (Simplified) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Performance Mensal</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {reportData.appointmentsByMonth.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full" 
                          style={{ width: `${(month.count / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{month.count} consultas</p>
                    <p className="text-xs text-gray-500">{formatCurrency(month.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Serviços Mais Procurados</h2>
              <Star className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {reportData.topServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-emerald-800">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.count} consultas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(service.revenue)}</p>
                    <p className="text-xs text-gray-500">{service.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Consultas Recentes</h2>
              <Link href="/dashboard/appointments">
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                      Paciente
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                      Serviço
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                      Data
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                      Valor
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.recentAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="py-4">
                        <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString('pt-BR')}
                        </p>
                      </td>
                      <td className="py-4">
                        <p className="text-sm font-medium text-emerald-600">
                          {formatCurrency(appointment.value)}
                        </p>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'Concluída' 
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'Agendada'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo Geral</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalAppointments}</p>
              <p className="text-sm text-gray-600">Total de Consultas</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(reportData.summary.totalRevenue)}
              </p>
              <p className="text-sm text-gray-600">Receita Total</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalPatients}</p>
              <p className="text-sm text-gray-600">Total de Pacientes</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(reportData.summary.averageTicket)}
              </p>
              <p className="text-sm text-gray-600">Ticket Médio</p>
            </div>
          </div>
        </div>

        {/* Funcionalidades Profissionais ou Prompt de Upgrade */}
        {userPlan === 'PROFESSIONAL' ? (
          <>
            {/* Métricas de Performance */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Métricas de Performance</h2>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-600">Plano Professional</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Ticket Médio</p>
                      <p className="text-xl font-bold text-blue-900">
                        {formatCurrency(professionalData.performanceMetrics.avgSessionValue)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+5.2% vs mês anterior</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Retenção</p>
                      <p className="text-xl font-bold text-green-900">
                        {professionalData.performanceMetrics.patientRetention}%
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+2.1% vs mês anterior</span>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Conversão</p>
                      <p className="text-xl font-bold text-purple-900">
                        {professionalData.performanceMetrics.conversionRate}%
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+3.5% vs mês anterior</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Satisfação</p>
                      <p className="text-xl font-bold text-yellow-900">
                        {professionalData.performanceMetrics.patientSatisfaction}⭐
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <Eye className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">658 avaliações</span>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">No-Show</p>
                      <p className="text-xl font-bold text-red-900">
                        {professionalData.performanceMetrics.noShowRate}%
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowDown className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">-1.8% vs mês anterior</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Análise de Segmentação de Pacientes */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Segmentação de Pacientes</h3>
                <div className="space-y-4">
                  {professionalData.patientSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">{segment.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{segment.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tratamentos Mais Lucrativos</h3>
                <div className="space-y-4">
                  {professionalData.treatmentTypes.map((treatment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{treatment.name}</p>
                        <p className="text-sm text-gray-600">{treatment.count} procedimentos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(treatment.revenue)}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(treatment.revenue / treatment.count)}/proc
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Análise de Rentabilidade */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Análise de Rentabilidade</h3>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {/* Export functionality */}}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={professionalData.profitabilityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(value as number), name]}
                      labelStyle={{ color: '#333' }}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="receita" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Receita"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="custos" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      name="Custos"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lucro" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Lucro Líquido"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Badges Profissionais */}
            <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <Award className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900">
                    🎉 Parabéns! Você está no Plano Professional
                  </h3>
                  <p className="text-emerald-700 mt-1">
                    Acesso completo a relatórios avançados, análises de rentabilidade e exportação em PDF.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Upgrade Prompt para usuários básicos */
          <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <TrendingUp className="w-8 h-8 text-emerald-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                  Quer relatórios mais detalhados?
                </h3>
                <p className="text-emerald-700 mb-4">
                  Upgrade para o plano Professional e tenha acesso a gráficos interativos, 
                  relatórios personalizados, exportação em PDF e análises avançadas de desempenho.
                </p>
                <Link href="/dashboard/plans">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Fazer Upgrade
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}